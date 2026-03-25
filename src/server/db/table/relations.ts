import { relations } from 'drizzle-orm';

import { campaignMembersTable, campaignsTable } from './campaigns.table';
import { characterClassesTable, charactersTable } from './characters.table';
import { currencyTransactionsTable } from './currency-transactions.table';
import { docsTable } from './docs.table';
import { logHistoriesTable } from './logHistories.table';
import { sessionLogsTable, sessionPlayersTable, sessionsTable } from './sessions.table';
import { usersTable } from './users.table';

// 1. User Relations (총 8개 매핑 완료)
export const usersRelations = relations(usersTable, ({ many, }) => ({
  campaigns: many(campaignsTable),
  campaignMembers: many(campaignMembersTable),
  characters: many(charactersTable),
  sessionPlayers: many(sessionPlayersTable),
  sessionLogs: many(sessionLogsTable),
  docs: many(docsTable),
  logHistories: many(logHistoriesTable),
  currencyTransactions: many(currencyTransactionsTable),
}));

// 2. Campaign Relations
export const campaignsRelations = relations(campaignsTable, ({ one, many, }) => ({
  user: one(usersTable, { fields: [ campaignsTable.userId, ], references: [ usersTable.id, ], }),
  members: many(campaignMembersTable),
  sessions: many(sessionsTable),
  characters: many(charactersTable),
}));

export const campaignMembersRelations = relations(campaignMembersTable, ({ one, }) => ({
  user: one(usersTable, { fields: [ campaignMembersTable.userId, ], references: [ usersTable.id, ], }),
  campaign: one(campaignsTable, { fields: [ campaignMembersTable.campaignId, ], references: [ campaignsTable.id, ], }),
}));

// 3. Session Relations
export const sessionsRelations = relations(sessionsTable, ({ one, many, }) => ({
  campaign: one(campaignsTable, { fields: [ sessionsTable.campaignId, ], references: [ campaignsTable.id, ], }),
  players: many(sessionPlayersTable),
  logs: many(sessionLogsTable),
}));

export const sessionPlayersRelations = relations(sessionPlayersTable, ({ one, }) => ({
  session: one(sessionsTable, { fields: [ sessionPlayersTable.sessionId, ], references: [ sessionsTable.id, ], }),
  user: one(usersTable, { fields: [ sessionPlayersTable.userId, ], references: [ usersTable.id, ], }),
  character: one(charactersTable, { fields: [ sessionPlayersTable.characterId, ], references: [ charactersTable.id, ], }),
}));

export const sessionLogsRelations = relations(sessionLogsTable, ({ one, }) => ({
  session: one(sessionsTable, { fields: [ sessionLogsTable.sessionId, ], references: [ sessionsTable.id, ], }),
  user: one(usersTable, { fields: [ sessionLogsTable.userId, ], references: [ usersTable.id, ], }),
}));

// 4. Character Relations
export const charactersRelations = relations(charactersTable, ({ one, many, }) => ({
  user: one(usersTable, { fields: [ charactersTable.userId, ], references: [ usersTable.id, ], }),
  campaign: one(campaignsTable, { fields: [ charactersTable.campaignId, ], references: [ campaignsTable.id, ], }),
  classes: many(characterClassesTable),
  sessions: many(sessionPlayersTable),
  currencyTransactions: many(currencyTransactionsTable),
}));

export const characterClassesRelations = relations(characterClassesTable, ({ one, }) => ({
  character: one(charactersTable, { fields: [ characterClassesTable.characterId, ], references: [ charactersTable.id, ], }),
}));

// 5. Doc Relations
export const docsRelations = relations(docsTable, ({ one, }) => ({
  user: one(usersTable, { fields: [ docsTable.userId, ], references: [ usersTable.id, ], }),
}));

// 6. LogHistory Relations
export const logHistoriesRelations = relations(logHistoriesTable, ({ one, }) => ({
  user: one(usersTable, { fields: [ logHistoriesTable.userId, ], references: [ usersTable.id, ], }),
}));

// 7. CurrencyTransaction Relations
export const currencyTransactionsRelations = relations(currencyTransactionsTable, ({ one, }) => ({
  user: one(usersTable, { fields: [ currencyTransactionsTable.userId, ], references: [ usersTable.id, ], }),
  character: one(charactersTable, {
    fields: [ currencyTransactionsTable.characterId, ],
    references: [ charactersTable.id, ],
  }),
}));
