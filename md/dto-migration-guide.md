# DTO 마이그레이션 작업 지침

## 1. 목적

기존 `src/server/types/dto.types.ts` 의 `*InDto` 는 조회, 생성, 수정 요청에 동시에 사용되고 있었다.
이 구조는 아래 문제를 만들었다.

- 생성 시 어떤 필드가 필수인지 타입만 보고 알기 어렵다.
- 조회 전용 필드(`page`, `size`, `sort`, `idList`)가 생성/수정 body 타입에 섞여 있다.
- 일부 API는 `...body` 를 그대로 insert/update 에 사용해 의도하지 않은 필드 유입 위험이 있다.

목표는 각 도메인별 DTO 를 아래처럼 분리하는 것이다.

- `QueryDto`: GET 쿼리 전용
- `CreateDto`: POST body 전용
- `UpdateDto`: PUT body 전용
- `OutDto`: 응답 전용

---

## 2. 기준 문서

필수/선택/기본값 기준은 루트의 [schema-required-fields.md](/C:/Users/nihil/coding/app/fa-manager/schema-required-fields.md) 를 따른다.

분류 기준:

- 입력 필수값: `notNull()` 이고 기본값이 없어 insert 시 직접 제공해야 하는 값
- 자동/기본값: identity, `default(...)`, `defaultNow()`, `$onUpdate(...)`
- 선택값: nullable 컬럼

주의:

- `character_classes` 는 공통 메타 필드를 사용하지 않는다.
- `sessions.status` 는 기본값이 있지만 nullable 이다.

---

## 3. 현재까지 완료된 작업

### 3.1 users 전환 완료

파일:

- [users.table.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/db/table/users.table.ts)
- [index.get.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/users/index.get.ts)
- [index.post.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/users/index.post.ts)
- [[id].put.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/users/%5Bid%5D.put.ts)

적용 내용:

- `users.discord_id` 를 `unique().notNull()` 로 정리했다.
- `UserQueryDto`, `UserCreateDto`, `UserUpdateDto` 를 도입했다.
- `GET/POST/PUT` 가 모두 새 DTO 를 사용한다.
- `discordId` 는 생성 body 필수값이다.
- `UserInDto` 는 제거되었다.

추가 메시지:

- [response-message.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/constant/response-message.ts)
- `DISCORD_ID_ALREADY_EXISTS`

### 3.2 characters 전환 완료

파일:

- [characters.table.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/db/table/characters.table.ts)
- [index.get.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/characters/index.get.ts)
- [index.post.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/characters/index.post.ts)
- [[id].get.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/characters/%5Bid%5D.get.ts)
- [[id].put.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/characters/%5Bid%5D.put.ts)

적용 내용:

- `CharacterQueryDto`, `CharacterCreateDto`, `CharacterUpdateDto` 를 도입했다.
- `GET/POST/PUT` 가 모두 새 DTO 를 사용한다.
- `CharacterInDto` 는 제거되었다.
- `...body` 직접 사용을 제거하고 명시 매핑으로 바꿨다.
- `characters.startCurrency*` 컬럼을 제거했다.
- 생성 시 시작 자금은 `CharacterCreateDto` 에서만 받고, DB row 가 아니라 `currency_transactions` 의 `INIT` 거래로 적재한다.
- 조회 시 현재 화폐는 `currency_transactions` 누적합 기준으로 계산한다.
- `CharacterOutDto` 는 `currentLevel`, `currentExp`, `currentCurrency*` 계산 필드를 유지한다.

정책:

- `CharacterCreateDto` 에는 시작 자금 필드가 존재한다.
- `CharacterUpdateDto` 에는 시작 자금 필드가 없다.
- 실제 원천 데이터는 `characters` 테이블이 아니라 `currency_transactions` 다.

### 3.3 character_classes 전환 완료

파일:

- [index.post.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/characters/%5Bid%5D/classes/index.post.ts)
- [[className].put.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/characters/%5Bid%5D/classes/%5BclassName%5D.put.ts)
- [[className].delete.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/characters/%5Bid%5D/classes/%5BclassName%5D.delete.ts)

적용 내용:

- `CharacterClassQueryDto`, `CharacterClassCreateDto`, `CharacterClassUpdateDto` 를 도입했다.
- 생성은 `CharacterClassCreateDto`, 수정은 `CharacterClassUpdateDto` 를 사용한다.
- `CharacterClassInDto` 는 제거되었다.

주의:

- `character_classes` 는 공통 메타 컬럼이 없다.
- `className` 은 생성 필수값이다.
- 수정은 `level` 만 허용한다.

### 3.4 currency-transactions 전환 완료

파일:

- [currency-transactions.table.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/db/table/currency-transactions.table.ts)
- [index.get.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/currency-transactions/index.get.ts)
- [index.post.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/currency-transactions/index.post.ts)
- [[id].get.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/currency-transactions/%5Bid%5D.get.ts)
- [[id].put.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/currency-transactions/%5Bid%5D.put.ts)
- [[id].delete.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/currency-transactions/%5Bid%5D.delete.ts)

적용 내용:

- `CurrencyTransactionQueryDto`, `CurrencyTransactionCreateDto`, `CurrencyTransactionUpdateDto`, `CurrencyTransactionOutDto` 를 도입했다.
- `GET/POST/PUT` 가 모두 새 DTO 를 사용한다.
- 원장 구조는 `deltaPp/Gp/Ep/Sp/Cp` 누적합 기준이다.
- `INIT` 거래는 캐릭터 초기 자금 역할을 담당한다.
- 캐릭터당 `INIT` 거래는 1건만 허용한다.

### 3.5 consume-histories 제거 완료

파일:

- [relations.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/db/table/relations.ts)
- [drizzle.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/utils/drizzle.ts)

적용 내용:

- `src/server/api/consume-histories` API 를 삭제했다.
- `consume-histories.table.ts` 를 삭제했다.
- `relations.ts` 의 관련 매핑을 제거했다.
- `drizzle.ts` 의 schema 등록에서 제거했다.
- `ConsumeHistory*Dto`, `CurrencyDto` 를 제거했다.
- 캐릭터 DTO 와 캐릭터 조회 로직에서 `consumeHistories` 참조를 제거했다.

### 3.6 dto.types.ts 파일 구조 개선

파일:

- [dto.types.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto.types.ts)
- [common.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/common.dto.ts)
- [campaign.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/campaign.dto.ts)
- [session.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/session.dto.ts)
- [session-log.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/session-log.dto.ts)
- [user.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/user.dto.ts)
- [character.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/character.dto.ts)
- [currency-transaction.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/currency-transaction.dto.ts)
- [log-history.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/log-history.dto.ts)

적용 내용:

- `dto.types.ts` 는 배럴 파일로 전환했다.
- 현재까지 마이그레이션이 끝난 범위만 엔티티별 파일로 분리했다.
- 분리 완료 범위:
  - `common`
  - `campaigns`
  - `sessions`
- `session_logs`
- `users`
- `characters`
- `character_classes`
- `currency-transactions`
- `log-histories`
- 미전환 도메인(`docs`)은 아직 `dto.types.ts` 본문에 남아 있다.

### 3.7 campaigns 전환 완료

파일:

- [campaign.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/campaign.dto.ts)
- [index.get.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/campaigns/index.get.ts)
- [index.post.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/campaigns/index.post.ts)
- [[id].put.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/campaigns/%5Bid%5D.put.ts)
- [manual-server-imports.d.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/manual-server-imports.d.ts)

적용 내용:

- `CampaignQueryDto`, `CampaignCreateDto`, `CampaignUpdateDto` 를 도입했다.
- `GET/POST/PUT` 가 모두 새 DTO 를 사용한다.
- `CampaignInDto` 는 제거되었다.
- 캠페인 멤버 참여는 관리자 추가가 아니라 본인 참여 기준으로 정리했다.
- 캠페인 멤버 참여 API 는 `CampaignMemberCreateDto` 를 사용하고 중복 참여는 멱등 처리한다.
- 캠페인 멤버 이탈도 본인 이탈 기준으로 정리했고, 캠페인 생성자는 이탈할 수 없다.
- 생성 body 에서 `userId` 는 받지 않고 인증 사용자 `user.id` 를 서버에서 주입한다.
- `CampaignCreateDto` 필수값은 `name` 으로 확정했고, `startDate` 는 선택값이다.
- `campaigns` DTO 를 `campaign.dto.ts` 로 분리하고 `dto.types.ts` 는 배럴로 유지했다.

### 3.8 sessions / session_players 전환 완료

파일:

- [sessions.table.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/db/table/sessions.table.ts)
- [session.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/session.dto.ts)
- [index.get.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/sessions/index.get.ts)
- [index.post.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/sessions/index.post.ts)
- [[id].put.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/sessions/%5Bid%5D.put.ts)
- [index.post.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/sessions/%5Bid%5D/players/index.post.ts)
- [[userId].delete.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/sessions/%5Bid%5D/players/%5BuserId%5D.delete.ts)
- [manual-server-imports.d.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/manual-server-imports.d.ts)

적용 내용:

- `SessionQueryDto`, `SessionCreateDto`, `SessionUpdateDto` 를 도입했다.
- `SessionPlayerCreateDto` 를 도입했다.
- `GET/POST/PUT` 가 모두 새 세션 DTO 를 사용한다.
- `SessionInDto`, `SessionPlayerInDto` 는 제거되었다.
- `POST /sessions`, `PUT /sessions/:id` 의 `...body` 직접 사용을 제거하고 명시 매핑으로 바꿨다.
- `SessionCreateDto` 필수값은 `campaignId`, `no`, `name` 로 확정했다.
- `sessions.status` 는 nullable 기본값 정책을 유지한다.
- 세션 플레이어 참여는 관리자 추가가 아니라 본인 참여 기준으로 정리했다.
- 세션 플레이어 참여 시 본인 소유 캐릭터만 허용하고, 세션의 캠페인과 캐릭터의 캠페인이 일치해야 한다.
- 세션 플레이어 참여는 `session_players(session_id, user_id)` 유니크 기준으로 멱등 처리한다.
- 세션 플레이어 이탈도 본인 이탈 기준으로 정리했다.
- `sessions` / `session_players` DTO 를 `session.dto.ts` 로 분리하고 `dto.types.ts` 는 배럴로 유지했다.

### 3.9 session_logs DTO 전환 완료

파일:

- [session-log.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/session-log.dto.ts)
- [index.get.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/sessions/%5Bid%5D/logs/index.get.ts)
- [index.post.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/sessions/%5Bid%5D/logs/index.post.ts)
- [[logId].get.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/sessions/%5Bid%5D/logs/%5BlogId%5D.get.ts)
- [[logId].put.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/sessions/%5Bid%5D/logs/%5BlogId%5D.put.ts)
- [[logId].delete.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/api/sessions/%5Bid%5D/logs/%5BlogId%5D.delete.ts)
- [dto.types.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto.types.ts)
- [manual-server-imports.d.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/manual-server-imports.d.ts)

적용 내용:

- `SessionLogQueryDto`, `SessionLogCreateDto`, `SessionLogUpdateDto`, `SessionLogOutDto` 를 도입했다.
- `SessionLogInDto` 는 제거되었다.
- `session_logs` DTO 를 `session-log.dto.ts` 로 분리하고 `dto.types.ts` 는 배럴로 유지했다.
- `GET all/one`, `POST`, `PUT`, `DELETE` API 를 추가했다.
- 생성은 세션 참여자 본인 또는 캠페인 마스터만 가능하다.
- 수정/삭제는 세션 로그 작성자 본인만 가능하다.
- 조회는 세션 범위 기준으로 제공한다.

### 3.10 log-histories DTO 전환 완료

파일:

- [log-history.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/log-history.dto.ts)
- [logHistories.table.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/db/table/logHistories.table.ts)
- [dto.types.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto.types.ts)
- [manual-server-imports.d.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/manual-server-imports.d.ts)

적용 내용:

- `LogHistoryQueryDto`, `LogHistoryCreateDto`, `LogHistoryUpdateDto`, `LogHistoryOutDto` 를 도입했다.
- `LogHistoryInDto` 는 제거되었다.
- `log_histories` DTO 를 `log-history.dto.ts` 로 분리하고 `dto.types.ts` 는 배럴로 유지했다.
- 스키마 기준 생성 필수값은 `userId`, `tableName`, `targetId`, `actionType` 으로 확정했다.
- `actionType` 은 `CREATE | UPDATE | DELETE | RESTORE` 로 고정했다.
- `oldData`, `newData` 는 `jsonb` 컬럼 기준 JSON 스냅샷으로 유지한다.
- `oldData`, `newData`, `description` 는 선택값으로 유지했다.
- `GET all/one`, `POST`, `PUT`, `DELETE` API 를 추가했다.
- 현재 API 권한은 감사 로그 성격에 맞춰 관리자 전용으로 제한했다.

---

## 4. 현재 DTO 분리 상태

### 4.1 분리 완료 도메인

- `users`
- `campaigns`
- `sessions`
- `session_players`
- `session_logs`
- `characters`
- `character_classes`
- `currency-transactions`
- `log-histories`

이 범위에서는 기존 `InDto` 사용이 제거되었다.

### 4.2 아직 남아 있는 `InDto`

- `CommonInDto`
- `DocInDto`

의미:

- 전환이 끝난 도메인만 `Query/Create/Update/Out` 구조를 사용하고 있다.
- 나머지 도메인은 아직 조회/생성/수정 경계가 완전히 분리되지 않았다.

---

## 5. 현재 남은 작업

### 5.1 docs

현재 상태:

- `docs` 는 아직 `Query/Create/Update` 분리가 안 되어 있다.
- 실제 API 구현 범위는 별도 확인이 필요하다.

---

## 6. 다음 작업 권장 순서

1. `docs` 의 실제 API 구현 범위를 다시 확인한다.
2. 구현이 존재하는 범위부터 `Query/Create/Update/Out` 구조로 분리한다.
3. 마지막으로 남은 `InDto` 제거 범위를 문서에 다시 반영한다.

---

## 7. 작업 원칙

1. 먼저 스키마 기준으로 필수/기본값/선택값을 확인한다.
2. 도메인별로 `Query/Create/Update/Out` 구조를 만든다.
3. `manual-server-imports.d.ts` 를 같이 수정한다.
4. GET API 는 `QueryDto` 로 바꾼다.
5. POST API 는 `CreateDto` 로 바꾸고 필수값 검증을 타입/로직 양쪽에 반영한다.
6. PUT API 는 `UpdateDto` 로 바꾸고 수정 금지 필드는 타입에서 제외한다.
7. `...body` 직접 사용은 제거하고 명시 매핑으로 바꾼다.
8. 중복 체크와 권한 체크는 기존 동작을 유지한다.
9. 원장성 데이터는 최소값만 저장하고, 파생값은 응답에서 계산한다.
10. 제거 대상 도메인은 병행 유지하지 않고 삭제한다.
11. DTO 파일 분리는 전환이 끝난 도메인부터 진행하고, [dto.types.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto.types.ts) 는 배럴 파일로 유지한다.

---

## 8. 유의사항

- 이번 작업에서도 빌드, 테스트, 마이그레이션 실행은 하지 않았다.
- 이 환경에서는 `node` 부재로 타입체크를 실행하지 못했다.
- `users.discord_id` 를 `notNull` 로 바꿨기 때문에 실제 DB 마이그레이션 시 기존 데이터 정합성 확인이 필요하다.
- `characters.startCurrency*` 제거에 맞춰 실제 DB 마이그레이션도 별도로 필요하다.
- `consume-histories` 제거에 맞춰 실제 DB 에서 `consume_histories` 테이블 drop 마이그레이션이 필요하다.
