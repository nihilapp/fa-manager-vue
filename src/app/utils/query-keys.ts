import { createMutationKeys, createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory';
import type {
  CampaignQueryDto,
  CharacterClassQueryDto,
  CharacterQueryDto,
  CurrencyTransactionQueryDto,
  LogHistoryQueryDto,
  SessionLogQueryDto,
  SessionQueryDto,
  UserQueryDto,
} from '../../server/types/dto.types';

const withParams = <TParams extends object>(params: TParams) => ({
  queryKey: [ params, ] as const,
});

const users = createQueryKeys('users', {
  check: (params: UserQueryDto = {}) => withParams(params),
  index: (params: UserQueryDto = {}) => withParams(params),
  me: (params: UserQueryDto = {}) => withParams(params),
  detail: (params: { id: string | number }) => withParams(params),
});

const campaigns = createQueryKeys('campaigns', {
  index: (params: CampaignQueryDto = {}) => withParams(params),
  mine: (params: CampaignQueryDto = {}) => withParams(params),
  detail: (params: { id: string | number }) => withParams(params),
});

const characters = createQueryKeys('characters', {
  index: (params: CharacterQueryDto = {}) => withParams(params),
  mine: (params: CharacterQueryDto = {}) => withParams(params),
  detail: (params: { id: string | number }) => withParams(params),
  classes: (params: CharacterClassQueryDto = {}) => withParams(params),
});

const currencyTransactions = createQueryKeys('currency-transactions', {
  index: (params: CurrencyTransactionQueryDto = {}) => withParams(params),
  detail: (params: { id: string | number }) => withParams(params),
});

const health = createQueryKeys('health', {
  index: (params: Record<string, never> = {}) => withParams(params),
});

const icons = createQueryKeys('icons', {
  index: (params: Record<string, never> = {}) => withParams(params),
});

const logHistories = createQueryKeys('log-histories', {
  index: (params: LogHistoryQueryDto = {}) => withParams(params),
  detail: (params: { id: string | number }) => withParams(params),
});

const sessions = createQueryKeys('sessions', {
  index: (params: SessionQueryDto = {}) => withParams(params),
  mine: (params: SessionQueryDto = {}) => withParams(params),
  detail: (params: { id: string | number }) => withParams(params),
  logsIndex: (params: SessionLogQueryDto = {}) => withParams(params),
  logsDetail: (params: SessionLogQueryDto & { id?: string | number, logId?: string | number } = {}) => withParams(params),
});

const usersMutations = createMutationKeys('users', {
  create: null,
  updateMe: null,
  deleteMe: null,
  update: null,
  delete: null,
});

const campaignsMutations = createMutationKeys('campaigns', {
  create: null,
  update: null,
  delete: null,
  updateStatus: null,
  addCharacter: null,
  removeCharacter: null,
  addMember: null,
  removeMember: null,
});

const charactersMutations = createMutationKeys('characters', {
  create: null,
  update: null,
  delete: null,
  updateStatus: null,
  addClass: null,
  updateClass: null,
  deleteClass: null,
});

const currencyTransactionsMutations = createMutationKeys('currency-transactions', {
  create: null,
  update: null,
  delete: null,
});

const logHistoriesMutations = createMutationKeys('log-histories', {
  create: null,
  update: null,
  delete: null,
});

const sessionsMutations = createMutationKeys('sessions', {
  create: null,
  update: null,
  delete: null,
  createLog: null,
  updateLog: null,
  deleteLog: null,
  addPlayer: null,
  removePlayer: null,
});

export const queryKeys = mergeQueryKeys(
  users,
  campaigns,
  characters,
  currencyTransactions,
  health,
  icons,
  logHistories,
  sessions
);

export const mutationKeys = mergeQueryKeys(
  usersMutations,
  campaignsMutations,
  charactersMutations,
  currencyTransactionsMutations,
  logHistoriesMutations,
  sessionsMutations
);
