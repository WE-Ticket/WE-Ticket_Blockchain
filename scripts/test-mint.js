require('dotenv').config();
const hre = require("hardhat");
const axios = require('axios');

async function main() {
  console.log("NFT 티켓 발행 테스트 시작...");
  
  const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
  console.log("컨트랙트 주소:", contractAddress);

  // 백엔드 API URL - [지은] 추가
  const backendUrl = process.env.BACKEND_URL;
  
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
    
  const authTime = Math.floor(Date.now() / 1000) - 3600; // 1시간 전에 인증했다고 가정
  
  const tx = await contract.mintTicket(
    "did:omn:hyegyo123",    // DID
    1,                      // concertId
    101,                    // sessionId
    "A-15",                 // seatNumber
    50000,                  // price
    1724832000,             // datetime
    2,                      // authLevel
    "publickey_hyegyo123",  // publicKey
    authTime
  );

  // FIXME 공연 메타 정보 매핑 (하드코딩) - [지은] 추가
  const concertMetaMap = {
    1: {
      concertName : "ATEEZ 콘서트",
      artist : "ATEEZ",
      venue : "KSPO DOME"
    }
  }
  const concertMeta = concertMetaMap[concertId];

  const ownerAddress = await contract.owner();
  console.log("컨트랙트 소유자 주소:", ownerAddress);
  console.log("트랜잭션 보내는 주소:", deployer.address);

  console.log("블록체인에 기록 중...");
  const receipt = await tx.wait();

  // 이벤트에서 tokenId 추출 - [지은] 추가
  const event = receipt.events.find(e => e.event === "TicketMinted");
  if(!event) throw new Error("TicketMinted 이벤트를 찾을 수 없습니다.");
  const tokenId = event.args.tokenId.toString();
  const issuedAt = new Date().toISOString();
  const network = hre.network.name;


  // 백엔드로 보낼 데이터 구성 - [지은] 추가
  const payload = {
    tokenId,
    contractAddress,
    network,
    issuedAt,
    authLevel,
    concertName: concertMeta.concertName,
    artist: concertMeta.artist,
    concertDateTime: new Date(datetime * 1000).toISOString(),
    venue: concertMeta.venue,
    seatNumber,
  }

  console.log("\n 백엔드에 전송할 데이터:", payload);

  // 백엔드로 POST 전송 - [지은] 추가
  try {
    const response = await axios.post(`${backendUrl}/api/tickets/mint-callback`, payload);
    console.log("백엔드 응답:", response.data);
  } catch (error) {
    console.error("백엔드 전송 실패:", error.response ? error.response.data : error.message);
    throw error;
  }
  
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