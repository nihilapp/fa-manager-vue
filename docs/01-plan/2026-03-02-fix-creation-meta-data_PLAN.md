# [PLAN] 생성 시 메타데이터(creatorId, updaterId) 일관성 확보

- **작업일**: 2026-03-02
- **작성자**: Gemini CLI
- **목표**: 모든 도메인의 생성(INSERT) 엔드포인트에서 `creatorId`와 `updaterId`를 동일하게 설정하여 데이터 일관성을 확보하고 UI 처리를 단순화한다.

## 1. 📋 요구사항 분석
- **일관성**: 생성 시점은 첫 번째 수정 시점이기도 하므로, `updaterId`를 `creatorId`와 동일하게 저장한다.
- **대상 엔드포인트**: `campaign-members`, `campaigns`, `characters`, `currency-logs`, `exp-logs`, `session-characters`, `sessions`, `users`의 `index.post.ts`.
- **특이사항**: `users/index.post.ts`의 경우 가입 시점이므로 생성자 본인의 ID를 사용한다.

## 2. 🛠️ 작업 목록
- [ ] `server/api/campaign-members/index.post.ts` 수정
- [ ] `server/api/campaigns/index.post.ts` 수정
- [ ] `server/api/characters/index.post.ts` 수정
- [ ] `server/api/currency-logs/index.post.ts` 수정
- [ ] `server/api/exp-logs/index.post.ts` 수정
- [ ] `server/api/session-characters/index.post.ts` 수정
- [ ] `server/api/sessions/index.post.ts` 수정
- [ ] `server/api/users/index.post.ts` 수정

## 3. 🎯 기대 결과
- 모든 레코드 생성 시 `creatorId`와 `updaterId`가 보장된다.
- 프론트엔드에서 최종 수정자 표시 로직이 단순해진다.
- 감사 로그와 DB 레코드 간의 작성자 정보가 일치한다.
