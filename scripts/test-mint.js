require('dotenv').config();
const hre = require("hardhat");

async function main() {
  console.log("NFT 티켓 발행 테스트 시작...");
  
  const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
  console.log("컨트랙트 주소:", contractAddress);
  
  // 배포된 컨트랙트에 연결
  const WETicketNFT = await hre.ethers.getContractFactory("WETicketNFT");
  const contract = WETicketNFT.attach(contractAddress);
  
  console.log("컨트랙트 연결 완료!");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("발행자 계정:", deployer.address);
  
  // FIXME 더미 데이터로 티켓 발행
  console.log("\n티켓 발행 중...");
  console.log("공연: ATEEZ 콘서트");
  console.log("좌석: A-15");
  console.log("DID: did:omn:hyegyo123");
  
  const tx = await contract.mintTicket(
    "did:omn:hyegyo123",    // DID
    1,                      // concertId
    101,                    // sessionId
    "A-15",                 // seatNumber
    50000,                  // price
    1724832000,             // datetime
    2,                      // authLevel
    "publickey_hyegyo123"   // publicKey
  );
  
  console.log("블록체인에 기록 중...");
  const receipt = await tx.wait();
  
  console.log("\n티켓 발행 완료!");
  console.log("트랜잭션 해시:", tx.hash);
  console.log("가스 사용량:", receipt.gasUsed.toString());
  console.log("Etherscan:", `https://sepolia.etherscan.io/tx/${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 발행 실패:", error);
    process.exit(1);
  });