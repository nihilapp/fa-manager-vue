# 📋 API CRUD 생성 계획 (Plan)

## 📌 목표 (Goal Description)
`docs/01-plan/2026-03-01-schema-PLAN.md`에서 정의한 설계안에 맞춰 현재 `server/api` 폴더 내에 생성된 `users` API와 동일한 구조의 CRUD 엔드포인트를 나머지 모든 엔티티에 대해 생성합니다.

### ❓ 집중 검토 필요
> [!IMPORTANT]
> - `users` API와 동일하게 모든 목록 조회(`index.get.ts`) 모델에 페이징(`page`, `size`)을 공통 적용합니다.
> - 캠페인 하위의 종속적인 데이터들(`campaignMembers`, `characters` 등)의 경우, `/api/campaigns/[id]/members` 처럼 중첩 라우트로 구성할 수도 있고, 일관성을 위해 단일 라우트 `/api/campaign-members`에 `campaignId` 파라미터로 필터링할 수도 있습니다. 
>   - **제안 방식**: Nuxt API 규칙의 직관성과 관리를 위해 `/api/{엔티티명}` 플랫(Flat) 폴더 구조를 유지하고, 검색 파라미터(`InDto`)로 관계를 필터링하는 방식을 제안합니다. 마스터의 의견을 듣고 진행하겠습니다.

---

## 🏗️ 제안하는 생성 대상 (Proposed Folders & Files)

다음 7개 엔티티에 대해 각각 5개의 파일(`index.get.ts`, `[id].get.ts`, `index.post.ts`, `[id].patch.ts`, `[id].delete.ts`)을 생성합니다.

### 1. Campaigns (`server/api/campaigns`)
- `index.get.ts` / `[id].get.ts` / `index.post.ts` / `[id].patch.ts` / `[id].delete.ts`

### 2. Campaign Members (`server/api/campaign-members`)
- `index.get.ts` / `[id].get.ts` / `index.post.ts` / `[id].patch.ts` / `[id].delete.ts`

### 3. Characters (`server/api/characters`)
- `index.get.ts` / `[id].get.ts` / `index.post.ts` / `[id].patch.ts` / `[id].delete.ts`

### 4. Sessions (`server/api/sessions`)
- `index.get.ts` / `[id].get.ts` / `index.post.ts` / `[id].patch.ts` / `[id].delete.ts`

### 5. Session Characters (`server/api/session-characters`)
- `index.get.ts` / `[id].get.ts` / `index.post.ts` / `[id].patch.ts` / `[id].delete.ts`

### 6. Exp Logs (`server/api/exp-logs`)
- `index.get.ts` / `[id].get.ts` / `index.post.ts` / `[id].patch.ts` / `[id].delete.ts`

### 7. Currency Logs (`server/api/currency-logs`)
- `index.get.ts` / `[id].get.ts` / `index.post.ts` / `[id].patch.ts` / `[id].delete.ts`

---

## 🧪 검증 계획 (Verification Plan)

### Automated Tests
1. API 코드가 모두 생성된 직후, `npx nuxi typecheck` 명령어를 통해 타입 검증을 실행하여 Drizzle Schema, InDto/OutDto 매핑 간의 오류가 없는지 검증합니다.

### Manual Verification
1. 터미널에서 `npm run dev` 실행
2. 브라우저/Postman에서 API (`/api/campaigns?page=0&size=10` 등)가 잘 반환되는지 확인
