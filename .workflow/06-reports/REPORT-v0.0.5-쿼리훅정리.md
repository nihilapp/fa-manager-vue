# REPORT-v0.0.5-쿼리훅정리

## 1. 작업 개요
query/mutation 훅의 인터페이스를 객체 인자 기반으로 통일하고, 공통 에러 처리 계층을 실제 사용 범위에 맞게 축소했습니다.

## 2. 핵심 결과
- `useGet`과 mutation 훅 전부가 `api`, `enabled`, `fetcher`, `onSuccess`, `onError` 중심 구조를 따르도록 정리되었습니다.
- `usePost`, `usePut`, `usePatch`, `useDelete`는 각 파일에서 직접 `useMutation`을 호출하도록 변경되었습니다.
- `api-error-handler.ts`에서는 미사용 토스트 상태와 `throwIfError`를 제거했습니다.
- `user.store.ts`는 새 `useGet` 객체 인자 형식으로 갱신되었습니다.

## 3. 주요 수정 파일
- `src/app/composables/query/useApiRequest.ts`
- `src/app/composables/query/useGet.ts`
- `src/app/composables/query/usePost.ts`
- `src/app/composables/query/usePut.ts`
- `src/app/composables/query/usePatch.ts`
- `src/app/composables/query/useDelete.ts`
- `src/app/utils/api-error-handler.ts`
- `src/app/stores/user.store.ts`

## 4. 판단 근거
- 기존 구조는 위치 기반 인자와 `createApiMutation` 의존으로 인해 훅 간 표면 API가 분산되어 있었습니다.
- 이번 변경으로 훅 사용법과 반환 형태가 단순해졌고, 공통 로직은 중복 없이 최소 범위로 유지되었습니다.

## 5. 특이사항
- PowerShell 실행 정책으로 인해 `pnpm` 스크립트 직접 실행은 차단되었고, `pnpm.cmd`로 타입 검증을 수행했습니다.
- `.workflow/template` 경로는 저장소에 없어 기존 문서 형식을 기준으로 절차 문서를 작성했습니다.

## 6. 후속 작업
- mutation 훅이 실제 페이지와 컴포넌트에서 사용되기 시작하면 `execute` 반환값과 `enabled` 동작을 기준으로 사용 패턴을 확정하시는 것이 좋습니다.
- 필요하면 다음 단계에서 query key와 mutation key 네이밍 규칙을 별도 문서로 고정하실 수 있습니다.
