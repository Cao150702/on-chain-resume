import { ethers } from "hardhat";
import { OnChainResume } from "../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying OnChainResume with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const OnChainResumeFactory = await ethers.getContractFactory("OnChainResume");
  const contract = await OnChainResumeFactory.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("\n✅ OnChainResume deployed to:", address);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("\nUpdate your .env.local:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
