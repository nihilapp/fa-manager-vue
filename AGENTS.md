- **CRITICAL** 이 프로젝트에서 tailwindcss 의 기본 클래스는 동작하지 않을 수 있습니다. `/src/app/assets/styles/tailwind.css` 파일을 참조하여 사용 가능한 클래스를
  확인하십시오.
- **CRITICAL** `src/app/types/manual-app-imports.d.ts`, Nuxt 오토임포트, 전역 선언으로 해결되는 대상은 코드 생성 시 절대 직접 import 하지 마십시오. 마스터가
  후처리로 import 를 지우지 않도록 처음부터 오토임포트 규칙을 지키는 것이 중요합니다.
- **CRITICAL** 검증 등을 이유로 pnpm 을 실행할 때에는 cmd 로 실행하도록 합니다.
- **CRITICAL** 모든 페이지는 렌더링 컴포넌트를 래핑합니다. 페이지.vue 에서 직접적인 렌더링 로직을 구현해서는 안됩니다.
- **CRITICAL** 커밋 메시지는 첫 줄을 반드시 `[yyyy MMdd]: 커밋 메시지 요약` 형식으로 작성하고, 줄바꿈 후 아래에 불릿 목록으로 상세 내용을 작성하십시오. 각 상세 줄은 반드시
  `- type: message` 형식을 사용합니다.
- **CRITICAL** `.workflow/TODO.md`를 현재 진행 중 작업의 단일 기준 문서로 사용하십시오. 작업 시작 시 등록하고, 상태 변경 시 즉시 갱신하며, 완료 시
  `.workflow/history.md` 최상단으로 이동시켜야 합니다.
