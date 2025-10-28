/*
 Script kiểm thử logic CryptoDinoRun_Simple trên Sepolia
 Chạy:
   npx hardhat run scripts/test_logic.ts --network sepolia

 Yêu cầu:
 - PRIVATE KEY trên network sepolia đã cấu hình trong hardhat.config.ts và có ETH testnet
*/

import { ethers, network } from "hardhat";
import fs from "fs";
import path from "path";

// Địa chỉ contract (fallback). Ưu tiên lấy từ deployments/sepolia/CryptoDinoRun_Simple.json nếu có
const FALLBACK_CONTRACT_ADDRESS = "0x0A12d70f28d9fFE87f9D437B4ECdF530febB867a";

// ABI tối thiểu cần dùng cho test
const ABI = [
  // core actions
  { inputs: [], name: "race", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "claimETH", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [
      { internalType: "externalEuint64", name: "encryptedAmount", type: "bytes32" },
      { internalType: "bytes", name: "proof", type: "bytes" },
    ],
    name: "buyGmTokens",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "externalEuint64", name: "encryptedOne", type: "bytes32" },
      { internalType: "bytes", name: "proof", type: "bytes" },
    ],
    name: "buyRaceWithGm",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // views
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserRaces",
    outputs: [{ internalType: "euint64", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserGmBalance",
    outputs: [{ internalType: "euint64", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getClaimableEth",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "canGmToday",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getTimeUntilNextGm",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // events (để decode nếu cần)
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "string", name: "result", type: "string" },
    ],
    name: "RaceCompleted",
    type: "event",
  },
];

function loadDeployedAddress(): string {
  try {
    const fp = path.join(__dirname, "../deployments/sepolia/CryptoDinoRun_Simple.json");
    if (fs.existsSync(fp)) {
      const json = JSON.parse(fs.readFileSync(fp, "utf-8"));
      if (json.address && typeof json.address === "string") return json.address;
    }
  } catch {}
  return FALLBACK_CONTRACT_ADDRESS;
}

async function main() {
  console.log("=== Test logic CryptoDinoRun_Simple ===");
  console.log("Network:", network.name);

  const [signer] = await ethers.getSigners();
  const addr = await signer.getAddress();
  const bal = await signer.provider!.getBalance(addr);
  console.log("Signer:", addr);
  console.log("Balance:", ethers.formatEther(bal), "ETH");

  const contractAddr = loadDeployedAddress();
  console.log("Contract:", contractAddr);

  const contract = new ethers.Contract(contractAddr, ABI, signer);

  const user = addr;
  const zeroBytes32 = "0x" + "00".repeat(32);
  const emptyBytes = "0x";

  // Helpers
  const readState = async (label = "state") => {
    console.log(`\n[${label}]`);
    // Encrypted views may revert on some RPCs; wrap in try/catch
    try {
      const races = await contract.getUserRaces(user);
      console.log("races (ciphertext):", races);
    } catch (e: any) {
      console.log("races read reverted:", e?.reason || e?.shortMessage || e?.message || e);
    }
    try {
      const gm = await contract.getUserGmBalance(user);
      console.log("gm (ciphertext):", gm);
    } catch (e: any) {
      console.log("gm read reverted:", e?.reason || e?.shortMessage || e?.message || e);
    }
    try {
      const claimWei = await contract.getClaimableEth(user);
      console.log("claimableEth:", ethers.formatEther(claimWei), "ETH");
    } catch (e: any) {
      console.log("claimableEth read failed:", e?.reason || e?.shortMessage || e?.message || e);
    }
    try {
      const canGm = await contract.canGmToday(user);
      const waitSec = await contract.getTimeUntilNextGm(user);
      console.log("canGmToday:", canGm, "timeUntilNext:", waitSec.toString(), "sec");
    } catch (e: any) {
      console.log("daily status read failed:", e?.reason || e?.shortMessage || e?.message || e);
    }
  };

  await readState("initial");

  // 1) Buy GM with 0.001 ETH
  try {
    console.log("\n[tx] buyGmTokens 0.001 ETH ...");
    const tx = await contract.buyGmTokens(zeroBytes32, emptyBytes, {
      value: ethers.parseEther("0.001"),
    });
    const r = await tx.wait();
    console.log("buyGmTokens tx:", r?.hash);
  } catch (e: any) {
    console.log("buyGmTokens failed:", e?.reason || e?.shortMessage || e?.message || e);
  }

  await readState("after buyGmTokens");

  // 2) Buy 1 race with 10 GM (dummy encrypted one)
  try {
    console.log("\n[tx] buyRaceWithGm x1 ...");
    const tx = await contract.buyRaceWithGm(zeroBytes32, emptyBytes);
    const r = await tx.wait();
    console.log("buyRaceWithGm tx:", r?.hash);
  } catch (e: any) {
    console.log("buyRaceWithGm failed:", e?.reason || e?.shortMessage || e?.message || e);
  }

  await readState("after buyRaceWithGm");

  // 3) Race once
  try {
    console.log("\n[tx] race ...");
    const tx = await contract.race({ gasLimit: 500_000 });
    const r = await tx.wait();
    console.log("race tx:", r?.hash);
    // optional: parse logs
    const topic = ethers.id("RaceCompleted(address,string)");
    const log = r?.logs?.find((l: any) => l.topics?.[0] === topic);
    if (log) {
      const iface = new ethers.Interface(ABI);
      const parsed = iface.parseLog({ topics: log.topics, data: log.data });
      console.log("RaceCompleted:", parsed?.args?.[1]);
    }
  } catch (e: any) {
    console.log("race failed:", e?.reason || e?.shortMessage || e?.message || e);
  }

  await readState("after race");

  // 4) Claim ETH (if any)
  try {
    const claimWei = await contract.getClaimableEth(user);
    if (claimWei > 0n) {
      console.log("\n[tx] claimETH ...");
      const tx = await contract.claimETH();
      const r = await tx.wait();
      console.log("claimETH tx:", r?.hash);
    } else {
      console.log("\nNo claimable ETH to claim.");
    }
  } catch (e: any) {
    console.log("claimETH failed:", e?.reason || e?.shortMessage || e?.message || e);
  }

  await readState("final");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
