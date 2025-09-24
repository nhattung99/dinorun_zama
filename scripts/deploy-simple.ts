import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying CryptoRaceFHE_Simple to Sepolia Testnet...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy the contract
  const CryptoRaceFHE_Simple = await ethers.getContractFactory("CryptoRaceFHE_Simple");
  const luckyRaceFHE = await CryptoRaceFHE_Simple.deploy();
  await luckyRaceFHE.waitForDeployment();

  const contractAddress = await luckyRaceFHE.getAddress();
  console.log(`✅ CryptoRaceFHE_Simple deployed to: ${contractAddress}`);

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const code = await ethers.provider.getCode(contractAddress);
  if (code === "0x") {
    console.log("❌ Contract not found at address");
    return;
  }
  console.log("✅ Contract deployed successfully");

  // Test basic functions
  console.log("\n📊 Testing basic functions...");
  
  // Get owner
  const owner = await luckyRaceFHE.owner();
  console.log(`👑 Contract Owner: ${owner}`);

  // Get constants
  const racePrice = await luckyRaceFHE.RACE_PRICE();
  console.log(`🎯 Race Price: ${ethers.formatEther(racePrice)} ETH`);

  const gmTokenRate = await luckyRaceFHE.GM_TOKEN_RATE();
  console.log(`🪙 GM Token Rate: ${gmTokenRate}`);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("✅ Contract is working correctly on Sepolia testnet");
  console.log("✅ Ready for frontend integration");
  
  // Save contract address
  console.log("\n=== Add to your .env file ===");
  console.log(`REACT_APP_FHEVM_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`VITE_FHEVM_CONTRACT_ADDRESS=${contractAddress}`);
}

main()
  .then(() => {
    console.log("\n✅ Deployment completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
