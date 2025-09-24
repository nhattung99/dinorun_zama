// ✅ Real FHE Race Log - Kiểm tra kết quả race thật
import { ethers } from "ethers";

// ✅ Real Contract ABI
const REAL_ABI = [
  "function race() external",
  "function getUserRaces(address user) external view returns (bytes)",
  "function getUserRewards(address user) external view returns (bytes)",
  "function buyGmTokens(bytes calldata encryptedAmount, bytes calldata proof) external payable",
  "function buyRaces(bytes calldata encryptedAmount, bytes calldata proof) external",
  "event RaceCompleted(address indexed user, string result)",
  "event GmTokensBought(address indexed user, uint256 amount)",
  "event RacesBought(address indexed user, uint256 amount)",
];

// ✅ Real FHE Race Log function
export const testRaceLog = async () => {
  console.log("🎯 === REAL FHE RACE LOG ===");

  try {
    // ✅ Check if MetaMask is available
    if (!window.ethereum) {
      throw new Error("MetaMask not found");
    }

    // ✅ Connect to Sepolia
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const account = await signer.getAddress();

    console.log("🔗 Connected to:", account);

    // ✅ Contract address
    const contractAddress = process.env.REACT_APP_FHEVM_CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error("REACT_APP_FHEVM_CONTRACT_ADDRESS environment variable is required");
    }
    const contract = new ethers.Contract(contractAddress, REAL_ABI, signer);

    console.log("📋 Contract:", contractAddress);

    // ✅ Get initial state
    console.log("📊 === INITIAL STATE ===");
    const initialRaces = await contract.getUserRaces(account);
    const initialRewards = await contract.getUserRewards(account);

    console.log("🎰 Initial races ciphertext:", initialRaces);
    console.log("💰 Initial rewards ciphertext:", initialRewards);

    // ✅ Race
    console.log("🎯 === RACENING ===");
    const tx = await contract.race({
      gasLimit: 500000,
    });

    console.log("⏳ Race transaction:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ Race completed:", receipt.transactionHash);

    // ✅ Parse events
    console.log("📋 === EVENT PARSING ===");
    const raceEvent = receipt.logs.find((log: any) => {
      const topic0 = log.topics[0];
      return topic0 === ethers.id("RaceCompleted(address,string)");
    });

    if (raceEvent) {
      const decoded = contract.interface.parseLog(raceEvent);
      if (decoded) {
        console.log("🎯 Race result:", decoded.args[1]);
      } else {
        console.log("❌ Failed to parse race event");
      }
    } else {
      console.log("❌ No RaceCompleted event found");
    }

    // ✅ Get final state
    console.log("📊 === FINAL STATE ===");
    const finalRaces = await contract.getUserRaces(account);
    const finalRewards = await contract.getUserRewards(account);

    console.log("🎰 Final races ciphertext:", finalRaces);
    console.log("💰 Final rewards ciphertext:", finalRewards);

    // ✅ Compare states
    console.log("🔄 === STATE COMPARISON ===");
    console.log("Races changed:", initialRaces !== finalRaces);
    console.log("Rewards changed:", initialRewards !== finalRewards);

    console.log("✅ === REAL FHE RACE LOG COMPLETED ===");
  } catch (error) {
    console.error("❌ Real FHE race log failed:", error);
  }
};

// ✅ Export for use in App.tsx
export default testRaceLog;
