import { bigint, jsonb, pgTable, varchar } from 'drizzle-orm/pg-core';

import { commonColumns } from './common';
import { usersTable } from './users.table';

export const logHistoriesTable = pgTable('log_histories', {
  id: commonColumns.id,

  userId: bigint('user_id', { mode: 'number', }).references(() => usersTable.id).notNull(),
  tableName: varchar('table_name', { length: 50, }).notNull(),
  targetId: bigint('target_id', { mode: 'number', }).notNull(),
  actionType: varchar('action_type', { length: 20, }).notNull(),
  oldData: jsonb('old_data'),
  newData: jsonb('new_data'),
  description: varchar('description', { length: 1000, }),

  ...commonColumns.meta,
});
