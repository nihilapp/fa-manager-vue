import { bigint, integer, pgTable, varchar } from 'drizzle-orm/pg-core';

import { charactersTable } from './characters.table';
import { commonColumns, transactionTypeEnum } from './common';
import { usersTable } from './users.table';

export const currencyTransactionsTable = pgTable('currency_transactions', {
  id: commonColumns.id,

  userId: bigint('user_id', { mode: 'number', }).references(() => usersTable.id).notNull(),
  characterId: bigint('character_id', { mode: 'number', }).references(() => charactersTable.id).notNull(),
  transactionType: transactionTypeEnum('transaction_type').default('INIT').notNull(),
  description: varchar('description', { length: 2000, }).notNull(),

  deltaPp: integer('delta_pp').default(0).notNull(),
  deltaGp: integer('delta_gp').default(0).notNull(),
  deltaEp: integer('delta_ep').default(0).notNull(),
  deltaSp: integer('delta_sp').default(0).notNull(),
  deltaCp: integer('delta_cp').default(0).notNull(),

  ...commonColumns.meta,
});
