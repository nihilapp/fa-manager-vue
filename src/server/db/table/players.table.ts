import { index, pgTable, varchar } from 'drizzle-orm/pg-core';

import { commonColumns, playerRoleEnum, playerStatusEnum } from './common';

export const playersTable = pgTable('players', {
  id: commonColumns.id,

  discordId: varchar('discord_id', { length: 100, }).unique().notNull(),
  name: varchar('name', { length: 50, }).notNull(),
  role: playerRoleEnum('role').default('ROLE_USER').notNull(),
  status: playerStatusEnum('status').default('ACTIVE').notNull(),

  ...commonColumns.meta,
}, (table) => [
  index('idx_players_name').on(table.name),
]);
