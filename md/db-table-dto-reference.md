# DB Table / DTO Reference

`src/server/db/table` 기준 테이블 구조와 `src/server/types/dto` 기준 DTO 구조를 함께 정리한 문서다.
프론트나 다른 API consumer 에서 타입 기준을 빠르게 확인하는 용도다.

## Source

- DB Table: `src/server/db/table`
- DTO: `src/server/types/dto`
- Doc DTO 예외: `src/server/types/dto.types.ts`

## Common Types

```ts
export type UseYn = 'Y' | 'N';

export type Status = 'PREPARING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'ON_HOLD';
export type CampaignRole = 'PLAYER' | 'MASTER' | 'SUB_MASTER';
export type SessionRole = 'PLAYER' | 'MASTER';
export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN';
export type DocVisibility = 'PUBLIC' | 'PRIVATE';
export type DocStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
export type CharacterStatus = 'ACTIVE' | 'RESTING' | 'RETIRED' | 'DECEASED';
export type TransactionType = 'REWARD' | 'INCOME' | 'EXPENSE' | 'EXCHANGE' | 'INIT';
export type LogActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE';

export interface CommonMetaRow {
  id: number;
  useYn: UseYn | null;
  deleteYn: UseYn | null;
  creatorId: number | null;
  createDate: Date | string;
  updaterId: number | null;
  updateDate: Date | string | null;
  deleterId: number | null;
  deleteDate: Date | string | null;
}

export interface CommonQueryDto {
  id?: number;
  idList?: number[];
  page?: number;
  size?: number;
  sort?: string;
  useYn?: UseYn;
  deleteYn?: UseYn;
  creatorId?: number;
  createDate?: string;
  updaterId?: number;
  updateDate?: string;
  deleterId?: number;
  deleteDate?: string;
  [key: string]: any;
}

export interface CommonInDto extends CommonQueryDto {}

export interface CommonOutDto {
  id?: number;
  useYn?: UseYn;
  deleteYn?: UseYn;
  creatorId?: number | null;
  createDate?: Date | string | null;
  updaterId?: number | null;
  updateDate?: Date | string | null;
  deleterId?: number | null;
  deleteDate?: Date | string | null;
}
```

## Users

### DB Interface

```ts
export interface UserRow extends CommonMetaRow {
  discordId: string;
  name: string;
  role: UserRole;
}
```

### DTO

```ts
export interface UserQueryDto extends CommonQueryDto {
  discordId?: string;
  name?: string;
  role?: UserRole;
}

export interface UserCreateDto {
  discordId: string;
  name: string;
  role?: UserRole;
  creatorId?: number;
}

export interface UserUpdateDto extends CommonInDto {
  name?: string;
  role?: UserRole;
}

export interface UserOutDto extends CommonOutDto {
  discordId?: string;
  name?: string;
  role?: UserRole;

  campaigns?: CampaignOutDto[];
  campaignMembers?: CampaignMemberOutDto[];
  characters?: CharacterOutDto[];
  sessionPlayers?: SessionPlayerOutDto[];
  sessionLogs?: SessionLogOutDto[];
  docs?: DocOutDto[];
  logHistories?: LogHistoryOutDto[];
}
```

## Campaigns

### DB Interface

```ts
export interface CampaignRow extends CommonMetaRow {
  userId: number;
  name: string;
  description: string | null;
  status: Status;
  startDate: Date | string | null;
  endDate: Date | string | null;
}

export interface CampaignMemberRow extends CommonMetaRow {
  userId: number;
  campaignId: number;
  role: CampaignRole;
}
```

### DTO

```ts
export interface CampaignQueryDto extends CommonQueryDto {
  userId?: number;
  name?: string;
  status?: Status;
}

export interface CampaignCreateDto {
  name: string;
  description?: string | null;
  status?: Status;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
}

export interface CampaignUpdateDto extends CommonInDto {
  name?: string;
  description?: string | null;
  status?: Status;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  useYn?: UseYn;
  deleteYn?: UseYn;
}

export interface CampaignOutDto extends CommonOutDto {
  userId?: number;
  name?: string;
  description?: string | null;
  status?: Status;
  startDate?: Date | string | null;
  endDate?: Date | string | null;

  user?: UserOutDto;
  members?: CampaignMemberOutDto[];
  sessions?: SessionOutDto[];
  characters?: CharacterOutDto[];
}

export interface CampaignMemberCreateDto {}

export interface CampaignMemberOutDto extends CommonOutDto {
  userId?: number;
  campaignId?: number;
  role?: CampaignRole;

  user?: UserOutDto;
  campaign?: CampaignOutDto;
}
```

## Characters

### DB Interface

```ts
export interface CharacterRow extends CommonMetaRow {
  userId: number;
  campaignId: number | null;
  name: string;
  status: CharacterStatus;
  race: string;
  startLevel: number;
  startExp: number;
  str: number | null;
  dex: number | null;
  con: number | null;
  int: number | null;
  wis: number | null;
  cha: number | null;
  ac: number | null;
  hp: number | null;
  speed: string | null;
  vision: string | null;
  skills: string | null;
  advantage: string | null;
  disadvantage: string | null;
  resistance: string | null;
  immunity: string | null;
  mainHand: string | null;
  offHand: string | null;
  armor: string | null;
  head: string | null;
  gauntlet: string | null;
  boots: string | null;
  belt: string | null;
  cloak: string | null;
  accessory1: string | null;
  accessory2: string | null;
  accessory3: string | null;
  accessory4: string | null;
  reqStrDex8: string | null;
  reqStrDex10: string | null;
  reqStrDex12: string | null;
  reqStrDex14: string | null;
  reqStr16: string | null;
  reqStr18: string | null;
  reqStr20: string | null;
  reqCon8: string | null;
  reqCon10: string | null;
  reqCon12: string | null;
  reqCon14: string | null;
  reqCon16: string | null;
  reqCon18: string | null;
  reqCon20: string | null;
}

export interface CharacterClassRow {
  characterId: number;
  className: string;
  level: number;
}
```

### DTO

```ts
export interface CharacterQueryDto extends CommonQueryDto {
  userId?: number;
  campaignId?: number;
  name?: string;
  status?: CharacterStatus;
  race?: string;
  currentLevel?: number;
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
  ac?: number;
  hp?: number;
  speed?: string;
  vision?: string;
  skills?: string;
  advantage?: string;
  disadvantage?: string;
  resistance?: string;
  immunity?: string;
}

export interface CharacterCreateDto {
  name: string;
  race: string;
  campaignId?: number;
  status?: CharacterStatus;
  startLevel?: number;
  startExp?: number;
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
  ac?: number;
  hp?: number;
  speed?: string;
  vision?: string;
  skills?: string;
  advantage?: string;
  disadvantage?: string;
  resistance?: string;
  immunity?: string;
  startCurrencyCp?: number;
  startCurrencySp?: number;
  startCurrencyEp?: number;
  startCurrencyGp?: number;
  startCurrencyPp?: number;
  mainHand?: string;
  offHand?: string;
  armor?: string;
  head?: string;
  gauntlet?: string;
  boots?: string;
  belt?: string;
  cloak?: string;
  accessory1?: string;
  accessory2?: string;
  accessory3?: string;
  accessory4?: string;
  reqStrDex8?: string;
  reqStrDex10?: string;
  reqStrDex12?: string;
  reqStrDex14?: string;
  reqStr16?: string;
  reqStr18?: string;
  reqStr20?: string;
  reqCon8?: string;
  reqCon10?: string;
  reqCon12?: string;
  reqCon14?: string;
  reqCon16?: string;
  reqCon18?: string;
  reqCon20?: string;
}

export interface CharacterUpdateDto extends CommonInDto {
  name?: string;
  campaignId?: number | null;
  status?: CharacterStatus;
  race?: string;
  startLevel?: number;
  startExp?: number;
  str?: number | null;
  dex?: number | null;
  con?: number | null;
  int?: number | null;
  wis?: number | null;
  cha?: number | null;
  ac?: number | null;
  hp?: number | null;
  speed?: string | null;
  vision?: string | null;
  skills?: string | null;
  advantage?: string | null;
  disadvantage?: string | null;
  resistance?: string | null;
  immunity?: string | null;
  mainHand?: string | null;
  offHand?: string | null;
  armor?: string | null;
  head?: string | null;
  gauntlet?: string | null;
  boots?: string | null;
  belt?: string | null;
  cloak?: string | null;
  accessory1?: string | null;
  accessory2?: string | null;
  accessory3?: string | null;
  accessory4?: string | null;
  reqStrDex8?: string | null;
  reqStrDex10?: string | null;
  reqStrDex12?: string | null;
  reqStrDex14?: string | null;
  reqStr16?: string | null;
  reqStr18?: string | null;
  reqStr20?: string | null;
  reqCon8?: string | null;
  reqCon10?: string | null;
  reqCon12?: string | null;
  reqCon14?: string | null;
  reqCon16?: string | null;
  reqCon18?: string | null;
  reqCon20?: string | null;
  useYn?: UseYn;
  deleteYn?: UseYn;
}

export interface CharacterOutDto extends CommonOutDto {
  userId?: number;
  campaignId?: number | null;
  name?: string;
  status?: CharacterStatus;
  race?: string;
  startLevel?: number;
  startExp?: number;
  currentLevel?: number;
  currentExp?: number;
  currentCurrencyGp?: number;
  currentCurrencyCp?: number | null;
  currentCurrencySp?: number | null;
  currentCurrencyEp?: number | null;
  currentCurrencyPp?: number | null;
  str?: number | null;
  dex?: number | null;
  con?: number | null;
  int?: number | null;
  wis?: number | null;
  cha?: number | null;
  ac?: number | null;
  hp?: number | null;
  speed?: string | null;
  vision?: string | null;
  skills?: string | null;
  advantage?: string | null;
  disadvantage?: string | null;
  resistance?: string | null;
  immunity?: string | null;
  mainHand?: string | null;
  offHand?: string | null;
  armor?: string | null;
  head?: string | null;
  gauntlet?: string | null;
  boots?: string | null;
  belt?: string | null;
  cloak?: string | null;
  accessory1?: string | null;
  accessory2?: string | null;
  accessory3?: string | null;
  accessory4?: string | null;
  reqStrDex8?: string | null;
  reqStrDex10?: string | null;
  reqStrDex12?: string | null;
  reqStrDex14?: string | null;
  reqStr16?: string | null;
  reqStr18?: string | null;
  reqStr20?: string | null;
  reqCon8?: string | null;
  reqCon10?: string | null;
  reqCon12?: string | null;
  reqCon14?: string | null;
  reqCon16?: string | null;
  reqCon18?: string | null;
  reqCon20?: string | null;

  user?: UserOutDto;
  campaign?: CampaignOutDto;
  classes?: CharacterClassOutDto[];
  sessions?: SessionPlayerOutDto[];
}

export interface CharacterClassQueryDto {
  characterId?: number;
  className?: string;
  level?: number;
}

export interface CharacterClassCreateDto {
  className: string;
  level?: number;
}

export interface CharacterClassUpdateDto {
  level?: number;
}

export interface CharacterClassOutDto {
  characterId?: number;
  className?: string;
  level?: number;

  character?: CharacterOutDto;
}
```

### Notes

- `CharacterCreateDto` 의 `startCurrency*` 필드는 DB 컬럼이 아니라 초기 `currency_transactions` 생성용 입력값이다.
- `CharacterOutDto` 의 `currentLevel`, `currentExp`, `currentCurrency*` 필드는 DB raw column 이 아니라 계산/집계 결과다.

## Currency Transactions

### DB Interface

```ts
export interface CurrencyTransactionRow extends CommonMetaRow {
  userId: number;
  characterId: number;
  transactionType: TransactionType;
  description: string;
  deltaPp: number;
  deltaGp: number;
  deltaEp: number;
  deltaSp: number;
  deltaCp: number;
}
```

### DTO

```ts
export interface CurrencyTransactionQueryDto extends CommonQueryDto {
  userId?: number;
  characterId?: number;
  transactionType?: TransactionType;
  description?: string;
}

export interface CurrencyTransactionCreateDto {
  characterId: number;
  transactionType?: TransactionType;
  description: string;
  deltaPp?: number;
  deltaGp?: number;
  deltaEp?: number;
  deltaSp?: number;
  deltaCp?: number;
}

export interface CurrencyTransactionUpdateDto extends CommonInDto {
  transactionType?: TransactionType;
  description?: string;
  deltaPp?: number;
  deltaGp?: number;
  deltaEp?: number;
  deltaSp?: number;
  deltaCp?: number;
}

export interface CurrencyTransactionOutDto extends CommonOutDto {
  userId: number;
  characterId: number;
  transactionType: TransactionType;
  description: string;
  deltaPp: number;
  deltaGp: number;
  deltaEp: number;
  deltaSp: number;
  deltaCp: number;

  user?: UserOutDto;
  character?: CharacterOutDto;
}
```

## Sessions

### DB Interface

```ts
export interface SessionRow extends CommonMetaRow {
  campaignId: number;
  no: number;
  name: string;
  description: string | null;
  maxPlayer: number | null;
  rewardExp: number | null;
  rewardGold: number | null;
  status: Status | null;
  playDate: Date | string | null;
}

export interface SessionPlayerRow extends CommonMetaRow {
  sessionId: number;
  userId: number;
  characterId: number;
  role: SessionRole;
}

export interface SessionLogRow extends CommonMetaRow {
  sessionId: number;
  userId: number;
  title: string;
  content: string | null;
  fileUrl: string | null;
}
```

### DTO

```ts
export interface SessionQueryDto extends CommonQueryDto {
  campaignId?: number;
  no?: number;
  name?: string;
  status?: Status | null;
}

export interface SessionCreateDto {
  campaignId: number;
  no: number;
  name: string;
  description?: string | null;
  maxPlayer?: number | null;
  rewardExp?: number | null;
  rewardGold?: number | null;
  status?: Status | null;
  playDate?: Date | string | null;
}

export interface SessionUpdateDto extends CommonInDto {
  no?: number;
  name?: string;
  description?: string | null;
  maxPlayer?: number | null;
  rewardExp?: number | null;
  rewardGold?: number | null;
  status?: Status | null;
  playDate?: Date | string | null;
}

export interface SessionOutDto extends CommonOutDto {
  campaignId?: number;
  no?: number;
  name?: string;
  description?: string | null;
  maxPlayer?: number | null;
  rewardExp?: number | null;
  rewardGold?: number | null;
  status?: Status | null;
  playDate?: Date | string | null;

  campaign?: CampaignOutDto;
  players?: SessionPlayerOutDto[];
  logs?: SessionLogOutDto[];
}

export interface SessionPlayerCreateDto {
  characterId: number;
}

export interface SessionPlayerOutDto extends CommonOutDto {
  sessionId?: number;
  userId?: number;
  characterId?: number;
  role?: SessionRole;

  session?: SessionOutDto;
  user?: UserOutDto;
  character?: CharacterOutDto;
}
```

### Session Logs DTO

```ts
export interface SessionLogQueryDto extends CommonQueryDto {
  sessionId?: number;
  userId?: number;
  title?: string;
}

export interface SessionLogCreateDto {
  sessionId: number;
  title: string;
  content?: string | null;
  fileUrl?: string | null;
}

export interface SessionLogUpdateDto extends CommonInDto {
  title?: string;
  content?: string | null;
  fileUrl?: string | null;
}

export interface SessionLogOutDto extends CommonOutDto {
  sessionId?: number;
  userId?: number;
  title?: string;
  content?: string | null;
  fileUrl?: string | null;

  session?: SessionOutDto;
  user?: UserOutDto;
}
```

## Docs

### DB Interface

```ts
export interface DocRow extends CommonMetaRow {
  userId: number;
  title: string;
  description: string | null;
  category: string;
  status: DocStatus;
  visibility: DocVisibility;
  content: string | null;
}
```

### DTO

```ts
// docs 는 아직 dto.ts 로 분리되지 않았고 dto.types.ts 에 남아 있다.
export interface DocInDto extends CommonInDto {
  userId?: number;
  title?: string;
  description?: string | null;
  category?: string;
  status?: DocStatus;
  visibility?: DocVisibility;
  content?: string | null;
}

export interface DocOutDto extends CommonOutDto {
  userId?: number;
  title?: string;
  description?: string | null;
  category?: string;
  status?: DocStatus;
  visibility?: DocVisibility;
  content?: string | null;

  user?: UserOutDto;
}
```

### Notes

- `docs` 는 아직 `QueryDto`, `CreateDto`, `UpdateDto` 로 분리되지 않았다.
- 현재는 `DocInDto` 하나로 입력을 처리하는 상태다.

## Log Histories

### DB Interface

```ts
export interface LogHistoryRow extends CommonMetaRow {
  userId: number;
  tableName: string;
  targetId: number;
  actionType: string;
  oldData: any;
  newData: any;
  description: string | null;
}
```

### DTO

```ts
export interface LogHistoryQueryDto extends CommonQueryDto {
  userId?: number;
  tableName?: string;
  targetId?: number;
  actionType?: LogActionType;
  description?: string;
}

export interface LogHistoryCreateDto {
  userId: number;
  tableName: string;
  targetId: number;
  actionType: LogActionType;
  oldData?: any;
  newData?: any;
  description?: string | null;
}

export interface LogHistoryUpdateDto extends CommonInDto {
  tableName?: string;
  targetId?: number;
  actionType?: LogActionType;
  oldData?: any;
  newData?: any;
  description?: string | null;
}

export interface LogHistoryOutDto extends CommonOutDto {
  userId?: number;
  tableName?: string;
  targetId?: number;
  actionType?: LogActionType;
  oldData?: any;
  newData?: any;
  description?: string | null;

  user?: UserOutDto;
}
```

### Notes

- DB 의 `actionType` 은 현재 `varchar(20)` 이고 enum 컬럼은 아니다.
- DTO 는 `LogActionType` 유니온으로 제한하고 있다.

## Quick Mapping

| Table | DB Interface | DTO |
| --- | --- | --- |
| `users` | `UserRow` | `UserQueryDto`, `UserCreateDto`, `UserUpdateDto`, `UserOutDto` |
| `campaigns` | `CampaignRow` | `CampaignQueryDto`, `CampaignCreateDto`, `CampaignUpdateDto`, `CampaignOutDto` |
| `campaign_members` | `CampaignMemberRow` | `CampaignMemberCreateDto`, `CampaignMemberOutDto` |
| `characters` | `CharacterRow` | `CharacterQueryDto`, `CharacterCreateDto`, `CharacterUpdateDto`, `CharacterOutDto` |
| `character_classes` | `CharacterClassRow` | `CharacterClassQueryDto`, `CharacterClassCreateDto`, `CharacterClassUpdateDto`, `CharacterClassOutDto` |
| `currency_transactions` | `CurrencyTransactionRow` | `CurrencyTransactionQueryDto`, `CurrencyTransactionCreateDto`, `CurrencyTransactionUpdateDto`, `CurrencyTransactionOutDto` |
| `sessions` | `SessionRow` | `SessionQueryDto`, `SessionCreateDto`, `SessionUpdateDto`, `SessionOutDto` |
| `session_players` | `SessionPlayerRow` | `SessionPlayerCreateDto`, `SessionPlayerOutDto` |
| `session_logs` | `SessionLogRow` | `SessionLogQueryDto`, `SessionLogCreateDto`, `SessionLogUpdateDto`, `SessionLogOutDto` |
| `docs` | `DocRow` | `DocInDto`, `DocOutDto` |
| `log_histories` | `LogHistoryRow` | `LogHistoryQueryDto`, `LogHistoryCreateDto`, `LogHistoryUpdateDto`, `LogHistoryOutDto` |
