const hre = require("hardhat");
const { formatEther } = require("ethers");

async function main() {
  console.log("WE-Ticket NFT 컨트랙트 배포 시작...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("배포 계정:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("계정 잔액:", formatEther(balance), "ETH");

  console.log("컨트랙트 컴파일 및 배포 중...");
  const WETicketNFT = await hre.ethers.getContractFactory("WETicketNFT");
  const weTicketNFT = await WETicketNFT.deploy(); 

  console.log("\n배포 완료");
  console.log("컨트랙트 주소:", weTicketNFT.target); 
  console.log("Sepolia Etherscan:", `https://sepolia.etherscan.io/address/${weTicketNFT.target}`);

  console.log("\n공유할 내용:");
  console.log("컨트랙트 주소:", weTicketNFT.target);
  console.log("네트워크: Ethereum Sepolia");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 배포 실패:", error);
    process.exit(1);
  });