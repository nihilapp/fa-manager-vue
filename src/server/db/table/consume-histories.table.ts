import { bigint, jsonb, pgTable, text, varchar } from 'drizzle-orm/pg-core';

import { charactersTable } from './characters.table';
import { commonColumns } from './common';
import { usersTable } from './users.table';

export const consumeHistoriesTable = pgTable('consume_histories', {
  id: commonColumns.id,

  userId: bigint('user_id', { mode: 'number', }).references(() => usersTable.id).notNull(),
  characterId: bigint('character_id', { mode: 'number', }).references(() => charactersTable.id).notNull(),
  description: varchar('description', { length: 2000, }).notNull(),

  // 화폐 객체를 JSONB 형태로 저장
  beforeCurrency: jsonb('before_currency').notNull(),
  afterCurrency: jsonb('after_currency').notNull(),

  ...commonColumns.meta,
});
