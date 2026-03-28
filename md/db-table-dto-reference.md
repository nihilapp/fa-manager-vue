# DB Table / DTO Reference

현재 기준의 DB 테이블 명칭과 DTO 명칭을 같이 맞춰 보는 참조 문서다.
프런트 연동, API 바디 설계, 타입 맵핑 확인 용도로 사용한다.

## 1. 기준 소스

- DB Table: `src/server/db/table`
- DTO: `src/server/types/dto`
- 예외:
  - `DocInDto`, `DocOutDto`는 아직 [dto.types.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto.types.ts)에 남아 있다.

## 2. 공통 타입

기준 구현: [common.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/common.dto.ts)

```ts
type PlayerRole = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN';
type PlayerStatus = 'ACTIVE' | 'INACTIVE' | 'REST';
type CampaignRole = 'PLAYER' | 'MASTER' | 'SUB_MASTER';
type SessionRole = 'PLAYER' | 'MASTER';
type Status = 'PREPARING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'ON_HOLD';
type CharacterStatus = 'ACTIVE' | 'RESTING' | 'RETIRED' | 'DECEASED';
type TransactionType = 'REWARD' | 'INCOME' | 'EXPENSE' | 'EXCHANGE' | 'INIT';
type LogActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE';
```

공통 메타 DTO:

- `CommonQueryDto`
- `CommonInDto`
- `CommonOutDto`

## 3. Players

기준 파일:

- [players.table.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/db/table/players.table.ts)
- [player.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/player.dto.ts)

주요 필드:

- DB
  - `discordId`
  - `name`
  - `role`
  - `status`
- DTO
  - `PlayerQueryDto`
  - `PlayerCreateDto`
  - `PlayerUpdateDto`
  - `PlayerOutDto`

연관 관계:

- `campaigns`
- `campaignMembers`
- `characters`
- `sessionPlayers`
- `sessionLogs`
- `docs`
- `logHistories`

## 4. Campaigns

기준 파일:

- [campaigns.table.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/db/table/campaigns.table.ts)
- [campaign.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/campaign.dto.ts)

주요 테이블:

- `campaigns`
  - `userId`
  - `name`
  - `description`
  - `status`
  - `startDate`
  - `endDate`
- `campaign_members`
  - `userId`
  - `campaignId`
  - `role`

주요 DTO:

- `CampaignQueryDto`
- `CampaignCreateDto`
- `CampaignUpdateDto`
- `CampaignOutDto`
- `CampaignMemberCreateDto`
- `CampaignMemberOutDto`

## 5. Characters

기준 파일:

- [characters.table.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/db/table/characters.table.ts)
- [character.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/character.dto.ts)

주요 테이블:

- `characters`
  - `userId`
  - `campaignId`
  - `name`
  - `status`
  - `race`
  - `startLevel`
  - `startExp`
  - 능력치/장비/요구능력치 계열 필드
- `character_classes`
  - `characterId`
  - `className`
  - `level`

주요 DTO:

- `CharacterQueryDto`
- `CharacterCreateDto`
- `CharacterUpdateDto`
- `CharacterOutDto`
- `CharacterClassQueryDto`
- `CharacterClassCreateDto`
- `CharacterClassUpdateDto`
- `CharacterClassOutDto`

주의:

- `CharacterCreateDto`의 `startCurrency*`는 DB 컬럼이 아니라 초기 자금 입력값이다.
- 현재 화폐(`currentCurrency*`)와 현재 레벨/경험치(`currentLevel`, `currentExp`)는 계산 결과다.

## 6. Sessions

기준 파일:

- [sessions.table.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/db/table/sessions.table.ts)
- [session.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/session.dto.ts)
- [session-log.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/session-log.dto.ts)

주요 테이블:

- `sessions`
  - `campaignId`
  - `no`
  - `name`
  - `description`
  - `maxPlayer`
  - `rewardExp`
  - `rewardGold`
  - `status`
  - `playDate`
- `session_players`
  - `sessionId`
  - `userId`
  - `characterId`
  - `role`
- `session_logs`
  - `sessionId`
  - `userId`
  - `title`
  - `content`
  - `fileUrl`

주요 DTO:

- `SessionQueryDto`
- `SessionCreateDto`
- `SessionUpdateDto`
- `SessionOutDto`
- `SessionPlayerCreateDto`
- `SessionPlayerOutDto`
- `SessionLogQueryDto`
- `SessionLogCreateDto`
- `SessionLogUpdateDto`
- `SessionLogOutDto`

## 7. Currency Transactions

기준 파일:

- [currency-transactions.table.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/db/table/currency-transactions.table.ts)
- [currency-transaction.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/currency-transaction.dto.ts)

주요 필드:

- `userId`
- `characterId`
- `transactionType`
- `description`
- `deltaPp`
- `deltaGp`
- `deltaEp`
- `deltaSp`
- `deltaCp`

DTO:

- `CurrencyTransactionQueryDto`
- `CurrencyTransactionCreateDto`
- `CurrencyTransactionUpdateDto`
- `CurrencyTransactionOutDto`

## 8. Log Histories

기준 파일:

- [logHistories.table.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/db/table/logHistories.table.ts)
- [log-history.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/log-history.dto.ts)

주요 필드:

- `userId`
- `tableName`
- `targetId`
- `actionType`
- `oldData`
- `newData`
- `description`

DTO:

- `LogHistoryQueryDto`
- `LogHistoryCreateDto`
- `LogHistoryUpdateDto`
- `LogHistoryOutDto`

## 9. Docs

기준 파일:

- [docs.table.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/db/table/docs.table.ts)
- [dto.types.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto.types.ts)

현재 상태:

- DB 테이블은 `docs`로 존재한다.
- DTO는 아직 `docs.dto.ts`로 분리되지 않았다.
- 현재 남아 있는 타입:
  - `DocInDto`
  - `DocOutDto`

## 10. 빠른 매핑

| 영역 | 테이블 | DTO |
| --- | --- | --- |
| Players | `players` | `PlayerQueryDto`, `PlayerCreateDto`, `PlayerUpdateDto`, `PlayerOutDto` |
| Campaigns | `campaigns`, `campaign_members` | `CampaignQueryDto`, `CampaignCreateDto`, `CampaignUpdateDto`, `CampaignOutDto`, `CampaignMemberCreateDto`, `CampaignMemberOutDto` |
| Characters | `characters`, `character_classes` | `CharacterQueryDto`, `CharacterCreateDto`, `CharacterUpdateDto`, `CharacterOutDto`, `CharacterClass*Dto` |
| Sessions | `sessions`, `session_players`, `session_logs` | `Session*Dto`, `SessionPlayer*Dto`, `SessionLog*Dto` |
| Currency | `currency_transactions` | `CurrencyTransaction*Dto` |
| Docs | `docs` | `DocInDto`, `DocOutDto` |
| Logs | `log_histories` | `LogHistory*Dto` |

## 11. 연동 시 체크포인트

- API 응답 타입은 DTO 하나만 보지 말고 `BaseResponseType<T>`를 함께 봐야 한다.
- 목록 API는 대부분 `ListDataType<T>`를 감싼다.
- 플레이어 도메인은 더 이상 `User*Dto`, `usersTable`을 기준으로 보면 안 된다.
