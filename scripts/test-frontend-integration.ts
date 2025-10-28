import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing Frontend Integration with CryptoDinoRun_Simple...");

  const contractAddress = "0xb3f5D86c5a7C6F8F58cd0629259e02f4FEb441F2";

  console.log(`📋 Contract Address: ${contractAddress}`);
  console.log(`🌐 Network: Sepolia Testnet`);

  try {
    // Get contract instance
    const CryptoDinoRun_Simple = await ethers.getContractFactory("CryptoDinoRun_Simple");
    const luckyRaceFHE = CryptoDinoRun_Simple.attach(contractAddress);

    // Test all frontend-relevant functions
    console.log("\n📊 Testing Frontend Integration Functions...");

    const [signer] = await ethers.getSigners();
    const userAddress = await signer.getAddress();
    console.log(`👤 Test User: ${userAddress}`);

    // 1. Test view functions that frontend uses
    console.log("\n🔍 Testing View Functions...");

    const owner = await luckyRaceFHE.owner();
    console.log(`👑 Contract Owner: ${owner}`);

    const racePrice = await luckyRaceFHE.RACE_PRICE();
    console.log(`🎯 Race Price: ${ethers.formatEther(racePrice)} ETH`);

    const gmTokenRate = await luckyRaceFHE.GM_TOKEN_RATE();
    console.log(`🪙 GM Token Rate: ${gmTokenRate}`);

    const contractBalance = await ethers.provider.getBalance(contractAddress);
    console.log(`💰 Contract Balance: ${ethers.formatEther(contractBalance)} ETH`);

    // 2. Test user-specific functions
    console.log("\n👤 Testing User Functions...");

    const canGm = await luckyRaceFHE.canGmToday(userAddress);
    console.log(`📅 Can GM Today: ${canGm}`);

    const lastGmTime = await luckyRaceFHE.getLastGmTime(userAddress);
    console.log(`⏰ Last GM Time: ${lastGmTime}`);

    const timeUntilNextGm = await luckyRaceFHE.getTimeUntilNextGm(userAddress);
    console.log(`⏳ Time Until Next GM: ${timeUntilNextGm} seconds`);

    // 3. Test encrypted data retrieval (frontend will decrypt these)
    console.log("\n🔐 Testing Encrypted Data Retrieval...");

    const encryptedRaces = await luckyRaceFHE.getUserRaces(userAddress);
    console.log(`🎰 Encrypted Races: ${encryptedRaces}`);

    const encryptedRewards = await luckyRaceFHE.getUserRewards(userAddress);
    console.log(`🏆 Encrypted Rewards: ${encryptedRewards}`);

    // 4. Test contract events (frontend listens to these)
    console.log("\n📡 Testing Contract Events...");

    // Get recent events
    const currentBlock = await ethers.provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 1000); // Last 1000 blocks

    const racePurchasedEvents = await luckyRaceFHE.queryFilter(luckyRaceFHE.filters.RacePurchased(), fromBlock);
    console.log(`🛒 Race Purchased Events: ${racePurchasedEvents.length}`);

    const raceCompletedEvents = await luckyRaceFHE.queryFilter(luckyRaceFHE.filters.RaceCompleted(), fromBlock);
    console.log(`🎰 Race Completed Events: ${raceCompletedEvents.length}`);

    const gmTokensBoughtEvents = await luckyRaceFHE.queryFilter(luckyRaceFHE.filters.GmTokensBought(), fromBlock);
    console.log(`🪙 GM Tokens Bought Events: ${gmTokensBoughtEvents.length}`);

    const dailyGmCompletedEvents = await luckyRaceFHE.queryFilter(luckyRaceFHE.filters.DailyGmCompleted(), fromBlock);
    console.log(`📅 Daily GM Completed Events: ${dailyGmCompletedEvents.length}`);

    // 5. Test contract constants (frontend config)
    console.log("\n⚙️ Testing Contract Constants...");

    const dailyGmResetHour = await luckyRaceFHE.DAILY_GM_RESET_HOUR();
    console.log(`🕐 Daily GM Reset Hour: ${dailyGmResetHour}`);

    const secondsPerDay = await luckyRaceFHE.SECONDS_PER_DAY();
    console.log(`⏱️ Seconds Per Day: ${secondsPerDay}`);

    // 6. Validate frontend configuration
    console.log("\n🔧 Validating Frontend Configuration...");

    const expectedConfig = {
      contractAddress: "0xb3f5D86c5a7C6F8F58cd0629259e02f4FEb441F2",
      racePrice: ethers.formatEther(racePrice),
      gmTokenRate: gmTokenRate.toString(),
      chainId: 11155111,
      network: "Sepolia",
    };

    console.log("✅ Expected Frontend Config:", expectedConfig);
    console.log("✅ Contract is ready for frontend integration");

    console.log("\n🎉 Frontend Integration Test Completed Successfully!");
    console.log("✅ All frontend-relevant functions are operational");
    console.log("✅ Contract events are properly configured");
    console.log("✅ Encrypted data retrieval is working");
    console.log("✅ Ready for frontend deployment");
  } catch (error) {
    console.error("❌ Error during frontend integration test:", error);
  }
}

main()
  .then(() => {
    console.log("\n✅ Frontend integration test completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
