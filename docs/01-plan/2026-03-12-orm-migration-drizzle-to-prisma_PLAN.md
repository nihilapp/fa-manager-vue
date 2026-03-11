# PDCA Plan: Drizzle ORM에서 Prisma로의 이관

## 1. 개요 (Overview)
- **작업명**: ORM 이관 (Drizzle ORM -> Prisma)
- **배경**: 프로젝트의 생산성 향상, 타입 안전성 강화 및 Prisma의 생태계 도구 활용을 위해 ORM 교체 결정.
- **목표**: 기존 Drizzle 기반의 DB 레이어를 Prisma로 100% 교체하고 기능을 유지함.

## 2. 현황 분석 (Current Status)
- **DB 종류**: PostgreSQL
- **사용 중인 ORM**: Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **영향 범위**:
    - `server/db/schema.ts`: 전체 테이블 및 관계 정의 (약 10개 테이블)
    - `server/db/index.ts`: DB 인스턴스 초기화
    - `server/api/`: 약 97개 지점의 `db.*` 쿼리 코드
    - `server/utils/`: `audit.ts`, `auth.ts`, `get-user-context.ts` 등 핵심 유틸리티

## 3. 작업 범위 (Scope)
- **의존성 교체**: `drizzle-orm`, `drizzle-kit` 제거 및 `prisma`, `@prisma/client` 설치.
- **스키마 이관**: `server/db/schema.ts`의 Drizzle 스키마를 `prisma/schema.prisma`로 변환.
- **클라이언트 초기화**: `server/db/index.ts`에서 `PrismaClient` 설정.
- **API 리팩터링**:
    - `db.query.*.findFirst` -> `prisma.*.findFirst`
    - `db.insert(...).values(...)` -> `prisma.*.create`
    - `db.update(...).set(...).where(...)` -> `prisma.*.update`
    - `db.select().from(...).where(...)` -> `prisma.*.findMany` (필요 시 `select` 옵션)
- **유틸리티 및 동적 로직**:
    - `audit.ts` 내 로그 기록 로직 수정.
    - `rollback.post.ts`의 동적 테이블 접근 로직 Prisma 방식(또는 `$queryRaw`)으로 전환.
- **마이그레이션**: 기존 DB 구조 유지하며 Prisma 마이그레이션 히스토리 초기화.

## 4. 리스크 및 고려사항 (Risks & Considerations)
- **문법 차이**: Drizzle은 SQL-like하고 Prisma는 Object-oriented함. 특히 다대다 관계 처리 방식의 차이 주의.
- **동적 쿼리**: Prisma는 런타임에 모델 이름을 동적으로 사용하기 까다로움 (Audit Rollback 로직 확인 필요).
- **Zod 연동**: `drizzle-zod`를 사용 중인 경우 `zod-prisma-types` 등으로 대체 검토 필요.
- **성능**: Prisma의 `findMany`와 Drizzle의 `select` 간 성능 차이 점검.

## 5. 실행 전략 (Execution Strategy)
- **단계 1 (Setup)**: Prisma 패키지 설치 및 `npx prisma init`.
- **단계 2 (Schema)**: 기존 DB에서 `npx prisma db pull`을 수행하거나 수동으로 `schema.prisma` 작성 후 `npx prisma generate`.
- **단계 3 (Refactor - Core)**: `server/db/index.ts` 및 주요 유틸리티(`auth.ts` 등) 수정.
- **단계 4 (Refactor - API)**: API 엔드포인트별 순차적 이관 (User -> Campaign -> Character ...).
- **단계 5 (Validation)**: 모든 API 기능 테스트 및 Audit 로그 정상 작동 확인.

## 6. 성공 기준 (Success Criteria)
- 모든 API가 기존과 동일하게 동작함.
- `audit_logs`가 모든 변경 사항을 올바르게 기록함.
- `npx prisma validate` 및 `npx prisma generate` 시 오류 없음.

---
**📊 bkit Feature Usage**
- ✅ **Used**: /pdca plan, grep_search, read_file
- ⏭️ **Not Used**: /pdca design (Plan 단계 이후 수행 예정)
- 💡 **Recommended**: `/pdca design orm-migration-drizzle-to-prisma`
