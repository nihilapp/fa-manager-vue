# PDCA Plan: Admin Permission Expansion

## 1. 개요 (Overview)
- **작업명**: 관리자 권한 확장 및 보안 강화 (Admin Permission Expansion & Security Hardening)
- **목적**: 기존 API에 일관된 관리자 우회(Admin Bypass) 로직을 적용하여 운영 효율성을 높이고, 일반 사용자의 부적절한 권한 승격 및 타인 리소스 조작을 방어함.
- **일자**: 2026-03-18

## 2. 현재 상태 분석 (As-Is)
- `authHelper`에 `isAdmin` 판별 로직은 있으나 사용처가 불분명함.
- `PUT /api/users/:id` 등에서 일반 사용자가 자신의 `role`을 변경할 수 있는 취약점 존재.
- 캠페인 멤버 추가/제거 시 본인 여부만 체크하여 관리자가 대리 처리 불가.
- 캐릭터 및 세션 관련 API에서 소유권 검증 로직이 파편화되어 있음.

## 3. 목표 상태 (To-Be)
- **공통 권한 헬퍼**: `authHelper`에 `isAdmin`을 고려한 검증 보조 함수(`assertSelfOrAdmin`, `assertOwnerOrAdmin`)를 도입하여 API 코드 가독성 향상.
- **보안 강화**: 사용자 수정 시 관리자만 `role`을 변경할 수 있도록 제한.
- **권한 일관성**: 모든 CUD(Create, Update, Delete) API에서 "본인 소유 또는 관리자" 원칙을 준수하도록 로직 수정.
- **문서화**: `md/api.md`에 각 엔드포인트별 권한 요구 사항 명시.

## 4. 상세 작업 계획 (Execution Plan)

### Phase 1: 기반 인프라 보강
- [ ] `src/server/utils/auth.ts` 수정:
    - `hasPermission` 로직 정교화
    - `isAdmin`을 이용해 대상 ID와 요청자 ID를 비교하는 유틸리티 추가

### Phase 2: 사용자(Users) 보안 강화
- [ ] `POST /api/users`: `role` 입력을 무시하고 기본값(`ROLE_USER`) 강제.
- [ ] `PUT /api/users/:id`: `role` 변경은 오직 `isAdmin`일 때만 가능하도록 로직 추가.

### Phase 3: 캠페인 및 멤버십(Campaigns) 권한 확장
- [ ] `POST /api/campaigns/:id/members/:userId`: 관리자면 타인을 추가 가능하도록 수정.
- [ ] `DELETE /api/campaigns/:id/members/:userId`: 관리자면 타인을 강퇴 가능하도록 수정.

### Phase 4: 캐릭터 및 세션(Characters/Sessions) 권한 확장
- [ ] 캐릭터 생성/수정/삭제 시 소유권 확인 로직에 관리자 우회 추가.
- [ ] 세션 플레이어 등록/제거 시 관리자 우회 추가.
- [ ] 세션 로그(Logs) 수정/삭제 시 관리자 우회 추가.

### Phase 5: 검증 및 문서화
- [ ] 각 시나리오별 API 테스트 (HTTP Client 이용).
- [ ] `md/api.md` 및 `PRD/Api-Specification.md` 업데이트.

## 5. 리스크 및 고려사항
- **회귀 버그**: 기존에 잘 동작하던 "본인 확인" 로직이 관리자 우회 로직 도입으로 인해 의도치 않게 열리는 경우 주의.
- **데이터 일관성**: 관리자가 타인 대신 행동할 때 `creatorId`나 `updaterId`가 올바르게 기록되는지 확인 필수.
