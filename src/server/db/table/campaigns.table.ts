import { bigint, index, pgTable, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

import { campaignRoleEnum, commonColumns, statusEnum } from './common';
import { usersTable } from './users.table';

export const campaignsTable = pgTable('campaigns', {
  id: commonColumns.id,

  userId: bigint('user_id', { mode: 'number', }).references(() => usersTable.id).notNull(),
  name: varchar('name', { length: 50, }).unique().notNull(),
  description: varchar('description', { length: 1000, }),
  status: statusEnum('status').default('PREPARING').notNull(),
  startDate: timestamp('start_date', { withTimezone: true, precision: 6, }),
  endDate: timestamp('end_date', { withTimezone: true, precision: 6, }),

  ...commonColumns.meta,
}, (table) => [
  index('idx_campaigns_status').on(table.status),
]);

export const campaignMembersTable = pgTable('campaign_members', {
  id: commonColumns.id,
  userId: bigint('user_id', { mode: 'number', }).references(() => usersTable.id).notNull(),
  campaignId: bigint('campaign_id', { mode: 'number', }).references(() => campaignsTable.id).notNull(),
  role: campaignRoleEnum('role').default('PLAYER').notNull(),
  ...commonColumns.meta,
}, (table) => [
  uniqueIndex('idx_campaign_members_user_campaign').on(table.userId, table.campaignId),
]);
