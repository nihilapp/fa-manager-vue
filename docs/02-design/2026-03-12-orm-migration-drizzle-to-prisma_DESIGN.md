# PDCA Design: Prisma 스키마 설계 및 ORM 이관 전략 (v2)

## 1. 개요 (Overview)
- **목표**: `@PRD/DDL.md`의 최신 규칙 및 구조를 반영하여 `schema.prisma`를 설계하고, Drizzle ORM에서 Prisma로의 전환을 위한 아키텍처 수립.
- **핵심 규칙**:
    - `id` 컬럼은 항상 모델의 최상단에 위치함.
    - 공통 컬럼(`useYn` ~ `deleteDate`)은 항상 모델의 최하단에 위치함.
    - 모든 필드명은 Prisma 관례인 camelCase를 사용하되, `@map`을 통해 DB의 snake_case와 매핑함.

## 2. 데이터베이스 모델 설계 (Prisma Schema)

### 2.1 공통 필드 구조 (Bottom Columns)
Prisma 모델 정의 시 최하단에 배치될 필드 세트입니다.
- `useYn`: String @default("Y") @map("use_yn") @db.Char(1)
- `deleteYn`: String @default("N") @map("delete_yn") @db.Char(1)
- `creatorId`: BigInt? @map("creator_id")
- `createDate`: DateTime? @default(now()) @map("create_date") @db.Timestamp(6)
- `updaterId`: BigInt? @map("updater_id")
- `updateDate`: DateTime? @updatedAt @map("update_date") @db.Timestamp(6)
- `deleterId`: BigInt? @map("deleter_id")
- `deleteDate`: DateTime? @map("delete_date") @db.Timestamp(6)

### 2.2 Prisma Schema Draft (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                    BigInt    @id @default(autoincrement())
  discordId             String?   @unique @map("discord_id") @db.VarChar(100)
  name                  String    @db.VarChar(50)
  email                 String    @unique @db.VarChar(100)
  password              String    @db.VarChar(255)
  role                  String    @db.VarChar(20)
  refreshToken          String?   @map("refresh_token") @db.VarChar(1000)
  loginFailureCount     Int       @default(0) @map("login_failure_count")
  lockYn                String    @default("N") @map("lock_yn") @db.Char(1)
  lastSignInDate        DateTime? @map("last_sign_in_date") @db.Timestamp(6)
  lastPasswordChangeDate DateTime? @map("last_password_change_date") @db.Timestamp(6)

  // Relations
  campaignMembers       CampaignMember[]
  characters            Character[]
  sessionPlayers        SessionPlayer[]
  sessionLogs           SessionLog[]
  docs                  Doc[]
  logHistories          LogHistory[]

  // Common Columns (Bottom)
  useYn                 String    @default("Y") @map("use_yn") @db.Char(1)
  deleteYn              String    @default("N") @map("delete_yn") @db.Char(1)
  creatorId             BigInt?   @map("creator_id")
  createDate            DateTime? @default(now()) @map("create_date") @db.Timestamp(6)
  updaterId             BigInt?   @map("updater_id")
  updateDate            DateTime? @updatedAt @map("update_date") @db.Timestamp(6)
  deleterId             BigInt?   @map("deleter_id")
  deleteDate            DateTime? @map("delete_date") @db.Timestamp(6)

  @@index([name])
  @@map("users")
}

model Campaign {
  id                    BigInt    @id @default(autoincrement())
  name                  String    @unique @db.VarChar(50)
  description           String?   @db.VarChar(1000)
  status                String    @db.VarChar(20)
  startDate             DateTime  @map("start_date") @db.Timestamp(6)
  endDate               DateTime? @map("end_date") @db.Timestamp(6)

  // Relations
  members               CampaignMember[]
  characters            Character[]
  sessions              Session[]

  // Common Columns (Bottom)
  useYn                 String    @default("Y") @map("use_yn") @db.Char(1)
  deleteYn              String    @default("N") @map("delete_yn") @db.Char(1)
  creatorId             BigInt?   @map("creator_id")
  createDate            DateTime? @default(now()) @map("create_date") @db.Timestamp(6)
  updaterId             BigInt?   @map("updater_id")
  updateDate            DateTime? @updatedAt @map("update_date") @db.Timestamp(6)
  deleterId             BigInt?   @map("deleter_id")
  deleteDate            DateTime? @map("delete_date") @db.Timestamp(6)

  @@index([status])
  @@map("campaigns")
}

// ... 기타 모델(Character, Session 등)도 동일한 id-top, common-bottom 구조 적용
```

## 3. 이관 및 리팩터링 전략

### 3.1 DDL 준수 및 스키마 확장
- 기존 Drizzle 기반 `schema.ts`에는 없던 `Character`의 장비(mainHand 등), 자금(startCurrencyCp 등) 필드를 모두 명시적으로 추가합니다.
- `character_classes`는 별도 모델로 분리하여 1:N 관계를 형성합니다.

### 3.2 Prisma Client 통합 (`server/db/index.ts`)
- `PrismaClient`를 싱글톤으로 구성하고, 기존 `db` 변수명을 그대로 export하여 API 코드에서의 변경을 최소화합니다.

### 3.3 Audit 및 Rollback 대응
- `log_history` 모델을 활용하여 `audit.ts`를 재작성합니다.
- `rollback.post.ts`에서 테이블 이름을 기반으로 동적으로 모델에 접근하는 로직은 `prisma[modelName]` 패턴을 사용하도록 설계합니다.

## 4. 후속 작업 (Next Steps)
1. `prisma` 패키지 설치 및 초기화.
2. `schema.prisma` 전체 구현 (모든 모델 포함).
3. `npx prisma migrate dev`를 통한 DB 스키마 생성.
4. `server/db/index.ts` 교체 및 API 쿼리 리팩터링 시작.

---
**📊 bkit Feature Usage**
- ✅ **Used**: /pdca design, write_file
- ⏭️ **Not Used**: /pdca do (Design 승인 후 진행)
- 💡 **Recommended**: `/pdca do orm-migration-drizzle-to-prisma`
