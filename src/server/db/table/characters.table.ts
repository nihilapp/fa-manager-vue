import { bigint, index, integer, pgTable, primaryKey, text, varchar } from 'drizzle-orm/pg-core';

import { campaignsTable } from './campaigns.table';
import { characterStatusEnum, commonColumns } from './common';
import { playersTable } from './players.table';

export const charactersTable = pgTable('characters', {
  id: commonColumns.id,

  userId: bigint('user_id', { mode: 'number', }).references(() => playersTable.id).notNull(),
  campaignId: bigint('campaign_id', { mode: 'number', }).references(() => campaignsTable.id),
  name: varchar('name', { length: 50, }).notNull(),
  status: characterStatusEnum('status').default('ACTIVE').notNull(),
  race: varchar('race', { length: 30, }).notNull(),
  startLevel: integer('start_level').default(0).notNull(),
  startExp: integer('start_exp').default(0).notNull(),

  // D&D 핵심 스탯 (신규 추가 - 선택값)
  str: integer('str'),
  dex: integer('dex'),
  con: integer('con'),
  int: integer('int'),
  wis: integer('wis'),
  cha: integer('cha'),
  ac: integer('ac'),
  hp: integer('hp'),
  speed: text('speed'),
  vision: text('vision'),
  skills: text('skills'),
  advantage: text('advantage'),
  disadvantage: text('disadvantage'),
  resistance: text('resistance'),
  immunity: text('immunity'),

  // 캐릭터 장비 (Prisma 복구)
  mainHand: varchar('main_hand', { length: 100, }),
  offHand: varchar('off_hand', { length: 100, }),
  armor: varchar('armor', { length: 100, }),
  head: varchar('head', { length: 100, }),
  gauntlet: varchar('gauntlet', { length: 100, }),
  boots: varchar('boots', { length: 100, }),
  belt: varchar('belt', { length: 100, }),
  cloak: varchar('cloak', { length: 100, }),
  accessory1: varchar('accessory1', { length: 100, }),
  accessory2: varchar('accessory2', { length: 100, }),
  accessory3: varchar('accessory3', { length: 100, }),
  accessory4: varchar('accessory4', { length: 100, }),

  // 근력/민첩 요구치 (Prisma 복구)
  reqStrDex8: varchar('req_str_dex8', { length: 100, }),
  reqStrDex10: varchar('req_str_dex10', { length: 100, }),
  reqStrDex12: varchar('req_str_dex12', { length: 100, }),
  reqStrDex14: varchar('req_str_dex14', { length: 100, }),
  reqStr16: varchar('req_str16', { length: 100, }),
  reqStr18: varchar('req_str18', { length: 100, }),
  reqStr20: varchar('req_str20', { length: 100, }),

  // 건강 요구치 (Prisma 복구)
  reqCon8: varchar('req_con8', { length: 100, }),
  reqCon10: varchar('req_con10', { length: 100, }),
  reqCon12: varchar('req_con12', { length: 100, }),
  reqCon14: varchar('req_con14', { length: 100, }),
  reqCon16: varchar('req_con16', { length: 100, }),
  reqCon18: varchar('req_con18', { length: 100, }),
  reqCon20: varchar('req_con20', { length: 100, }),

  ...commonColumns.meta,
}, (table) => [
  index('idx_characters_name').on(table.name),
  index('idx_characters_user_id').on(table.userId),
  index('idx_characters_status').on(table.status),
]);

export const characterClassesTable = pgTable('character_classes', {
  characterId: bigint('character_id', { mode: 'number', }).references(() => charactersTable.id).notNull(),
  className: varchar('class_name', { length: 50, }).notNull(),
  subClassName: varchar('sub_class_name', { length: 50, }).default('').notNull(),
  level: integer('level').notNull(),
}, (table) => [
  primaryKey({ columns: [ table.characterId, table.className, ], }),
]);
