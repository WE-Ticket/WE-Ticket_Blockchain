require('dotenv').config();
const hre = require("hardhat");
const data = require("./dummy-data"); // 더미 데이터 가져오기

async function main() {
    // 환경변수에서 배포된 NFT 컨트랙트 주소 불러오기
    const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
    // WETicketNFT 컨트랙트 가져오기 (ABI + bytecode로 구성된 factory)
    const WETicketNFT = await hre.ethers.getContractFactory("WETicketNFT");
    // 배포된 컨트랙트 주소에 연결
    const contract = WETicketNFT.attach(contractAddress);
    // 현재 signer(= 배포자 또는 호출자) 계정 불러오기
    const [deployer] = await hre.ethers.getSigners();
    // 양도받을 사람의 지갑 주소 (.env 파일에 정의됨)
    const toAddress = process.env.TO_ADDRESS;
    // 디버깅용 출력 (양수인 지갑 주소)
    console.log("TO_ADDRESS:", toAddress); 

    // 실제 티켓 양도 실행
    console.log("양도 실행 중...")
    const tx = await contract.transferTicket(
        data.TOKEN_ID,          // 양도할 NFT의 tokenId
        data.DUMMY_DID_1,       // 양도인 DID
        data.DUMMY_DID_2,       // 양수인 DID
        toAddress               // 양수인 지갑 주소
    );

    const receipt = await tx.wait();
    console.log("✅ 양도 완료!");
    console.log("트랜잭션 해시:", receipt.transactionHash); // Etherscan에서 조회 가능

}

main().catch((err) => {
  console.error("❌ 양도 실패:", err);
  process.exit(1);
});