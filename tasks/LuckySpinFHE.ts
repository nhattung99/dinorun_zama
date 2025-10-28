import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("lucky-race:deploy", "Deploy CryptoDinoRun contract")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    
    console.log("Deploying CryptoDinoRun contract...");
    const CryptoDinoRun = await ethers.getContractFactory("CryptoDinoRun");
    const luckyRaceFHE = await CryptoDinoRun.deploy();
    await luckyRaceFHE.waitForDeployment();
    
    const address = await luckyRaceFHE.getAddress();
    console.log("CryptoDinoRun deployed to:", address);
    
    return address;
  });

task("lucky-race:add-pool", "Add a new pool reward")
  .addParam("contract", "Contract address")
  .addParam("name", "Pool name")
  .addParam("image", "Image URL")
  .addParam("value", "Reward value")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    
    const CryptoDinoRun = await ethers.getContractFactory("CryptoDinoRun");
    const luckyRaceFHE = CryptoDinoRun.attach(taskArgs.contract);
    
    console.log(`Adding pool: ${taskArgs.name}`);
    await luckyRaceFHE.addPool(taskArgs.name, taskArgs.image, taskArgs.value);
    
    const poolCount = await luckyRaceFHE.poolCount();
    console.log(`Pool added! Total pools: ${poolCount}`);
  });

task("lucky-race:get-pools", "Get all pool rewards")
  .addParam("contract", "Contract address")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    
    const CryptoDinoRun = await ethers.getContractFactory("CryptoDinoRun");
    const luckyRaceFHE = CryptoDinoRun.attach(taskArgs.contract);
    
    const poolCount = await luckyRaceFHE.poolCount();
    console.log(`Total pools: ${poolCount}`);
    
    for (let i = 0; i < poolCount; i++) {
      const [name, imageUrl, value] = await luckyRaceFHE.getPoolReward(i);
      console.log(`Pool ${i}: ${name} - ${imageUrl} - Value: ${value}`);
    }
  });

task("lucky-race:submit-score", "Submit a public score to leaderboard")
  .addParam("contract", "Contract address")
  .addParam("user", "User address")
  .addParam("score", "Score value")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    
    const CryptoDinoRun = await ethers.getContractFactory("CryptoDinoRun");
    const luckyRaceFHE = CryptoDinoRun.attach(taskArgs.contract);
    
    console.log(`Submitting score for ${taskArgs.user}: ${taskArgs.score}`);
    await luckyRaceFHE.submitPublicScore(taskArgs.user, taskArgs.score);
    
    console.log("Score submitted successfully!");
  });

task("lucky-race:get-leaderboard", "Get leaderboard")
  .addParam("contract", "Contract address")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    
    const CryptoDinoRun = await ethers.getContractFactory("CryptoDinoRun");
    const luckyRaceFHE = CryptoDinoRun.attach(taskArgs.contract);
    
    const leaderboard = await luckyRaceFHE.getLeaderboard();
    console.log(`Leaderboard (${leaderboard.length} entries):`);
    
    leaderboard.forEach((entry: any, index: number) => {
      console.log(`${index + 1}. ${entry.user} - Score: ${entry.score}`);
    });
  });

task("lucky-race:check-in", "Simulate user check-in (with mock encrypted data)")
  .addParam("contract", "Contract address")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    
    const CryptoDinoRun = await ethers.getContractFactory("CryptoDinoRun");
    const luckyRaceFHE = CryptoDinoRun.attach(taskArgs.contract);
    
    // Mock encrypted data for testing (32 bytes format)
    const encryptedRaces = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const attestation = "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
    
    console.log("Simulating user check-in...");
    await luckyRaceFHE.checkIn(encryptedRaces, attestation);
    
    console.log("Check-in completed!");
  });

task("lucky-race:race", "Simulate user race (with mock encrypted data)")
  .addParam("contract", "Contract address")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    
    const CryptoDinoRun = await ethers.getContractFactory("CryptoDinoRun");
    const luckyRaceFHE = CryptoDinoRun.attach(taskArgs.contract);
    
    // Mock encrypted data for testing (32 bytes format)
    const encryptedPoolIndex = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const encryptedPoint = "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
    const attestationPool = "0x1111111111111111111111111111111111111111111111111111111111111111";
    const attestationPoint = "0x2222222222222222222222222222222222222222222222222222222222222222";
    
    console.log("Simulating user race...");
    await luckyRaceFHE.raceAndClaimReward(
      encryptedPoolIndex,
      encryptedPoint,
      attestationPool,
      attestationPoint
    );
    
    console.log("Race completed!");
  });

task("lucky-race:make-public", "Make user score public")
  .addParam("contract", "Contract address")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    
    const CryptoDinoRun = await ethers.getContractFactory("CryptoDinoRun");
    const luckyRaceFHE = CryptoDinoRun.attach(taskArgs.contract);
    
    console.log("Making score public...");
    await luckyRaceFHE.makeScorePublic();
    
    console.log("Score made public!");
  }); 