// import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// import {
//   users,
//   campaigns,
//   campaignMembers,
//   characters,
//   sessions,
//   sessionCharacters,
//   expLogs,
//   currencyLogs
// } from '~~/server/db/schema';

// // ==========================================
// // 1. Users
// // ==========================================
// export type User = typeof users.$inferSelect;
// export type NewUser = typeof users.$inferInsert;
// export type UpdateUser = Partial<NewUser>;

// export const insertUserSchema = createInsertSchema(users);
// export const selectUserSchema = createSelectSchema(users);
// export const updateUserSchema = insertUserSchema.partial();

// // ==========================================
// // 2. Campaigns
// // ==========================================
// export type Campaign = typeof campaigns.$inferSelect;
// export type NewCampaign = typeof campaigns.$inferInsert;
// export type UpdateCampaign = Partial<NewCampaign>;

// export const insertCampaignSchema = createInsertSchema(campaigns);
// export const selectCampaignSchema = createSelectSchema(campaigns);
// export const updateCampaignSchema = insertCampaignSchema.partial();

// // ==========================================
// // 3. Campaign Members
// // ==========================================
// export type CampaignMember = typeof campaignMembers.$inferSelect;
// export type NewCampaignMember = typeof campaignMembers.$inferInsert;
// export type UpdateCampaignMember = Partial<NewCampaignMember>;

// export const insertCampaignMemberSchema = createInsertSchema(campaignMembers);
// export const selectCampaignMemberSchema = createSelectSchema(campaignMembers);
// export const updateCampaignMemberSchema = insertCampaignMemberSchema.partial();

// // ==========================================
// // 4. Characters
// // ==========================================
// export type Character = typeof characters.$inferSelect;
// export type NewCharacter = typeof characters.$inferInsert;
// export type UpdateCharacter = Partial<NewCharacter>;

// export const insertCharacterSchema = createInsertSchema(characters);
// export const selectCharacterSchema = createSelectSchema(characters);
// export const updateCharacterSchema = insertCharacterSchema.partial();

// // ==========================================
// // 5. Sessions
// // ==========================================
// export type Session = typeof sessions.$inferSelect;
// export type NewSession = typeof sessions.$inferInsert;
// export type UpdateSession = Partial<NewSession>;

// export const insertSessionSchema = createInsertSchema(sessions);
// export const selectSessionSchema = createSelectSchema(sessions);
// export const updateSessionSchema = insertSessionSchema.partial();

// // ==========================================
// // 6. Session Characters (Participants)
// // ==========================================
// export type SessionCharacter = typeof sessionCharacters.$inferSelect;
// export type NewSessionCharacter = typeof sessionCharacters.$inferInsert;
// export type UpdateSessionCharacter = Partial<NewSessionCharacter>;

// export const insertSessionCharacterSchema = createInsertSchema(sessionCharacters);
// export const selectSessionCharacterSchema = createSelectSchema(sessionCharacters);
// export const updateSessionCharacterSchema = insertSessionCharacterSchema.partial();

// // ==========================================
// // 7. Exp Logs
// // ==========================================
// export type ExpLog = typeof expLogs.$inferSelect;
// export type NewExpLog = typeof expLogs.$inferInsert;
// export type UpdateExpLog = Partial<NewExpLog>;

// export const insertExpLogSchema = createInsertSchema(expLogs);
// export const selectExpLogSchema = createSelectSchema(expLogs);
// export const updateExpLogSchema = insertExpLogSchema.partial();

// // ==========================================
// // 8. Currency Logs
// // ==========================================
// export type CurrencyLog = typeof currencyLogs.$inferSelect;
// export type NewCurrencyLog = typeof currencyLogs.$inferInsert;
// export type UpdateCurrencyLog = Partial<NewCurrencyLog>;

// export const insertCurrencyLogSchema = createInsertSchema(currencyLogs);
// export const selectCurrencyLogSchema = createSelectSchema(currencyLogs);
// export const updateCurrencyLogSchema = insertCurrencyLogSchema.partial();
