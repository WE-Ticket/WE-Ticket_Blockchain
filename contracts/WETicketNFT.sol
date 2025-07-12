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
    
    
    // ============ 이벤트 (나중에 필요에 따라 추가) ============
    
    // TODO: [각자] 필요한 이벤트들 추가
    
    
    // ============ 생성자 ============
    constructor() ERC721("WE-Ticket", "WET") Ownable(msg.sender) {
        // 기본 설정만
    }
    
    // ============ 티켓 발행 시스템 ============
    
    // TODO: [혜교] 티켓 발행 관련 함수들 구현
    
    
    // ============ 양도 시스템 ============
    
    // TODO: [지은] 양도 함수들 구현 예정
    
    
    // ============ 입장 시스템 ============
    
    // TODO: [나중에] 입장 검증 함수들 구현 예정
    
    
    // ============ 유틸리티 함수 ============
    
    // TODO: [각자] 조회 및 기타 함수들 구현 예정
    
}
