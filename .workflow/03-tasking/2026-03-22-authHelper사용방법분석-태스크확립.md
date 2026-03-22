# 체크리스트 (Checklist)

## 요약
- 설계 기반: `.workflow/02-design/2026-03-22-authHelper사용방법분석-설계.md`
- 총 태스크 수: 2
- 현재 활성 태스크: Task 1

## 작업 목록
- [ ] Task 1: 개발 환경 fallback 사용자 제거
목표: `src/server/utils/auth.ts`에서 개발 환경일 때 `x-discord-id`로 조회한 사용자만 `user`로 사용하도록 수정하고, 관리자/첫 사용자 fallback 로직을 제거한다.
완료 조건: `findDevelopmentFallbackUser`가 제거되거나 더 이상 호출되지 않고, 개발 환경 분기에서 fallback 없이 `requestedUser`만 `createAuthContext`에 전달된다.
의존성: `.workflow/02-design/2026-03-22-authHelper사용방법분석-설계.md`

- [ ] Task 2: 변경 영향 검증
목표: 수정 후 `authHelper`의 개발 환경 동작이 "내 계정 조회 + 권한 우회"로 한정되는지 확인한다.
완료 조건: 변경된 코드 기준으로 개발 환경에서 첫 사용자/관리자 fallback이 사라졌음을 확인하고, 영향 요약을 남긴다.
의존성: Task 1

## 진행 로그
- 없음
