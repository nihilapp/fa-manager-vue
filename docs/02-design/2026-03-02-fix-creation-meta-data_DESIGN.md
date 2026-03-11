# [DESIGN] 생성 시 메타데이터(creatorId, updaterId) 일관성 확보

## 1. 📐 설계 개요
- 생성 시 `db.insert(...).values({...})` 로직에 `updaterId` 필드를 추가한다.
- `updaterId`의 값은 `creatorId`와 동일한 `currentUser.id`로 설정한다.
- `users/index.post.ts`의 경우 가입 전후에 따른 ID 할당 로직을 확인한다.

## 2. 🛠️ 구현 상세 (예시)
```typescript
// Before
const [ newMember, ] = await db.insert(campaignMembers).values({
  campaignId: campaignIdNum,
  userId: userIdNum,
  role,
  creatorId: currentUser.id,
}).returning();

// After
const [ newMember, ] = await db.insert(campaignMembers).values({
  campaignId: campaignIdNum,
  userId: userIdNum,
  role,
  creatorId: currentUser.id,
  updaterId: currentUser.id, // 추가
}).returning();
```

## 3. 🧪 검증 계획
- 각 POST API를 호출하여 생성된 레코드의 `creator_id`와 `updater_id`가 동일한지 확인한다.
- 기존 감사 로그 기록 로직(`createAuditLog`)에 영향을 주지 않는지 확인한다.
