require('dotenv').config();
const hre = require("hardhat");

async function main() {
  console.log("=".repeat(60));
  console.log("WE-Ticket NFT 발행된 티켓 조회 테스트 시작...");
  console.log("=".repeat(60));

  const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
  
  const [signer] = await hre.ethers.getSigners();
  const WETicketNFT = await hre.ethers.getContractFactory("WETicketNFT");
  const contract = WETicketNFT.attach(contractAddress);

  console.log("컨트랙트 주소:", contractAddress);
  console.log("조회 계정:", signer.address);
  console.log("-".repeat(60));

  try {
    console.log("\n전체 발행된 티켓 현황");
    
    let ticketCount = 0;
    let maxTokenId = 30;
    
    for (let tokenId = 1; tokenId <= maxTokenId; tokenId++) {
      try {
        const ticketInfo = await contract.tickets(tokenId);
        
        if (ticketInfo.concertId > 0n) {
          ticketCount++;
          
          console.log(`\n 토큰 ID ${tokenId}번 티켓 정보:`);
          console.log(`   공연 ID: ${ticketInfo.concertId.toString()}`);
          console.log(`   세션 ID: ${ticketInfo.sessionId.toString()}`);
          console.log(`   좌석: ${ticketInfo.seatNumber}`);
          console.log(`   가격: ${ticketInfo.price.toString()} 원`);
          
          const datetime = Number(ticketInfo.datetime);
          const issueTimestamp = Number(ticketInfo.issueTimestamp);
          
          console.log(`   공연날짜: ${new Date(datetime * 1000).toLocaleString()}`);
          console.log(`   발행시간: ${new Date(issueTimestamp * 1000).toLocaleString()}`);
          console.log(`   양도가능: ${ticketInfo.isTransferable ? "예" : "아니오"}`);
          console.log(`   사용여부: ${ticketInfo.isUsed ? "사용됨" : "미사용"}`);
          console.log(`   소유자 DID: ${ticketInfo.currentOwnerDID}`);
          console.log(`   인증레벨: ${ticketInfo.authLevel}`);
          
          // NFT 소유자 주소도 조회
          try {
            const owner = await contract.ownerOf(tokenId);
            console.log(`   NFT 소유자 주소: ${owner}`);
          } catch (error) {
            console.log(`   NFT 소유자 주소: 조회 실패`);
          }
        }
      } catch (error) {
        if (error.message.includes("ERC721: invalid token ID") || 
            error.message.includes("owner query for nonexistent token")) {
          break;
        } else {
          console.log(`   토큰 ID ${tokenId}: 조회 실패 - ${error.message}`);
        }
      }
    }
    
    console.log(`\n총 발행된 티켓 개수: ${ticketCount}개`);
    
    // 컨트랙트 기본 정보
    console.log("\n" + "=".repeat(60));
    console.log("컨트랙트 정보");
    
    try {
      const contractOwner = await contract.owner();
      console.log(`컨트랙트 소유자: ${contractOwner}`);
      
      // 컨트랙트 이름과 심볼 조회
      const name = await contract.name();
      const symbol = await contract.symbol();
      console.log(`NFT 이름: ${name}`);
      console.log(`NFT 심볼: ${symbol}`);
      
    } catch (error) {
      console.log(`컨트랙트 기본 정보 조회 실패: ${error.message}`);
    }
    
    console.log("\n모든 조회 완료");
    console.log("=".repeat(60));

  } catch (error) {
    console.error("조회 실패:", error.message);
    console.error("전체 에러:", error);
  }
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 스크립트 실행 실패:", error);
    process.exit(1);
  });