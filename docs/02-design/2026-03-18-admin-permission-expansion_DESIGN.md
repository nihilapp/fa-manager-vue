# PDCA Design: Admin Permission Expansion

## 1. 개요 (Overview)
- **대상**: `src/server/utils/auth.ts` 및 주요 CUD API
- **목표**: `authHelper`가 단순히 사용자 정보만 반환하는 것을 넘어, 상황별 권한 검증(Assertion) 기능을 제공하도록 설계함.

## 2. 권한 검증 유틸리티 설계 (`auth.ts`)

### 2.1 기존 `authHelper` 확장
기존의 `hasPermission`은 boolean만 반환하지만, 새로운 도우미들은 권한이 없을 경우 즉시 `BaseResponse.error`를 반환하거나 예외를 던질 수 있는 구조로 검토함 (현재는 에러 객체 반환 방식 유지).

```typescript
// src/server/utils/auth.ts 에 추가/수정될 로직 예시

/**
 * 1. 본인 여부 또는 관리자 여부 확인 (Self or Admin)
 * @param targetUserId 조작 대상이 되는 사용자의 ID
 * @param requesterId 요청을 보낸 사용자의 ID (authHelper에서 가져옴)
 * @param isAdmin 요청자가 관리자인지 여부
 */
export const checkSelfOrAdmin = (targetUserId: number, requesterId: number, isAdmin: boolean) => {
  return isAdmin || targetUserId === requesterId;
};

/**
 * 2. 리소스 소유자 여부 또는 관리자 여부 확인 (Owner or Admin)
 * @param resourceOwnerId 리소스의 실제 소유자 ID
 * @param requesterId 요청을 보낸 사용자의 ID
 * @param isAdmin 요청자가 관리자인지 여부
 */
export const checkOwnerOrAdmin = (resourceOwnerId: number, requesterId: number, isAdmin: boolean) => {
  return isAdmin || resourceOwnerId === requesterId;
};
```

### 2.2 API 적용 패턴 설계

#### 사용자 수정 API (`PUT /api/users/:id`)
```typescript
const { user, isAdmin, hasPermission, error } = await authHelper(event);
// ...
if (!hasPermission(findUser.id)) {
  return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.USER_FORBIDDEN);
}

// Role 변경 방어
if (body.role && body.role !== findUser.role && !isAdmin) {
  // 일반 사용자가 role을 변경하려고 하면 기존 role 유지 또는 에러 반환
  body.role = findUser.role; 
}
```

#### 캠페인 멤버 추가 API (`POST /api/campaigns/:id/members/:userId`)
```typescript
const { user, isAdmin, error } = await authHelper(event);
const targetUserId = Number(getRouterParam(event, 'userId'));

// 일반 사용자는 오직 본인(targetUserId === user.id)만 가입 가능
// 관리자는 아무나(targetUserId) 가입 가능
if (targetUserId !== user.id && !isAdmin) {
  return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, "자신의 계정만 가입할 수 있습니다.");
}
```

## 3. 도메인별 세부 정책

| 도메인 | 조작 대상 | 권한 규칙 (일반 사용자) | 권한 규칙 (관리자) |
| :--- | :--- | :--- | :--- |
| **Users** | 본인 정보 | 가능 (단, role 변경 불가) | 가능 (타인 정보 포함) |
| **Campaigns** | 캠페인 정보 | 소유자(MASTER)만 가능 | 모두 가능 |
| **Members** | 참여/탈퇴 | 본인 참여/탈퇴만 가능 | 타인 강제 가입/탈퇴 가능 |
| **Characters** | 캐릭터 정보 | 소유자만 가능 | 모두 가능 |
| **Sessions** | 세션 정보 | 캠페인 MASTER만 가능 | 모두 가능 |
| **Session Players** | 플레이어 등록 | 본인 캐릭터만 등록 가능 | 타인 캐릭터 등록 가능 |

## 4. 데이터 일관성 (Auditing)
- 관리자가 대행하더라도 `updaterId`는 실제 요청자인 `user.id`(관리자 ID)로 기록함.
- `creatorId`는 최초 생성 시 관리자가 타인을 위해 생성해주더라도, 상황에 따라 '실제 소유자'를 가리킬지 '관리자'를 가리킬지 도메인별로 정의함 (대부분 실제 소유자를 가리키도록 설계).
