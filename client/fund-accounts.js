const { ethers } = require("hardhat");

async function main() {
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  
  // Fund the first 5 test accounts (or all accounts passed as arguments)
  const accounts = process.argv.length > 2 
    ? process.argv.slice(2) 
    : signers.slice(1, 6).map(s => s.address); // Default: fund next 5 accounts
  
  console.log(`\n🔄 Funding ${accounts.length} accounts with 10 ETH each...\n`);
  
  for (const account of accounts) {
    try {
      const tx = await deployer.sendTransaction({
        to: account,
        value: ethers.utils.parseEther("10")
      });
      await tx.wait();
      console.log(`✅ Funded ${account} with 10 ETH`);
    } catch (error) {
      console.error(`❌ Failed to fund ${account}:`, error.message);
    }
  }
  
  console.log("\n✅ Funding complete!\n");
}

main().catch(console.error);