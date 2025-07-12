async function main() {
  console.log("WE-Ticket NFT 컨트랙트 배포 시작...");
  
  // 배포자 계정 확인
  const [deployer] = await ethers.getSigners();
  console.log("배포 계정:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("계정 잔액:", ethers.utils.formatEther(balance), "ETH");
  
  // 컨트랙트 배포
  console.log("컨트랙트 컴파일 및 배포 중...");
  const WETicketNFT = await ethers.getContractFactory("WETicketNFT");
  const weTicketNFT = await WETicketNFT.deploy();
  
  await weTicketNFT.deployed();
  
  console.log("\n배포 완료!");
  console.log("컨트랙트 주소:", weTicketNFT.address);
  console.log("Sepolia Etherscan:", `https://sepolia.etherscan.io/address/${weTicketNFT.address}`);
  
  console.log("\n공유할 내용:");
  console.log("컨트랙트 주소:", weTicketNFT.address);
  console.log("네트워크: Ethereum Sepolia");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 배포 실패:", error);
    process.exit(1);
  });
