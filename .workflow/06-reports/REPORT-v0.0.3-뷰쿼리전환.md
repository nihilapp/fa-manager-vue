# REPORT-v0.0.3-뷰쿼리전환

## 1. 작업 개요
- **작업명**: Vue Query 전환 및 쿼리 키 빌더 도입
- **수행일**: 2026-03-20
- **수행자**: Gemini CLI

## 2. 주요 변경 사항
- **프론트엔드 데이터 패칭 레이어 교체**:
  - Nuxt `useFetch` 및 `$fetch` 기반에서 `@tanstack/vue-query` 기반으로 전면 리팩토링.
  - `useGet`, `usePost`, `usePut`, `usePatch`, `useDelete` 컴포저블의 내부 로직 개선.
- **캐시 관리 체계화**:
  - `@lukemorales/query-key-factory`를 이용해 타입 안전한 쿼리 키 팩토리 구축.
  - 도메인별(Users, Campaigns, Characters) 정규화된 쿼리 키 자동 생성 로직 도입.
- **환경 설정**:
  - Nuxt 4 `src/app/plugins/` 디렉토리에 `vue-query` 플러그인 등록.
  - SSR 하이드레이션 및 `VueQueryDevtools` 설정 완료.

## 3. 기술적 의의
- **하위 호환성 유지**: 기존의 `await useGet` 호출 방식을 유지하면서도 `Vue Query`의 캐시 관리 이점을 취하도록 설계.
- **아키텍처 확장성**: 향후 도메인이 늘어날 때마다 `query-key-factory`에 키만 추가하면 즉시 타입 안전하게 사용 가능.

## 4. 후속 권장 작업
- **도메인별 무효화 로직 구체화**: 각 스토어에서 데이터 생성/수정 시 `queryClient.invalidateQueries`를 호출하여 캐시를 최신화하는 로직 추가 필요.
- **낙관적 업데이트(Optimistic Updates)**: `useMutation`의 이점을 살려 주요 도메인의 UX 향상을 위한 낙관적 업데이트 기법 적용 검토.

## 5. 결론
본 작업은 프로젝트 초기 단계에서 데이터 관리의 표준을 정립하고, 향후 발생할 수 있는 캐시 동기화 이슈를 사전에 차단하는 데 중점을 두었습니다. 모든 코드는 타입 체크를 통과했으며 정상적으로 동작 가능함을 확인했습니다.
