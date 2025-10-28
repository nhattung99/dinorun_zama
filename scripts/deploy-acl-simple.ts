import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying CryptoDinoRun_ACL contract (Simple)...");

  // Get the contract factory
  const CryptoDinoRun_ACL = await ethers.getContractFactory("CryptoDinoRun_ACL_Simple");

  // For ACL, we need a host contract address
  // For now, we'll use a zero address as placeholder
  // In production, you would deploy a proper ACL host contract
  const aclHostAddress = ethers.ZeroAddress;

  console.log("📋 Contract parameters:");
  console.log(`   ACL Host Address: ${aclHostAddress}`);

  // Deploy the contract
  const luckyRaceACL = await CryptoDinoRun_ACL.deploy(aclHostAddress);

  // Wait for deployment
  await luckyRaceACL.waitForDeployment();

  const contractAddress = await luckyRaceACL.getAddress();
  console.log("✅ Contract deployed successfully!");
  console.log(`   Contract Address: ${contractAddress}`);
  console.log(`   Owner: ${await luckyRaceACL.owner()}`);
  console.log(`   ACL Host: ${await luckyRaceACL.aclHost()}`);

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  
  try {
    // Check if owner is authorized
    const owner = await luckyRaceACL.owner();
    const isOwnerAuthorized = await luckyRaceACL.isUserAuthorized(owner);
    const isOwnerRelayer = await luckyRaceACL.isRelayerAuthorized(owner);
    
    console.log(`   Owner authorized: ${isOwnerAuthorized}`);
    console.log(`   Owner relayer: ${isOwnerRelayer}`);
    
    if (isOwnerAuthorized && isOwnerRelayer) {
      console.log("✅ ACL setup verified successfully!");
    } else {
      console.log("❌ ACL setup verification failed!");
    }
  } catch (error) {
    console.log("❌ Verification failed:", error);
  }

  console.log("\n📝 Next steps:");
  console.log("1. Update frontend config with new contract address");
  console.log("2. Deploy proper ACL host contract if needed");
  console.log("3. Authorize users and relayers as needed");
  console.log("4. Test ACL functionality");

  return {
    contractAddress,
    owner: await luckyRaceACL.owner(),
    aclHost: await luckyRaceACL.aclHost()
  };
}

main()
  .then((result) => {
    console.log("\n🎉 Deployment completed!");
    console.log("Contract details:", result);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
