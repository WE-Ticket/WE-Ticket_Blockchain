# WE-Ticket Blockchain

## 목차

- [프로젝트 개요](#프로젝트-개요)
- [How to Install](#how-to-install)
- [How to Build](#how-to-build)
- [How to Test](#how-to-test)
- [스마트 컨트랙트 아키텍처](#스마트-컨트랙트-아키텍처)
- [소스코드 설명](#소스코드-설명)
- [네트워크 설정](#네트워크-설정)
- [환경 변수](#환경-변수)
- [사용 예제](#사용-예제)

---

## 프로젝트 개요

**WE-Ticket**은 암표 근절을 위한 DID(분산신원 증명) 및 NFT 기반 티켓팅 플랫폼이다. 본 Repository는 WE-Ticket의 Blockchain 영역을 담당하고 있으며, 주로 NFT 티켓 발행을 수행한다.

### 주요 기능

- **NFT 기반 티켓**: 각 티켓을 불변의 메타데이터를 가진 고유한 ERC-721 토큰으로 발행
- **암표 방지 메커니즘**: DID 매핑을 통한 1인 1티켓 정책을 구현
- **투명한 양도 시스템**: 모든 티켓 양도 내역을 체인에 기록하여 완전한 추적
- **접근 제어**: 역할 기반 권한을 가진 소유자 전용 발행 기능을 구현
- **티켓 사용 추적**: 티켓 사용 여부 및 입장 검증을 온체인에서 확인

### 기술 스택

- **블록체인 플랫폼**: Ethereum (Sepolia Testnet & Localhost)
- **스마트 컨트랙트 언어**: Solidity ^0.8.28
- **개발 프레임워크**: Hardhat
- **토큰 표준**: ERC-721 (OpenZeppelin)
- **JavaScript 런타임**: Node.js with Ethers.js v6

---

## How to Install

### 사전 요구사항

시스템에 다음 항목이 설치되어 있어야 한다:

- **Node.js**: v16.0.0 이상
- **npm**: v7.0.0 이상
- **Git**: 최신 버전

### 설치 단계

1. **저장소 클론**

   ```bash
   git clone https://github.com/WE-Ticket/WE-Ticket_Blockchain.git
   cd WE-Ticket_Blockchain
   ```

2. **의존성 패키지 설치**

   ```bash
   npm install
   ```

   다음과 같은 필수 패키지들이 설치된다:

   - `hardhat`: 이더리움 개발 환경
   - `@nomicfoundation/hardhat-ethers`: ethers.js v6를 위한 Hardhat 플러그인
   - `@nomicfoundation/hardhat-toolbox`: 테스트 및 배포를 위한 Hardhat 툴킷
   - `@openzeppelin/contracts`: 안전한 스마트 컨트랙트 라이브러리
   - `ethers`: 블록체인 상호작용을 위한 이더리움 라이브러리
   - `dotenv`: 환경 변수 관리

3. **환경 변수 설정**

   루트 디렉토리에 `.env` 파일을 생성한다:

   ```bash
   touch .env
   ```

   다음 설정을 추가한다 (자세한 내용은 [환경 변수](#환경-변수) 섹션 참고):

   ```env
   CHAIN_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
   PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
   NFT_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
   TO_ADDRESS=0xRECIPIENT_WALLET_ADDRESS
   ```

4. **설치 확인**

   ```bash
   npx hardhat --version
   ```

   예상 출력: `2.25.0` 이상

---

## How to Build

### 스마트 컨트랙트 컴파일

1. **모든 컨트랙트 컴파일**

   ```bash
   npx hardhat compile
   ```

   이 명령어는 다음을 수행한다:

   - `contracts/WETicketNFT.sol`과 의존성 파일들을 컴파일한다.
   - ABI (Application Binary Interface) 파일을 생성한다.
   - 배포용 바이트코드를 생성한다.
   - 아티팩트를 `artifacts/`에, 캐시를 `cache/`에 출력한다.

2. **빌드 아티팩트 정리 (필요시)**

   ```bash
   npx hardhat clean
   ```

   캐시된 파일을 제거하고 재컴파일을 강제한다.

3. **예상 출력**

   ```
   Compiling 1 file with 0.8.28
   Compilation finished successfully
   ```

4. **컴파일 결과 확인**

   생성된 아티팩트를 확인한다:

   ```bash
   ls -la artifacts/contracts/WETicketNFT.sol/
   ```

   다음 파일들을 확인할 수 있다:

   - `WETicketNFT.json` - ABI와 바이트코드 포함
   - `WETicketNFT.dbg.json` - 디버그 정보

### 다른 Solidity 버전으로 빌드

Solidity 컴파일러 버전을 변경해야 하는 경우, [hardhat.config.js](hardhat.config.js)를 수정한다:

```javascript
module.exports = {
  solidity: "0.8.28", // 여기서 버전 변경
  // ... 기타 설정
};
```

그 후 재컴파일한다:

```bash
npx hardhat clean
npx hardhat compile
```

---

## How to Test

### 로컬 테스트 네트워크 실행

1. **Hardhat 로컬 노드 시작**

   새 터미널을 열고 실행한다:

   ```bash
   npx hardhat node
   ```

   이 명령어는 다음을 수행한다:

   - `http://127.0.0.1:8545`에 로컬 이더리움 네트워크를 시작한다.
   - 각각 10000 ETH를 가진 20개의 테스트 계정을 생성한다.
   - 계정 주소와 개인키를 표시한다.
   - 중지 (Ctrl+C) 할 때까지 계속 실행된다.

   **모든 테스트 활동을 위해 이 터미널을 열어둔다.**

2. **예상 출력**

   ```
   Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

   Accounts
   ========
   Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ...
   ```

### 로컬 네트워크에 컨트랙트 배포

**새 터미널**에서 (노드는 계속 실행 유지):

```bash
npx hardhat run scripts/deploy.js --network localhost
```

예상 출력:

```
WETicketNFT deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**중요**: 배포된 컨트랙트 주소를 복사하여 `.env` 파일을 업데이트한다:

```env
NFT_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 테스트 스크립트 실행

#### 1. 티켓 발행 테스트

더미 데이터를 사용하여 사전에 컨트랙트를 테스트한다.
더미 데이터는 다음 스크립트에 작성되어 있다.

```bash
npx hardhat run scripts/dummy-data.js --network localhost
```

이 스크립트는 다음을 수행한다:

- 미리 정의된 데이터로 샘플 티켓을 발행한다.
- 발행된 토큰 ID를 출력한다.
- 블록체인에서 티켓 생성을 확인한다.

예상 출력:

```
✅ Ticket minted successfully!
Token ID: 1
Transaction Hash: 0x...
```

#### 2. 티켓 정보 확인 테스트

```bash
npx hardhat run scripts/test-check-ticket.js --network localhost
```

해당 스크립트를 통한 종합 테스트는 다음을 수행한다:

- 토큰 ID #1의 티켓 정보를 조회한다.
- 공연 상세 정보를 표시한다. (ID, 세션, 좌석, 가격, 날짜)
- 티켓 메타데이터를 표시한다. (발행 시간, 사용 상태, 양도 가능 여부)

예상 출력:

```
토큰 ID 1번 티켓 정보:
공연 ID: 1
세션 ID: 101
좌석: A-15
가격: 50000 원
공연날짜: 2024-08-28 09:00:00
발행시간: 2024-12-18 02:30:45
양도가능: 예
사용여부: 미사용

✅ 모든 조회 완료!
```

### Sepolia 테스트넷에서 테스트

1. **Sepolia ETH 받기**

   미리 본인이 선호하는 파우셋에서 테스트넷 ETH를 받는다.

2. **Sepolia 네트워크 설정**

   `.env` 파일을 Infura/Alchemy 엔드포인트로 업데이트한다:

   ```env
   CHAIN_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   PRIVATE_KEY=0xYOUR_PRIVATE_KEY
   ```

3. **Sepolia에 배포**

   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. **Sepolia에서 테스트 실행**

   ```bash
   npx hardhat run scripts/test-check-ticket.js --network sepolia
   ```

5. **Etherscan에서 트랜잭션 확인**

   다음 주소에서 확인한다: `https://sepolia.etherscan.io/tx/YOUR_TRANSACTION_HASH`

---

## 스마트 컨트랙트 아키텍처

### WETicketNFT 컨트랙트

핵심 컨트랙트는 [contracts/WETicketNFT.sol](contracts/WETicketNFT.sol)에 위치한다

#### 상속 구조

```
WETicketNFT
├── ERC721URIStorage (OpenZeppelin)
│   ├── ERC721
│   └── IERC721Metadata
└── Ownable (OpenZeppelin)
```

#### 주요 데이터 구조

**TicketInfo 구조체**

```solidity
struct TicketInfo {
    uint256 concertId;      // 고유 공연 식별자
    uint256 sessionId;      // 특정 세션 식별자
    string seatGrade;       // 좌석 등급 (VIP, 일반석 등)
    string seatZone;        // 공연장 구역 지정
    string seatNumber;      // 정확한 좌석 번호
    uint256 price;          // 티켓 가격
    uint256 datetime;       // 공연 타임스탬프
    uint256 issueTimestamp; // 발행 타임스탬프
    bool isTransferable;    // 양도 가능 여부 플래그
    bool isUsed;            // 입장 확인 플래그
}
```

#### 상태 변수

- `mapping(uint256 => TicketInfo) public tickets` - 토큰 ID를 티켓 정보에 매핑했다
- `uint256 private _tokenIdCounter` - 자동 증가하는 토큰 ID 생성기를 구현했다 (1부터 시작)

#### 핵심 함수

**mintTicket**

```solidity
function mintTicket(
    uint256 concertId,
    uint256 sessionId,
    string memory seatGrade,
    string memory seatZone,
    string memory seatNumber,
    uint256 price,
    uint256 datetime,
    uint256 authTimestamp
) external onlyOwner returns (uint256)
```

- **목적**: 연관된 메타데이터와 함께 새로운 NFT 티켓을 생성한다.
- **접근 제어**: 컨트랙트 소유자(WE-Ticket의 백엔드 서비스)만 접근 가능하도록 했다.
- **반환값**: 새로 발행된 토큰 ID를 반환한다.
- **이벤트**: `TicketMinted(address indexed to, uint256 indexed tokenId)`를 발생시킨다.
- **초기 상태**: 소유자 주소로 발행하고, 양도 가능 상태로, 미사용 상태로 설정했다.

**tickets** (공개 조회)

```solidity
function tickets(uint256 tokenId) external view returns (TicketInfo memory)
```

- **목적**: 완전한 티켓 정보를 조회하도록 한다.
- **매개변수**: 조회할 토큰 ID를 받는다.
- **반환값**: 모든 메타데이터를 포함하는 TicketInfo 구조체를 반환한다.

#### 이벤트

```solidity
event TicketMinted(address indexed to, uint256 indexed tokenId);
```

새 티켓이 발행될 때 발생시킨다.

---

## 소스코드 설명

### 디렉토리 구조

```
WE-Ticket_Blockchain/
├── contracts/             # Solidity 스마트 컨트랙트
│   └── WETicketNFT.sol    # 메인 NFT 티켓 컨트랙트
├── scripts/               # 배포 및 테스트 스크립트
│   ├── deploy.js          # 컨트랙트 배포 스크립트
│   ├── dummy-data.js      # 테스트 데이터 상수
│   ├── test-check-ticket.js        # 티켓 검증 스크립트
│   ├── test-check-all-tickets.js   # 티켓 정보 출력 스크립트
│   └── test-mint.js                # 티켓 발행 테스트 스크립트
├── artifacts/             # 컴파일된 컨트랙트 아티팩트 (자동 생성)
├── cache/                 # Hardhat 컴파일 캐시 (자동 생성)
├── ignition/              # Hardhat Ignition 배포 모듈
├── node_modules/          # npm 의존성 패키지
├── .env                   # 환경 설정 (저장소에 없음)
├── .gitignore             # Git 무시 규칙
├── hardhat.config.js      # Hardhat 설정 파일
├── package.json           # npm 패키지 설정
├── package-lock.json      # npm 의존성 락 파일
└── README.md              # 본 문서
```

### 주요 파일 설명

#### 스마트 컨트랙트

**[contracts/WETicketNFT.sol](contracts/WETicketNFT.sol)**

- ERC-721 표준을 구현하는 메인 NFT 티켓 컨트랙트이다.
- 티켓 발행, 저장 및 메타데이터 관리 기능이 구현되어 있다.
- OpenZeppelin의 안전한 컨트랙트 구현을 통합했다.
- 티켓 발행을 위한 소유자 전용 접근 제어를 포함했다.
- 종합적인 티켓 데이터를 위한 TicketInfo 구조체를 정의했다.

#### 주요 스크립트

**[scripts/dummy-data.js](scripts/dummy-data.js)**

- 개발 및 테스트를 위한 테스트 데이터 상수를 내보냈다.
- 모의 공연 데이터를 정의했다. (2024-08-28 ATEEZ 공연)
- 샘플 토큰 ID, 세션 정보, 좌석 배정을 포함했다.
- 일관된 테스트 데이터를 위해 다른 테스트 스크립트에서 사용했다.

#### 생성된 파일

**artifacts/** (컨트랙트 컴파일 후 자동 생성)

- 컴파일된 스마트 컨트랙트 아티팩트를 포함한다.
- ABI (Application Binary Interface) JSON 파일을 포함한다.
- 컨트랙트 배포를 위한 바이트코드를 포함한다.
- 배포된 컨트랙트와 상호작용하기 위해 스크립트에서 사용한다.

**cache/** (자동 생성)

- 더 빠른 재빌드를 위한 Hardhat 컴파일 캐시를 저장한다.
- 중간 컴파일 결과를 저장한다.
- 안전하게 삭제하고 재생성할 수 있다.

---

## 네트워크 설정

### 지원되는 네트워크

#### 1. Localhost (개발용)

- **RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: 31337 (기본 Hardhat)
- **용도**: 로컬 테스트 및 개발
- **설정**: `npx hardhat node`로 시작했다

#### 2. Sepolia 테스트넷

- **RPC URL**: `.env`의 `CHAIN_URL`로 설정했다
- **Chain ID**: 11155111
- **용도**: 공개 테스트넷 배포
- **파우셋**:
  - [Alchemy Faucet](https://sepoliafaucet.com/)
  - [Infura Faucet](https://www.infura.io/faucet/sepolia)
  - 그외 본인이 선호하는 파우셋 사이트를 활용
- **탐색기**: https://sepolia.etherscan.io/

### 네트워크 선택

Hardhat 명령어와 함께 `--network` 플래그를 사용했다:

```bash
# localhost에 배포
npx hardhat run scripts/deploy.js --network localhost

# Sepolia에 배포
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 환경 변수

프로젝트 루트에 다음 변수를 포함하는 `.env` 파일을 생성했다:

```env
# RPC 엔드포인트
CHAIN_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# 배포자 계정 개인키 (0x 접두사 포함)
PRIVATE_KEY=0xac0000000000000000000000

# 배포된 NFT 컨트랙트 주소
NFT_CONTRACT_ADDRESS=0x5FbD000000000000000000000000000000

```

---

## 추가 리소스

### 공식 문서

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)

### 블록체인 탐색기

- [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [Ethereum Mainnet Etherscan](https://etherscan.io/)

### 개발 도구

- [MetaMask](https://metamask.io/) - 이더리움 지갑

---

**최종 업데이트**: 2025년 12월 18일
**Solidity 버전**: 0.8.28
**Hardhat 버전**: 2.25.0
**OpenZeppelin Contracts**: 5.4.0
