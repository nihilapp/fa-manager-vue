import { bigint, index, pgTable, text, varchar } from 'drizzle-orm/pg-core';

import { commonColumns, docStatusEnum, docVisibilityEnum } from './common';
import { usersTable } from './users.table';

export const docsTable = pgTable('docs', {
  id: commonColumns.id,

  userId: bigint('user_id', { mode: 'number', }).references(() => usersTable.id).notNull(),
  title: varchar('title', { length: 200, }).notNull(),
  description: varchar('description', { length: 500, }), // Prisma 복구
  category: varchar('category', { length: 50, }).notNull(),
  status: docStatusEnum('status').default('DRAFT').notNull(),
  visibility: docVisibilityEnum('visibility').default('PUBLIC').notNull(),
  content: text('content'),

  ...commonColumns.meta,
}, (table) => [
  index('idx_docs_title').on(table.title),
  index('idx_docs_category').on(table.category),
]);
