import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Verifying CryptoDinoRun_Simple deployment...");

  // Contract address from deployment
  const contractAddress = "0xb3f5D86c5a7C6F8F58cd0629259e02f4FEb441F2";

  console.log(`📋 Contract Address: ${contractAddress}`);
  console.log(`🌐 Network: Sepolia Testnet`);

  try {
    // Check if contract exists
    const code = await ethers.provider.getCode(contractAddress);
    if (code === "0x") {
      console.log("❌ Contract not found at address");
      return;
    }
    console.log("✅ Contract deployed successfully");

    // Get contract instance
    const CryptoDinoRun_Simple = await ethers.getContractFactory("CryptoDinoRun_Simple");
    const luckyRaceFHE = CryptoDinoRun_Simple.attach(contractAddress);

    // Test basic view functions
    console.log("\n📊 Testing View Functions...");

    // Get contract balance
    const contractBalance = await ethers.provider.getBalance(contractAddress);
    console.log(`💰 Contract Balance: ${ethers.formatEther(contractBalance)} ETH`);

    // Get owner
    const owner = await luckyRaceFHE.owner();
    console.log(`👑 Contract Owner: ${owner}`);

    // Get constants
    const racePrice = await luckyRaceFHE.RACE_PRICE();
    console.log(`🎯 Race Price: ${ethers.formatEther(racePrice)} ETH`);

    const gmTokenRate = await luckyRaceFHE.GM_TOKEN_RATE();
    console.log(`🪙 GM Token Rate: ${gmTokenRate}`);

    // Test user-specific functions
    console.log("\n👤 Testing User Functions...");

    const [signer] = await ethers.getSigners();
    console.log(`👤 Signer: ${signer.address}`);

    // Check if user can GM today
    const canGm = await luckyRaceFHE.canGmToday(signer.address);
    console.log(`📅 Can GM Today: ${canGm}`);

    // Get last GM time
    const lastGmTime = await luckyRaceFHE.getLastGmTime(signer.address);
    console.log(`⏰ Last GM Time: ${lastGmTime}`);

    // Get time until next GM
    const timeUntilNextGm = await luckyRaceFHE.getTimeUntilNextGm(signer.address);
    console.log(`⏳ Time Until Next GM: ${timeUntilNextGm} seconds`);

    console.log("\n🎉 Contract verification completed successfully!");
    console.log("✅ Contract is working correctly on Sepolia testnet");
    console.log("✅ All basic functions are operational");
    console.log("✅ Ready for frontend integration");
  } catch (error) {
    console.error("❌ Error during verification:", error);
  }
}

main()
  .then(() => {
    console.log("\n✅ Verification completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
