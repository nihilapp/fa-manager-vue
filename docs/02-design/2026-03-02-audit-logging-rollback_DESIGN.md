# [Design] Admin-Only Audit Logging & Rollback System

- **ID**: 2026-03-02-audit-logging-rollback
- **Date**: 2026-03-02
- **Author**: Gemini CLI (bkit)
- **Status**: Designing
- **Related Plan**: `docs/01-plan/2026-03-02-audit-logging-rollback_PLAN.md`

## 1. Data Schema Design

### 1.1 Existing Table Modification (`users`)
- **Field**: `role`
- **Type**: `varchar(10)`
- **Values**: `'ADMIN'`, `'USER'` (Default: `'USER'`)
- **Reason**: RBAC 기반 접근 제어를 위해 사용자 역할 명시.

### 1.2 New Table (`audit_logs`)
- **ID**: `serial` (Primary Key)
- **TableName**: `varchar(100)` (e.g., 'campaigns', 'characters')
- **RecordId**: `integer` (타겟 레코드의 PK)
- **Action**: `varchar(20)` (e.g., 'INSERT', 'UPDATE', 'DELETE')
- **OldData**: `jsonb` (변경 전 레코드 전체 데이터, INSERT 시에는 NULL)
- **NewData**: `jsonb` (변경 후 레코드 전체 데이터, DELETE 시에는 NULL)
- **UserId**: `integer` (변경을 수행한 사용자의 ID)
- **CreatedDate**: `timestamp` (기본값: NOW)

## 2. Server Utilities Design

### 2.1 Authorization (`server/utils/auth.ts` 추가 제안)
- `getUserWithRole(event)`: `X-Discord-ID`로 유저 정보를 가져오고 `role`을 포함하여 반환.
- `isAdmin(user)`: 유저의 `role`이 `'ADMIN'`인지 확인.
- `ensureAdmin(event)`: 어드민이 아닐 경우 즉시 `403 Forbidden` 에러를 반환하는 미들웨어 함수.

### 2.2 Logging Utility (`server/utils/audit.ts` 추가 제안)
- `createAuditLog(tableName, recordId, action, oldData, newData, userId)`: 
    - `audit_logs` 테이블에 기록 생성.
    - 데이터 변경이 발생하는 모든 API 핸들러에서 호출.

## 3. API Design

### 3.1 Admin Only API Routes
- **GET `/api/admin/audit-logs`**:
    - 감사 로그 목록 조회 (최신순 정렬, 페이징 지원).
    - Response: `audit_logs` 레코드 배열.
- **GET `/api/admin/audit-logs/[id]`**:
    - 특정 로그의 상세 정보 (Before/After JSON 데이터) 확인.
- **POST `/api/admin/audit-logs/[id]/rollback`**:
    - 특정 로그 기반 데이터 롤백 수행.
    - Logic:
        1. 로그에서 `tableName`, `recordId`, `oldData` 추출.
        2. `action`이 `'DELETE'`였다면 `oldData`로 `INSERT` 수행.
        3. `action`이 `'UPDATE'`였다면 `oldData`로 `UPDATE` 수행.
        4. `action`이 `'INSERT'`였다면 해당 레코드 `DELETE` 수행. (필요 시 논리 삭제 처리)

## 4. Implementation Logic (Sequence)

1. **User Request**: 사용자가 데이터 수정을 요청.
2. **Current Data Snapshot**: 변경 전 레코드 상태 조회 (`oldData`).
3. **Execution**: 실제 데이터 변경 (`Update/Delete/Insert`) 수행.
4. **New Data Snapshot**: 변경 후 레코드 상태 조회 (`newData`).
5. **Audit Logging**: `createAuditLog`를 호출하여 비동기 또는 트랜잭션 내 기록.

## 5. Security Strategy
- 모든 어드민 API는 `ensureAdmin` 유틸리티를 거치도록 강제함.
- 클라이언트 측(Vue/Nuxt)에서도 유저 스토어의 `role`을 확인하여 어드민 메뉴 노출 여부 제어.

## 6. Constraints
- **Circular Rollback**: 롤백 자체도 데이터 변경이므로 롤백 수행 시에도 `audit_logs`에 기록 (액션은 `'ROLLBACK'`).
- **Referential Integrity**: 롤백 시 외래 키 제약 조건에 의해 실패할 수 있음. (예: 이미 부모 레코드가 삭제된 경우) -> 롤백 시 에러 핸들링 및 사용자 가이드 제공 필요.
