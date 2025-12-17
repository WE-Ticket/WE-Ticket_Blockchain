// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WE-Ticket NFT Contract
 */
contract WETicketNFT is ERC721URIStorage, Ownable {
    
    // ============ 상태 변수 ============

    struct TicketInfo {
        uint256 concertId;    
        uint256 sessionId; 
        string seatGrade;
        string seatZone;   
        string seatNumber;      
        uint256 price;          
        uint256 datetime;      
        uint256 issueTimestamp; 
        bool isTransferable;    
        bool isUsed;           
    }
    
    mapping(uint256 => TicketInfo) public tickets;                      // 토큰ID -> 티켓정보  
    uint256 private _tokenIdCounter = 1;                                // 토큰ID 카운터


    
    // ============ 이벤트 ============
    
    // ============ 생성자 ============
    constructor() ERC721("WE-Ticket", "WET") Ownable(msg.sender) {
        // 기본 설정만
    }
    
    // ============ 이벤트 ============
    // 백엔드에 전송하기 위해 필요한 event
    event TicketMinted(address indexed to, uint256 indexed tokenId);

    // ============ 티켓 발행 시스템 ============
    // 티켓 발행 관련 함수들 구현
    function mintTicket(
        uint256 concertId,
        uint256 sessionId,
        string memory seatGrade,
        string memory seatZone,
        string memory seatNumber,
        uint256 price,
        uint256 datetime,
        uint256 authTimestamp 
    ) external onlyOwner returns (uint256) {
        
        // 토큰 ID 생성
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        // NFT 발행
        //개인 지갑이 아니라 백엔드 주소(배포 후 컨트랙트 주소)로 발행
        _mint(owner(), tokenId);
        
        // 티켓 정보 저장
        tickets[tokenId] = TicketInfo({
            concertId: concertId,
            sessionId: sessionId,
            seatGrade: seatGrade,
            seatZone: seatZone,
            seatNumber: seatNumber,
            price: price,
            datetime: datetime,
            issueTimestamp: block.timestamp,
            isTransferable: true,
            isUsed: false
        });
        

        // 이벤트 발생
        emit TicketMinted(owner(), tokenId);
        return tokenId;
    }
    
}
