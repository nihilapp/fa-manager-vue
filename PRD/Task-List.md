# Development Task List

## [Phase 1] 초기화 및 기반 구축
- [x] 프로젝트 초기화 및 PRD 셋업 (진행 완료)
- [x] buildPrismaWhere 유틸리티 개선 (AND/OR 지원 및 반환값 추가) (완료)
- [ ] 프론트엔드 데이터 패칭 레이어 개선 (Vue Query 전환)
  - [ ] `@tanstack/vue-query` 및 쿼리 키 빌더 설치
  - [ ] Nuxt 플러그인 및 SSR 하이드레이션 설정
  - [ ] `useGet`, `usePost` 등 커스텀 컴포저블 리팩토링
  - [ ] 전역 쿼리 키 팩토리 구축
- [ ] Drizzle ORM 셋업 및 DB 연결 환경 구축
- [ ] 데이터베이스 스키마 및 관계 정의
  - Player/User DB, Campaign, CampaignMember, PC, Session, ActionLogs(Exp/Resource)

## [Phase 2] 인증 및 캠페인/캐릭터 코어 기능
- [ ] 디스코드 ID 기반 단순 인증/인가 로직 (개발용 모형) 연동
- [ ] 캠페인 CRUD 전역 API (생성 및 가입 중심) 개발
- [ ] 캐릭터(PC) CRUD API 개발 (가입한 캠페인 단위 종속)
- [ ] 세션(Session) 등록 API

## [Phase 3] 로그 트리거 및 관리 시스템
- [ ] 경험치 변량 업데이트 및 로그 적재 로직 통합 구현
- [ ] 자원 소비 업데이트 및 로그 적재 로직 통합 구현
- [ ] 각 액션 사항 열람 용도의 로그 뷰 API 구현

## [Admin] 권한 체계 확장 및 보안 강화
- [ ] `authHelper` 내 권한 검증 보조 함수(`assertSelfOrAdmin` 등) 구현
- [ ] `PUT /api/users/:id` 등 사용자 수정 시 `role` 변경 방어 로직 적용
- [ ] 캠페인 멤버 추가/제거 시 관리자 우회 로직 적용
- [ ] 캐릭터/세션/로그 관련 API 전수 권한 검토 및 관리자 우회 적용
- [ ] `md/api.md` 문서 내 권한 정책 명시 및 갱신

## [Admin] 감사 로그 및 롤백 시스템
- [x] `users` 테이블 권한 컬럼(`role`) 추가 및 `audit_logs` 테이블 신설 (완료)
- [x] 어드민 권한 검증(`ensureAdmin`) 및 로깅(`createAuditLog`) 유틸리티 구현 (완료)
- [x] 어드민 전용 감사 로그 목록 조회 및 데이터 롤백 API 구현 (완료)
- [x] 모든 도메인(`users`, `campaigns`, `characters` 등) CUD API에 감사 로그 통합 (완료)
- [x] 모든 도메인 생성(INSERT) 시 `creatorId`와 `updaterId` 동시 설정 (일관성 확보)
- [x] 감사 로그 상세 조회 API (`GET /api/admin/audit-logs/[id]`) 구현 (완료)
- [x] 롤백 시 FK 제약 조건 위반에 대한 세밀한 에러 핸들링 보완 (완료)

## [Phase 4] UI 설계 및 퍼블리싱 (Mockup & Integration)
- [ ] 레이아웃 구성 및 로그인(디코 ID 입력) 화면 작업
- [ ] 진행중인 캠페인 대시보드 및 세션 리스트 UI 
- [ ] персона́ж(캐릭터) 프로필 뷰어 및 수정 인터페이스 
- [ ] 경험치/소비현황 로그 변동 히스토리 타임라인 뷰어

## [Phase 5] 검증 단계 (QA & Iteration)
- [ ] bkit Zero Script QA 기반 컴포넌트/API 모니터링
- [ ] 버그 수정 및 최적화
- [ ] 1차 마일스톤 완료 및 최종 배포 시나리오 검토
