import { bigint, char, pgEnum, timestamp } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', [ 'PREPARING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED', 'ON_HOLD', ]);

export const campaignRoleEnum = pgEnum('campaign_role', [ 'PLAYER', 'MASTER', 'SUB_MASTER', ]);

export const sessionRoleEnum = pgEnum('session_role', [ 'PLAYER', 'MASTER', ]);

export const playerRoleEnum = pgEnum('player_role', [
  'ROLE_USER',
  'ROLE_ADMIN',
  'ROLE_SUPER_ADMIN',
]);

export const playerStatusEnum = pgEnum('player_status', [
  'ACTIVE',
  'INACTIVE',
  'REST',
]);

export const docVisibilityEnum = pgEnum('doc_visibility', [ 'PUBLIC', 'PRIVATE', ]);
export const docStatusEnum = pgEnum('doc_status', [ 'DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED', ]);

// 캐릭터 상태 Enum 추가
export const characterStatusEnum = pgEnum('character_status', [
  'ACTIVE',
  'RESTING',
  'RETIRED',
  'DECEASED',
]);

export const transactionTypeEnum = pgEnum('transaction_type', [
  'REWARD', // 보상
  'INCOME', // 수익
  'EXPENSE', // 소비
  'EXCHANGE', // 환전
  'INIT', // 초기자금
]);

export const commonColumns = {
  id: bigint('id', { mode: 'number', })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  meta: {
    useYn: char('use_yn', { length: 1, }).default('Y'),
    deleteYn: char('delete_yn', { length: 1, }).default('N'),
    creatorId: bigint('creator_id', { mode: 'number', }),
    createDate: timestamp('create_date', { withTimezone: true, precision: 6, })
      .defaultNow()
      .notNull(),
    updaterId: bigint('updater_id', { mode: 'number', }),
    updateDate: timestamp('update_date', { withTimezone: true, precision: 6, })
      .defaultNow()
      .$onUpdate(() => new Date()),
    deleterId: bigint('deleter_id', { mode: 'number', }),
    deleteDate: timestamp('delete_date', { withTimezone: true, precision: 6, }),
  },
};
