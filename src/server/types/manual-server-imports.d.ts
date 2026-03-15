import {
  defineEventHandler,
  getQuery,
  readBody,
  getRouterParam,
  getRouterParams,
  getHeaders,
  getHeader,
  parseCookies,
  setResponseStatus,
  sendError,
  createError,
  deleteCookie,
  getCookie,
  setCookie,
  type H3Event,
  type EventHandler,
  type EventHandlerRequest
} from 'h3';

import {
  count,
  sql,
  and,
  or,
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  inArray,
  notInArray,
  between,
  notBetween,
  isNull,
  isNotNull,
  ilike,
  asc,
  desc,
  getTableColumns,
  type SQL,
  type Column,
  type InferSelectModel,
  type InferInsertModel
} from 'drizzle-orm';

import _ from 'lodash-es';
import {DateTime} from 'luxon';
import {v4 as uuidv4} from 'uuid';

import {RESPONSE_CODE} from '../constant/response-code';
import {RESPONSE_MESSAGE} from '../constant/response-message';
import {BaseResponse} from '../utils/base-response';
import {ListData} from '../utils/list-data';
import {db} from '../utils/drizzle';
import {sortHelper} from '../utils/sort.helper';
import {buildDrizzleWhere} from '../utils/where.helper';
import type {BaseResponseType, ListDataType} from './response.types';

// 테이블 임포트
import {usersTable} from '../db/table/users.table';
import {campaignsTable, campaignMembersTable} from '../db/table/campaigns.table';
import {sessionsTable, sessionPlayersTable, sessionLogsTable} from '../db/table/sessions.table';
import {charactersTable, characterClassesTable} from '../db/table/characters.table';
import {docsTable} from '../db/table/docs.table';
import {logHistoriesTable} from '../db/table/logHistories.table';

declare global {
  // Common Utils
  const _: typeof import('lodash-es');
  const DateTime: typeof import('luxon')['DateTime'];
  const uuidv4: typeof import('uuid')['v4'];

  // Drizzle Core
  const count: typeof import('drizzle-orm')['count'];
  type SQL<T = unknown> = import('drizzle-orm').SQL<T>;
  type Column<TData = any, THasDefault extends boolean = any, TNotNull extends boolean = any> = import('drizzle-orm').Column<TData, THasDefault, TNotNull>;
  const sql: typeof import('drizzle-orm')['sql'];
  const and: typeof import('drizzle-orm')['and'];
  const or: typeof import('drizzle-orm')['or'];
  const eq: typeof import('drizzle-orm')['eq'];
  const ne: typeof import('drizzle-orm')['ne'];
  const gt: typeof import('drizzle-orm')['gt'];
  const gte: typeof import('drizzle-orm')['gte'];
  const lt: typeof import('drizzle-orm')['lt'];
  const lte: typeof import('drizzle-orm')['lte'];
  const inArray: typeof import('drizzle-orm')['inArray'];
  const notInArray: typeof import('drizzle-orm')['notInArray'];
  const between: typeof import('drizzle-orm')['between'];
  const notBetween: typeof import('drizzle-orm')['notBetween'];
  const isNull: typeof import('drizzle-orm')['isNull'];
  const isNotNull: typeof import('drizzle-orm')['isNotNull'];
  const ilike: typeof import('drizzle-orm')['ilike'];
  const asc: typeof import('drizzle-orm')['asc'];
  const desc: typeof import('drizzle-orm')['desc'];
  const getTableColumns: typeof import('drizzle-orm')['getTableColumns'];

  // Server Tables
  const usersTable: typeof import('../db/table/users.table')['usersTable'];
  const campaignsTable: typeof import('../db/table/campaigns.table')['campaignsTable'];
  const campaignMembersTable: typeof import('../db/table/campaigns.table')['campaignMembersTable'];
  const sessionsTable: typeof import('../db/table/sessions.table')['sessionsTable'];
  const sessionPlayersTable: typeof import('../db/table/sessions.table')['sessionPlayersTable'];
  const sessionLogsTable: typeof import('../db/table/sessions.table')['sessionLogsTable'];
  const charactersTable: typeof import('../db/table/characters.table')['charactersTable'];
  const characterClassesTable: typeof import('../db/table/characters.table')['characterClassesTable'];
  const docsTable: typeof import('../db/table/docs.table')['docsTable'];
  const logHistoriesTable: typeof import('../db/table/logHistories.table')['logHistoriesTable'];

  // Table Inferred Types (Prefixed with 'Type')
  type TypeUser = InferSelectModel<typeof usersTable>;
  type TypeNewUser = InferInsertModel<typeof usersTable>;
  type TypeCampaign = InferSelectModel<typeof campaignsTable>;
  type TypeNewCampaign = InferInsertModel<typeof campaignsTable>;
  type TypeCampaignMember = InferSelectModel<typeof campaignMembersTable>;
  type TypeNewCampaignMember = InferInsertModel<typeof campaignMembersTable>;
  type TypeSession = InferSelectModel<typeof sessionsTable>;
  type TypeNewSession = InferInsertModel<typeof sessionsTable>;
  type TypeSessionPlayer = InferSelectModel<typeof sessionPlayersTable>;
  type TypeNewSessionPlayer = InferInsertModel<typeof sessionPlayersTable>;
  type TypeSessionLog = InferSelectModel<typeof sessionLogsTable>;
  type TypeNewSessionLog = InferInsertModel<typeof sessionLogsTable>;
  type TypeCharacter = InferSelectModel<typeof charactersTable>;
  type TypeNewCharacter = InferInsertModel<typeof charactersTable>;
  type TypeCharacterClass = InferSelectModel<typeof characterClassesTable>;
  type TypeNewCharacterClass = InferInsertModel<typeof characterClassesTable>;
  type TypeDoc = InferSelectModel<typeof docsTable>;
  type TypeNewDoc = InferInsertModel<typeof docsTable>;
  type TypeLogHistory = InferSelectModel<typeof logHistoriesTable>;
  type TypeNewLogHistory = InferInsertModel<typeof logHistoriesTable>;

  // Server DTO Types & Enums
  type UserRole = import('./dto.types').UserRole;
  type CampaignRole = import('./dto.types').CampaignRole;
  type SessionRole = import('./dto.types').SessionRole;
  type Status = import('./dto.types').Status;
  type DocVisibility = import('./dto.types').DocVisibility;
  type DocStatus = import('./dto.types').DocStatus;
  type CharacterStatus = import('./dto.types').CharacterStatus;

  type CommonInDto = import('./dto.types').CommonInDto;
  type CommonOutDto = import('./dto.types').CommonOutDto;
  type UserInDto = import('./dto.types').UserInDto;
  type UserOutDto = import('./dto.types').UserOutDto;
  type CampaignInDto = import('./dto.types').CampaignInDto;
  type CampaignOutDto = import('./dto.types').CampaignOutDto;
  type CampaignMemberInDto = import('./dto.types').CampaignMemberInDto;
  type CampaignMemberOutDto = import('./dto.types').CampaignMemberOutDto;
  type SessionInDto = import('./dto.types').SessionInDto;
  type SessionOutDto = import('./dto.types').SessionOutDto;
  type SessionPlayerInDto = import('./dto.types').SessionPlayerInDto;
  type SessionPlayerOutDto = import('./dto.types').SessionPlayerOutDto;
  type SessionLogInDto = import('./dto.types').SessionLogInDto;
  type SessionLogOutDto = import('./dto.types').SessionLogOutDto;
  type CharacterInDto = import('./dto.types').CharacterInDto;
  type CharacterOutDto = import('./dto.types').CharacterOutDto;
  type CharacterClassInDto = import('./dto.types').CharacterClassInDto;
  type CharacterClassOutDto = import('./dto.types').CharacterClassOutDto;
  type DocInDto = import('./dto.types').DocInDto;
  type DocOutDto = import('./dto.types').DocOutDto;
  type LogHistoryInDto = import('./dto.types').LogHistoryInDto;
  type LogHistoryOutDto = import('./dto.types').LogHistoryOutDto;

  // Server Response Types
  type BaseResponseType<T = null> = import('./response.types').BaseResponseType<T>;
  type ListDataType<T = null> = import('./response.types').ListDataType<T>;

  // Nitro / h3 Core
  const defineEventHandler: typeof import('h3')['defineEventHandler'];
  const getQuery: typeof import('h3')['getQuery'];
  const readBody: typeof import('h3')['readBody'];
  const getRouterParam: typeof import('h3')['getRouterParam'];
  const getRouterParams: typeof import('h3')['getRouterParams'];
  const getHeaders: typeof import('h3')['getHeaders'];
  const getHeader: typeof import('h3')['getHeader'];
  const parseCookies: typeof import('h3')['parseCookies'];
  const setResponseStatus: typeof import('h3')['setResponseStatus'];
  const createError: typeof import('h3')['createError'];
  const setCookie: typeof import('h3')['setCookie'];
  const getCookie: typeof import('h3')['getCookie'];
  const deleteCookie: typeof import('h3')['deleteCookie'];

  // Server Constants
  const RESPONSE_CODE: typeof import('../constant/response-code')['RESPONSE_CODE'];
  const RESPONSE_MESSAGE: typeof import('../constant/response-message')['RESPONSE_MESSAGE'];

  // Server Utils
  const BaseResponse: typeof import('../utils/base-response')['BaseResponse'];
  const ListData: typeof import('../utils/list-data')['ListData'];
  const authHelper: typeof import('../utils/auth')['authHelper'];
  const db: typeof import('../utils/drizzle')['db'];
  const sortHelper: typeof import('../utils/sort.helper')['sortHelper'];
  const buildDrizzleWhere: typeof import('../utils/where.helper')['buildDrizzleWhere'];
}

export {};
