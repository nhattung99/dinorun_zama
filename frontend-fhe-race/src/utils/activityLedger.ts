import { ethers } from "ethers";

const ETHERSCAN_BASE = "https://api-sepolia.etherscan.io/api";
const RACE_OUTCOME_SIG = "RaceOutcome(address,uint8,uint256,uint64)";
const RACE_BOUGHT_SIG = "RaceBoughtWithGm(address,uint64)";
const CHECKIN_SIG = "CheckInCompleted(address,uint256)";
const GM_BOUGHT_SIG = "GmTokensBought(address,uint256)";
const GM_BOUGHT_FHE_SIG = "GmTokensBoughtFHE(address)";

type BaseEntry = { blockNumber: number; txIndex: number; txHash: string; time?: number };

export type LedgerEntry =
  | (BaseEntry & { type: "checkin" })
  | (BaseEntry & { type: "buy_races"; count: number })
  | (BaseEntry & { type: "race"; slot: number; gmDelta: number; prizeWei: bigint })
  | (BaseEntry & { type: "buy_gm_public"; amount: number })
  | (BaseEntry & { type: "buy_gm_fhe" });

function padTopicAddress(addr: string): string {
  const clean = addr.toLowerCase().replace(/^0x/, "");
  return "0x" + "0".repeat(24) + clean;
}

async function getLogsByTopic(contract: string, topic: string, user: string) {
  const apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY as string;
  if (!apiKey) throw new Error("ETHERSCAN API key missing");
  const topic0 = ethers.id(topic);
  const topic1 = padTopicAddress(user);
  const params = new URLSearchParams({
    module: "logs",
    action: "getLogs",
    fromBlock: "0",
    toBlock: "latest",
    address: contract,
    topic0,
    topic1,
    topic0_1_opr: "and",
    apikey: apiKey,
  });
  const url = `${ETHERSCAN_BASE}?${params.toString()}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json?.status !== "1" || !Array.isArray(json?.result)) return [] as any[];
  return json.result as any[];
}

export async function buildUserActivityLedger(contract: string, user: string): Promise<LedgerEntry[]> {
  try {
    const [raceLogs, buyRacesLogs, checkinLogs, gmBuyLogs, gmBuyFheLogs] = await Promise.all([
      getLogsByTopic(contract, RACE_OUTCOME_SIG, user),
      getLogsByTopic(contract, RACE_BOUGHT_SIG, user),
      getLogsByTopic(contract, CHECKIN_SIG, user),
      getLogsByTopic(contract, GM_BOUGHT_SIG, user),
      getLogsByTopic(contract, GM_BOUGHT_FHE_SIG, user),
    ]);

    const entries: LedgerEntry[] = [];

    for (const log of checkinLogs) {
      entries.push({
        type: "checkin",
        blockNumber: Number(log.blockNumber),
        txIndex: Number(log.transactionIndex),
        txHash: String(log.transactionHash),
      });
    }

    for (const log of buyRacesLogs) {
      const data: string = log?.data || "0x";
      if (data.length < 2 + 64) continue;
      const cntHex = data.slice(2 + 64 - 64, 2 + 64);
      const count = Number(BigInt("0x" + cntHex));
      entries.push({
        type: "buy_races",
        count: Number.isFinite(count) ? count : 0,
        blockNumber: Number(log.blockNumber),
        txIndex: Number(log.transactionIndex),
        txHash: String(log.transactionHash),
      });
    }

    for (const log of raceLogs) {
      const data: string = log?.data || "0x";
      if (data.length < 2 + 64 * 3) continue;
      const slotHex = data.slice(2, 2 + 64);
      const prizeWeiHex = data.slice(2 + 64, 2 + 64 * 2);
      const gmDeltaHex = data.slice(2 + 64 * 2, 2 + 64 * 3);
      const slot = Number(BigInt("0x" + slotHex));
      const prizeWei = BigInt("0x" + prizeWeiHex);
      const gmDelta = Number(BigInt("0x" + gmDeltaHex));
      entries.push({
        type: "race",
        slot: Number.isFinite(slot) ? slot : 0,
        gmDelta: Number.isFinite(gmDelta) ? gmDelta : 0,
        prizeWei,
        blockNumber: Number(log.blockNumber),
        txIndex: Number(log.transactionIndex),
        txHash: String(log.transactionHash),
      });
    }

    for (const log of gmBuyLogs) {
      const data: string = log?.data || "0x";
      if (data.length < 2 + 64) continue;
      const amountHex = data.slice(2, 2 + 64);
      const amt = Number(BigInt("0x" + amountHex));
      entries.push({
        type: "buy_gm_public",
        amount: Number.isFinite(amt) ? amt : 0,
        blockNumber: Number(log.blockNumber),
        txIndex: Number(log.transactionIndex),
        txHash: String(log.transactionHash),
      });
    }

    for (const log of gmBuyFheLogs) {
      entries.push({
        type: "buy_gm_fhe",
        blockNumber: Number(log.blockNumber),
        txIndex: Number(log.transactionIndex),
        txHash: String(log.transactionHash),
      });
    }

    // Order by block, then tx index
    entries.sort((a, b) => (a.blockNumber - b.blockNumber) || (a.txIndex - b.txIndex));
    return entries;
  } catch {
    return [];
  }
}

export function computeAggregatesFromLedger(entries: LedgerEntry[]): {
  availableRaces: number;
  gmEstimated: number;
  pendingEth: number;
  lastSlot: number | null;
  racesBought: number;
  racesDone: number;
  checkins: number;
} {
  let racesBought = 0;
  let checkins = 0;
  let racesDone = 0;
  let gmFromPrizes = 0;
  let pendingEthWei = 0n;
  let lastSlot: number | null = null;

  for (const e of entries) {
    if (e.type === "checkin") checkins += 1;
    else if (e.type === "buy_races") racesBought += e.count;
    else if (e.type === "race") {
      racesDone += 1;
      lastSlot = e.slot;
      if (e.slot === 0) pendingEthWei += ethers.parseEther("0.1");
      else if (e.slot === 1) pendingEthWei += ethers.parseEther("0.01");
      gmFromPrizes += e.gmDelta;
      if (e.prizeWei > 0n) pendingEthWei += e.prizeWei;
    } else if (e.type === "buy_gm_public") {
      // public GM purchases increase GM pool, but we account net in gmEstimated below
      gmFromPrizes += 0; // no-op; keep for clarity
    }
  }

  const availableRaces = Math.max(0, racesBought + checkins - racesDone);
  const gmEstimated = Math.max(0, gmFromPrizes - 10 * racesBought);
  const pendingEth = Number(ethers.formatEther(pendingEthWei));
  return { availableRaces, gmEstimated, pendingEth, lastSlot, racesBought, racesDone, checkins };
}


