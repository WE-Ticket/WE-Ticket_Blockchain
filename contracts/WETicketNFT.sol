// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WE-Ticket NFT Contract
 * @dev 환경 구축용 기본 뼈대 컨트랙트
 * 
 * TODO:
 * - NFT 티켓 발행 시스템
 * - 양도 시스템 : NFT 티켓 소유자 DID 이전
 * - (입장 검증 시스템)
 */
contract WETicketNFT is ERC721URIStorage, Ownable {
    
    // ============ 상태 변수 (나중에 필요에 따라 추가) ============
    
    // TODO: [각자] 필요한 변수들 추가

    // [혜교] 가 정의한 UserInfo, TicketInfo
    //FIXME 추후 [지은]이와 충돌시, 논의 후 수정 가능
    //FIXME 변수명 수정 필요하다면 수정 가능! (백엔드/DB와 변수명 맞추기 등)
     struct UserInfo {
        string did;             // 단순 본인 인증일 경우, 임시 DID 발급 (이라고, [혜교]가 설계했으나, 기술적 검증 후 백엔드의 관리에 따름)
        uint8 authLevel;        // 인증 레벨 (본인인증, 모바일 신분증 인증, 추가 VC 인증)
        string publicKey;       // DID 관련 공개키
        uint256 authTimestamp;  // 인증 시점 (NFT 발급 이후에 다시 인증을 업그레이드 하면, 권한이 변경 되므로)
    }

    struct TicketInfo {
        uint256 concertId;    
        uint256 sessionId;    
        string seatNumber;      
        uint256 price;          
        uint256 datetime;      
        uint256 issueTimestamp; 
        bool isTransferable;    
        bool isUsed;           
        string currentOwnerDID; 
        uint8 authLevel;       // 발급 당시의 인증 레벨 (권한 변경에 따라 얘도 업데이트할지는 잘 모르겠음)
    }
    
    mapping(string => UserInfo) public users;                           // DID -> 유저정보
    mapping(uint256 => TicketInfo) public tickets;                      // 토큰ID -> 티켓정보  
    mapping(string => uint256[]) public didToTokens;                    // DID -> 보유티켓배열
    mapping(string => mapping(uint256 => bool)) public didToSessionTicket; // DID+sessionId -> 보유여부 (1인1티켓)
    uint256 private _tokenIdCounter = 1;                                // 토큰ID 카운터


    
    // ============ 이벤트 (나중에 필요에 따라 추가) ============
    
    // TODO: [각자] 필요한 이벤트들 추가
    
    
    // ============ 생성자 ============
    constructor() ERC721("WE-Ticket", "WET") Ownable(msg.sender) {
        // 기본 설정만
    }
    
    // ============ 티켓 발행 시스템 ============
    // [혜교] 티켓 발행 관련 함수들 구현
    function mintTicket(
        string memory did,
        uint256 concertId,
        uint256 sessionId,
        string memory seatNumber,
        uint256 price,
        uint256 datetime,
        uint8 authLevel,
        string memory publicKey,
        uint256 authTimestamp 
    ) external onlyOwner returns (uint256) {
        // 1인 1티켓 체크
        require(!didToSessionTicket[did][sessionId], "Already has ticket for this session");
        
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
            seatNumber: seatNumber,
            price: price,
            datetime: datetime,
            issueTimestamp: block.timestamp,
            isTransferable: true,
            isUsed: false,
            currentOwnerDID: did,
            authLevel: authLevel
        });
        
        // 유저 정보 저장/업데이트
        users[did] = UserInfo({
            did: did,
            authLevel: authLevel,
            publicKey: publicKey,
            authTimestamp: authTimestamp
        });
        
        // 매핑 업데이트
        didToTokens[did].push(tokenId);
        didToSessionTicket[did][sessionId] = true;
        
        return tokenId;
    }
    
    
    // ============ 양도 시스템 ============
    
    // TODO: [지은] 양도 함수들 구현 예정
    event TicketTransferred(
    uint256 indexed tokenId,
    string indexed fromDID,
    string indexed toDID,
    address toAddress,
    uint256 timestamp
    );
    
    function _removeTokenFromOwner(string memory did, uint256 tokenId) internal {
    uint256[] storage tokens = didToTokens[did];
    for (uint256 i = 0; i < tokens.length; i++) {
        if (tokens[i] == tokenId) {
            tokens[i] = tokens[tokens.length - 1];
            tokens.pop();
            break;
            }
        }
    }


    function transferTicket(
        uint256 tokenId,
        string memory fromDID,
        string memory toDID,
        address toAddress
    ) external onlyOwner {
        TicketInfo storage ticket = tickets[tokenId];

        require(ticket.isTransferable, "Transfer not allowed");
        require(!ticket.isUsed, "Ticket already used");

        // 현재 소유자 주소 확인
        address currentOwner = ownerOf(tokenId);

        // NFT 소유권 이전
        _transfer(currentOwner, toAddress, tokenId);

        // TicketInfo 업데이트
        ticket.currentOwnerDID = toDID;

        // 매핑 업데이트
        _removeTokenFromOwner(fromDID, tokenId);
        didToTokens[toDID].push(tokenId);
        didToSessionTicket[fromDID][ticket.sessionId] = false;
        didToSessionTicket[toDID][ticket.sessionId] = true;

        // 이벤트 발생 - 이전 소유자, 신규 소유자, 토큰ID, 새 소유자 지갑주소, 타임스탬프 기록
        emit TicketTransferred(tokenId, fromDID, toDID, toAddress, block.timestamp);
    }
    
    
    // ============ 입장 시스템 ============
    
    // TODO: [나중에] 입장 검증 함수들 구현 예정
    
    
    // ============ 유틸리티 함수 ============
    
    // TODO: [각자] 조회 및 기타 함수들 구현 예정
    
}
