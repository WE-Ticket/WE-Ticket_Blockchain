require('dotenv').config();
const hre = require("hardhat");

async function main() {
  console.log("발행된 티켓 조회 테스트 시작...");
  
  const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
  const WETicketNFT = await hre.ethers.getContractFactory("WETicketNFT");
  const contract = WETicketNFT.attach(contractAddress);
  
  console.log("컨트랙트 주소:", contractAddress);
  console.log("=" * 50);
  
  try {
    // 토큰 ID 1번 티켓 정보 조회 (더미데이터 발행한 ATEEZ 티켓)
    console.log("\n토큰 ID 1번 티켓 정보:");
    const ticketInfo = await contract.tickets(1);
    
    console.log("공연 ID:", ticketInfo.concertId.toString());
    console.log("세션 ID:", ticketInfo.sessionId.toString());
    console.log("좌석:", ticketInfo.seatNumber);
    console.log("가격:", ticketInfo.price.toString(), "원");
    console.log("공연날짜:", new Date(ticketInfo.datetime.toNumber() * 1000).toLocaleString());
    console.log("발행시간:", new Date(ticketInfo.issueTimestamp.toNumber() * 1000).toLocaleString());
    console.log("양도가능:", ticketInfo.isTransferable ? "예" : "아니오");
    console.log("사용여부:", ticketInfo.isUsed ? "사용됨" : "미사용");
    console.log("소유자 DID:", ticketInfo.currentOwnerDID);
    console.log("인증레벨:", ticketInfo.authLevel);
    
    // DID로 사용자 정보 조회 (더미 데이터 였던 나 혜교로)
    console.log("\n사용자 정보:");
    const userInfo = await contract.users("did:omn:hyegyo123");
    console.log("DID:", userInfo.did);
    console.log("인증레벨:", userInfo.authLevel);
    console.log("공개키:", userInfo.publicKey);
    console.log("인증시간:", new Date(userInfo.authTimestamp.toNumber() * 1000).toLocaleString());
    
    // DID별 보유 티켓 목록 조회
    console.log("\nDID별 보유 티켓:");
    try {
      // 첫 번째 토큰부터 확인
      const firstToken = await contract.didToTokens("did:omn:hyegyo123", 0);
      console.log("첫 번째 토큰 ID:", firstToken.toString());
      
      // 더 많은 토큰이 있는지 확인
      let tokenCount = 1;
      try {
        const secondToken = await contract.didToTokens("did:omn:hyegyo123", 1);
        console.log("두 번째 토큰 ID:", secondToken.toString());
        tokenCount = 2;
      } catch {
        console.log("토큰은 1개만 있습니다.");
      }
      
      console.log("총 보유 티켓 개수:", tokenCount);
      
    } catch (error) {
      console.log("보유한 티켓이 없거나 조회 실패");
    }
    
    // 1인 1티켓 체크 확인
    console.log("\n1인 1티켓 체크:");
    const hasTicket = await contract.didToSessionTicket("did:omn:hyegyo123", 101);
    console.log("세션 101 티켓 보유:", hasTicket ? "예" : "아니오");
    
    console.log("\n모든 조회 완료!");
    
  } catch (error) {
    console.error("❌ 조회 실패:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 스크립트 실행 실패:", error);
    process.exit(1);
  });