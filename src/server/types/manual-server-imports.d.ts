import type {
  Column,
  InferInsertModel,
  InferSelectModel,
  SQL,
} from 'drizzle-orm';
import type {
  PgBigInt53,
  PgChar,
  PgColumn,
  PgEnum,
  PgInteger,
  PgJsonb,
  PgTable,
  PgText,
  PgTimestamp,
  PgVarchar,
} from 'drizzle-orm/pg-core';

type NitroImports = typeof import('#imports');

declare global {
  type H3Event = Parameters<NitroImports['getQuery']>[0];
  type EventHandler = Parameters<NitroImports['defineEventHandler']>[0];
  type EventHandlerRequest = unknown;

  type SQL<T = unknown> = import('drizzle-orm').SQL<T>;
  type Column<TData = any, THasDefault extends boolean = any, TNotNull extends boolean = any> = import('drizzle-orm').Column<TData, THasDefault, TNotNull>;
  type PgTable = import('drizzle-orm/pg-core').PgTable;
  type PgColumn = import('drizzle-orm/pg-core').PgColumn;
  type PgBigInt53 = import('drizzle-orm/pg-core').PgBigInt53;
  type PgVarchar = import('drizzle-orm/pg-core').PgVarchar;
  type PgText = import('drizzle-orm/pg-core').PgText;
  type PgInteger = import('drizzle-orm/pg-core').PgInteger;
  type PgChar = import('drizzle-orm/pg-core').PgChar;
  type PgTimestamp = import('drizzle-orm/pg-core').PgTimestamp;
  type PgJsonb = import('drizzle-orm/pg-core').PgJsonb;
  type PgEnum<TValues extends readonly string[]> = import('drizzle-orm/pg-core').PgEnum<TValues>;

  type TypeUser = InferSelectModel<typeof import('../db/table/users.table')['usersTable']>;
  type TypeNewUser = InferInsertModel<typeof import('../db/table/users.table')['usersTable']>;
  type TypeCampaign = InferSelectModel<typeof import('../db/table/campaigns.table')['campaignsTable']>;
  type TypeNewCampaign = InferInsertModel<typeof import('../db/table/campaigns.table')['campaignsTable']>;
  type TypeCampaignMember = InferSelectModel<typeof import('../db/table/campaigns.table')['campaignMembersTable']>;
  type TypeNewCampaignMember = InferInsertModel<typeof import('../db/table/campaigns.table')['campaignMembersTable']>;
  type TypeSession = InferSelectModel<typeof import('../db/table/sessions.table')['sessionsTable']>;
  type TypeNewSession = InferInsertModel<typeof import('../db/table/sessions.table')['sessionsTable']>;
  type TypeSessionPlayer = InferSelectModel<typeof import('../db/table/sessions.table')['sessionPlayersTable']>;
  type TypeNewSessionPlayer = InferInsertModel<typeof import('../db/table/sessions.table')['sessionPlayersTable']>;
  type TypeSessionLog = InferSelectModel<typeof import('../db/table/sessions.table')['sessionLogsTable']>;
  type TypeNewSessionLog = InferInsertModel<typeof import('../db/table/sessions.table')['sessionLogsTable']>;
  type TypeCharacter = InferSelectModel<typeof import('../db/table/characters.table')['charactersTable']>;
  type TypeNewCharacter = InferInsertModel<typeof import('../db/table/characters.table')['charactersTable']>;
  type TypeCharacterClass = InferSelectModel<typeof import('../db/table/characters.table')['characterClassesTable']>;
  type TypeNewCharacterClass = InferInsertModel<typeof import('../db/table/characters.table')['characterClassesTable']>;
  type TypeCurrencyTransaction = InferSelectModel<typeof import('../db/table/currency-transactions.table')['currencyTransactionsTable']>;
  type TypeNewCurrencyTransaction = InferInsertModel<typeof import('../db/table/currency-transactions.table')['currencyTransactionsTable']>;
  type TypeDoc = InferSelectModel<typeof import('../db/table/docs.table')['docsTable']>;
  type TypeNewDoc = InferInsertModel<typeof import('../db/table/docs.table')['docsTable']>;
  type TypeLogHistory = InferSelectModel<typeof import('../db/table/logHistories.table')['logHistoriesTable']>;
  type TypeNewLogHistory = InferInsertModel<typeof import('../db/table/logHistories.table')['logHistoriesTable']>;

  type UserRole = import('./dto.types').UserRole;
  type CampaignRole = import('./dto.types').CampaignRole;
  type SessionRole = import('./dto.types').SessionRole;
  type Status = import('./dto.types').Status;
  type DocVisibility = import('./dto.types').DocVisibility;
  type DocStatus = import('./dto.types').DocStatus;
  type CharacterStatus = import('./dto.types').CharacterStatus;
  type TransactionType = import('./dto.types').TransactionType;
  type LogActionType = import('./dto.types').LogActionType;

  type CommonInDto = import('./dto.types').CommonInDto;
  type CommonQueryDto = import('./dto.types').CommonQueryDto;
  type CommonOutDto = import('./dto.types').CommonOutDto;
  type UserQueryDto = import('./dto.types').UserQueryDto;
  type UserCreateDto = import('./dto.types').UserCreateDto;
  type UserUpdateDto = import('./dto.types').UserUpdateDto;
  type UserOutDto = import('./dto.types').UserOutDto;
  type CampaignQueryDto = import('./dto.types').CampaignQueryDto;
  type CampaignCreateDto = import('./dto.types').CampaignCreateDto;
  type CampaignUpdateDto = import('./dto.types').CampaignUpdateDto;
  type CampaignOutDto = import('./dto.types').CampaignOutDto;
  type CampaignMemberCreateDto = import('./dto.types').CampaignMemberCreateDto;
  type CampaignMemberOutDto = import('./dto.types').CampaignMemberOutDto;
  type SessionQueryDto = import('./dto.types').SessionQueryDto;
  type SessionCreateDto = import('./dto.types').SessionCreateDto;
  type SessionUpdateDto = import('./dto.types').SessionUpdateDto;
  type SessionOutDto = import('./dto.types').SessionOutDto;
  type SessionPlayerCreateDto = import('./dto.types').SessionPlayerCreateDto;
  type SessionPlayerOutDto = import('./dto.types').SessionPlayerOutDto;
  type SessionLogQueryDto = import('./dto.types').SessionLogQueryDto;
  type SessionLogCreateDto = import('./dto.types').SessionLogCreateDto;
  type SessionLogUpdateDto = import('./dto.types').SessionLogUpdateDto;
  type SessionLogOutDto = import('./dto.types').SessionLogOutDto;
  type CharacterQueryDto = import('./dto.types').CharacterQueryDto;
  type CharacterCreateDto = import('./dto.types').CharacterCreateDto;
  type CharacterUpdateDto = import('./dto.types').CharacterUpdateDto;
  type CharacterOutDto = import('./dto.types').CharacterOutDto;
  type CharacterClassQueryDto = import('./dto.types').CharacterClassQueryDto;
  type CharacterClassCreateDto = import('./dto.types').CharacterClassCreateDto;
  type CharacterClassUpdateDto = import('./dto.types').CharacterClassUpdateDto;
  type CharacterClassOutDto = import('./dto.types').CharacterClassOutDto;
  type DocInDto = import('./dto.types').DocInDto;
  type DocOutDto = import('./dto.types').DocOutDto;
  type LogHistoryQueryDto = import('./dto.types').LogHistoryQueryDto;
  type LogHistoryCreateDto = import('./dto.types').LogHistoryCreateDto;
  type LogHistoryUpdateDto = import('./dto.types').LogHistoryUpdateDto;
  type LogHistoryOutDto = import('./dto.types').LogHistoryOutDto;
  type CurrencyTransactionQueryDto = import('./dto.types').CurrencyTransactionQueryDto;
  type CurrencyTransactionCreateDto = import('./dto.types').CurrencyTransactionCreateDto;
  type CurrencyTransactionUpdateDto = import('./dto.types').CurrencyTransactionUpdateDto;
  type CurrencyTransactionOutDto = import('./dto.types').CurrencyTransactionOutDto;

  type BaseResponseType<T = null> = import('./response.types').BaseResponseType<T>;
  type ListDataType<T = null> = import('./response.types').ListDataType<T>;

  type RESPONSE_CODE = import('../constant/response-code').RESPONSE_CODE;
  type RESPONSE_MESSAGE = import('../constant/response-message').RESPONSE_MESSAGE;
  type BaseResponse<T = null> = import('../utils/base-response').BaseResponse<T>;
  type ListData<T = null> = import('../utils/list-data').ListData<T>;
}

export {};
