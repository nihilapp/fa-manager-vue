# [DESIGN] 캠페인 API 엔드포인트 세트 개발 (10종)

## 1. 개요 (Executive Summary)

| 프로젝트 명 | 캠페인 API 세트 고도화 |
| :--- | :--- |
| **대상 피처** | 캠페인 CRUD, 멤버 관리, 캐릭터 소속 관리 (총 10종) |
| **개발 날짜** | 2026-03-15 |
| **주요 목표** | 캠페인 도메인의 완전한 생명주기 관리 및 관계 로직 구현 |

### 🔍 설계 요약
- **인증 규격**: 모든 CUD 요청 시 `X-Discord-ID` 헤더 필수 검증.
- **데이터 무결성**: 캠페인 생성 시 생성자를 `MASTER` 권한으로 자동 등록하는 트랜잭션 처리.
- **조회 최적화**: 목록 조회 시 `deleteYn: 'N'` 기본 필터링 및 페이징 적용.
- **표준 응답**: `BaseResponse` 및 `ListData` 클래스를 활용한 일관된 응답 구조.

### 💡 가치 전달 (Value Delivered)
- **Problem**: 캠페인과 멤버/캐릭터 간의 복잡한 관계 관리 로직 부재.
- **Solution**: 명확한 엔드포인트 분리와 트랜잭션 보장을 통한 관계 관리 자동화.
- **UX Effect**: 일관된 API 응답을 통해 프론트엔드 연동 생산성 향상.
- **Core Value**: 시스템의 핵심 도메인인 캠페인 관리의 안정성 및 확장성 확보.

---

## 2. 상세 설계 (Detailed Design)

### 2.1 파일 구조 및 라우팅
- `src/server/api/campaigns/`
  - `index.get.ts`: 목록 조회
  - `index.post.ts`: 신규 생성 (트랜잭션: 캠페인 생성 + 생성자 멤버 등록)
  - `[id].get.ts`: 상세 조회 (with sessions, members, characters)
  - `[id].put.ts`: 기본 정보 수정 (이름, 설명 등)
  - `[id].delete.ts`: 소프트 딜리트
  - `[id]/status.put.ts`: 진행 상태 변경
  - `[id]/members/[userId].post.ts`: 멤버 추가 (초대)
  - `[id]/members/[userId].delete.ts`: 멤버 추방/탈퇴
  - `[campaignId]/characters/[characterId].post.ts`: 캐릭터 등록
  - `[campaignId]/characters/[characterId].delete.ts`: 캐릭터 제거

### 2.2 핵심 비즈니스 로직
1.  **캠페인 생성 (POST /api/campaigns)**
    - `X-Discord-ID` 헤더로 사용자 확인.
    - `db.transaction` 시작.
    - `campaignsTable`에 레코드 생성.
    - 생성된 캠페인 ID와 사용자 ID를 사용하여 `campaignMembersTable`에 `MASTER` 역할로 등록.
2.  **소프트 딜리트 (DELETE /api/campaigns/[id])**
    - `updateDate`와 `deleteDate`를 현재 시간으로 명시적 갱신.
    - `useYn: 'N'`, `deleteYn: 'Y'` 처리.
3.  **멤버/캐릭터 관리**
    - `members`: `campaignMembersTable`에 대한 INSERT/DELETE.
    - `characters`: `charactersTable`의 `campaignId` 컬럼을 대상 캠페인 ID로 업데이트하거나 `null`로 해제.

### 2.3 기술 사양
- **DTO**: `CampaignInDto`, `CampaignOutDto` 사용.
- **Helper**: `buildDrizzleWhere`를 이용한 동적 검색 필터링.
- **Time**: 모든 시간 기록은 서버 시간(`new Date()`)을 명시적으로 사용.

---

## 3. 검증 설계 (Verification)
- `npx nuxi typecheck`를 통한 전역 타입 안정성 확인.
- 각 엔드포인트별 비정상 케이스(헤더 누락, 중복 이름 등) 가드 로직 작동 여부 확인.
