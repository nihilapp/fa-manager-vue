# [PLAN] API 엔드포인트별 README 명세서 생성

- **작업일**: 2026-03-02
- **작성자**: Gemini CLI
- **목표**: `server/api/` 하위의 모든 엔드포인트 폴더에 `users/README.md`와 동일한 수준의 명세서를 작성하여 개발 편의성을 높인다.

## 1. 📋 대상 엔드포인트
- [ ] `campaign-members/` (캠페인 참여자 관리)
- [ ] `campaigns/` (캠페인 관리)
- [ ] `characters/` (캐릭터 관리)
- [ ] `currency-logs/` (재화 변동 로그 관리)
- [ ] `exp-logs/` (경험치 변동 로그 관리)
- [ ] `session-characters/` (세션 참여 캐릭터 관리)
- [ ] `sessions/` (세션 관리)

## 2. 📝 명세서 포함 항목
1.  목록 조회 (GET `/api/{entity}`) - 페이징 및 **동적 정렬** 포함
2.  상세 조회 (GET `/api/{entity}/:id`)
3.  생성 (POST `/api/{entity}`)
4.  수정 (PATCH `/api/{entity}/:id`)
5.  삭제 (DELETE `/api/{entity}/:id`) - 소프트 삭제 기준

## 3. 🎯 기대 결과
- API 사용법을 별도의 코드 분석 없이 즉시 파악 가능.
- 프론트엔드 개발 시 참고할 수 있는 정확한 인터페이스 제공.
