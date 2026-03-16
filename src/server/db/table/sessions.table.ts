import { bigint, index, integer, pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

import { campaignsTable } from './campaigns.table';
import { charactersTable } from './characters.table';
import { commonColumns, sessionRoleEnum, statusEnum } from './common';
import { usersTable } from './users.table';

export const sessionsTable = pgTable('sessions', {
  id: commonColumns.id,

  campaignId: bigint('campaign_id', { mode: 'number', }).references(() => campaignsTable.id).notNull(),
  no: integer('no').notNull(),
  name: varchar('name', { length: 50, }).notNull(),
  description: varchar('description', { length: 2000, }),
  maxPlayer: integer('max_player'),
  rewardExp: integer('reward_exp'),
  rewardGold: integer('reward_gold'),
  status: statusEnum('status').default('PREPARING'),
  playDate: timestamp('play_date', { withTimezone: true, precision: 6, }),

  ...commonColumns.meta,
}, (table) => [
  index('idx_sessions_no').on(table.no),
  index('idx_sessions_name').on(table.name),
]);

export const sessionPlayersTable = pgTable('session_players', {
  id: commonColumns.id,

  sessionId: bigint('session_id', { mode: 'number', }).references(() => sessionsTable.id).notNull(),
  userId: bigint('user_id', { mode: 'number', }).references(() => usersTable.id).notNull(),
  characterId: bigint('character_id', { mode: 'number', }).references(() => charactersTable.id).notNull(),
  role: sessionRoleEnum('role').default('PLAYER').notNull(),

  ...commonColumns.meta,
}, (table) => [
  uniqueIndex('idx_session_players_session_user').on(table.sessionId, table.userId),
]);

export const sessionLogsTable = pgTable('session_logs', {
  id: commonColumns.id,

  sessionId: bigint('session_id', { mode: 'number', }).references(() => sessionsTable.id).notNull(),
  userId: bigint('user_id', { mode: 'number', }).references(() => usersTable.id).notNull(),
  title: varchar('title', { length: 100, }).notNull(),
  content: text('content'),
  fileUrl: varchar('file_url', { length: 255, }),

  ...commonColumns.meta,
});
