# DTO 마이그레이션 작업 지침

## 1. 현재 상태 요약

DTO 분리 작업은 사실상 마무리 단계다.
현재 서버는 대부분 `QueryDto / CreateDto / UpdateDto / OutDto` 구조를 사용하고 있고,
남은 예외는 `docs` 계열뿐이다.

## 2. 현재 기준 명칭

예전 문서의 `User*Dto`, `users.table.ts`, `/api/users` 기준은 더 이상 유효하지 않다.
현재 기준은 아래와 같다.

- 플레이어: `Player*Dto`, `players.table.ts`, `/api/players`
- 캠페인: `Campaign*Dto`
- 캐릭터: `Character*Dto`
- 세션: `Session*Dto`, `SessionPlayer*Dto`, `SessionLog*Dto`
- 재화: `CurrencyTransaction*Dto`
- 감사로그: `LogHistory*Dto`

## 3. 분리 완료 도메인

완료된 DTO 파일:

- [common.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/common.dto.ts)
- [player.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/player.dto.ts)
- [campaign.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/campaign.dto.ts)
- [character.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/character.dto.ts)
- [session.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/session.dto.ts)
- [session-log.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/session-log.dto.ts)
- [currency-transaction.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/currency-transaction.dto.ts)
- [log-history.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/log-history.dto.ts)

배럴 파일:

- [dto.types.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto.types.ts)

## 4. 예외로 남아 있는 범위

현재 `dto.types.ts` 본문에 직접 남아 있는 것은 `docs`뿐이다.

- `DocInDto`
- `DocOutDto`

즉, 새 문서를 쓰거나 새 API를 붙일 때는 `docs`를 제외하면 `InDto` 패턴을 새로 확장하지 않는 편이 맞다.

## 5. 현재 작업 원칙

### 유지할 것

- `QueryDto`: GET query 전용
- `CreateDto`: POST body 전용
- `UpdateDto`: PUT body 전용
- `OutDto`: 응답 전용

### 피할 것

- 조회 query와 body 타입을 하나의 `InDto`로 합치는 것
- `...body`를 그대로 insert/update에 넣는 패턴
- `users` 기준 구 명칭 재도입

## 6. 도메인별 메모

### Players

- 기준 파일: [player.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/player.dto.ts)
- 상태: 완료
- 특징:
  - `PlayerStatus`가 추가되어 있음
  - `GET /api/players`, `GET /api/players/me` 등 현재 API와 일치

### Campaigns

- 기준 파일: [campaign.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/campaign.dto.ts)
- 상태: 완료
- 특징:
  - 캠페인 멤버 생성은 path 파라미터 기반이라 `CampaignMemberCreateDto`가 비어 있음

### Characters

- 기준 파일: [character.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/character.dto.ts)
- 상태: 완료
- 특징:
  - 초기 자금 입력은 `CharacterCreateDto`에만 존재
  - 현재 화폐/현재 레벨은 계산값

### Sessions / Session Logs

- 기준 파일:
  - [session.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/session.dto.ts)
  - [session-log.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/session-log.dto.ts)
- 상태: 완료
- 특징:
  - `SessionPlayerCreateDto`는 `characterId`만 받음
  - 세션 로그는 세션 범위 path를 전제로 동작

### Currency Transactions

- 기준 파일: [currency-transaction.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/currency-transaction.dto.ts)
- 상태: 완료
- 특징:
  - `INIT` 거래는 캐릭터당 1건만 허용

### Log Histories

- 기준 파일: [log-history.dto.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/dto/log-history.dto.ts)
- 상태: 완료
- 특징:
  - 관리자 전용 API와 함께 사용

## 7. 남은 후속 작업

우선순위는 아래가 맞다.

1. `docs` DTO를 `docs.dto.ts`로 분리할지 결정
2. 실제 `docs` API 구현이 필요하면 `Query/Create/Update/Out` 구조로 정리
3. 이후 `dto.types.ts` 본문에는 배럴 외 선언이 없도록 정리

## 8. 연동 전에 확인할 항목

- 프런트에서 쓰는 응답 타입은 DTO 단독이 아니라 `BaseResponseType<T>` 기준으로 확인
- 목록 데이터는 `ListDataType<T>`까지 같이 처리
- 자동임포트 환경이라 타입 import 규칙을 기존 프로젝트 규칙과 맞춰야 함
