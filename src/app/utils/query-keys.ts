import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory';

const withParams = <TParams extends object>(params: TParams) => ({
  queryKey: [ params, ] as const,
});

const players = createQueryKeys('players', {
  check: (params: PlayerQueryDto = {}) => withParams(params),
  index: (params: PlayerQueryDto = {}) => withParams(params),
  me: (params: PlayerQueryDto = {}) => withParams(params),
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
  logsDetail: (params: SessionLogQueryDto & {
    id?: string | number;
    logId?: string | number;
  } = {}) => withParams(params),
});

export const queryKeys = mergeQueryKeys(
  players,
  campaigns,
  characters,
  currencyTransactions,
  health,
  icons,
  logHistories,
  sessions
);
