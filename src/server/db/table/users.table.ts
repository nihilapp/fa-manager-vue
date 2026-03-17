import { index, pgTable, varchar } from 'drizzle-orm/pg-core';

import { commonColumns, userRoleEnum } from './common';

export const usersTable = pgTable('users', {
  id: commonColumns.id,

  discordId: varchar('discord_id', { length: 100, }).unique().notNull(),
  name: varchar('name', { length: 50, }).notNull(),
  role: userRoleEnum('role').default('ROLE_USER').notNull(),

  ...commonColumns.meta,
}, (table) => [
  index('idx_users_name').on(table.name),
]);
