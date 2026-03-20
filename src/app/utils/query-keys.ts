import {
  createQueryKeys,
  mergeQueryKeys
} from '@lukemorales/query-key-factory';

const users = createQueryKeys('users', {
  detail: (userId: string) => [ userId, ],
  list: (params?: Record<string, unknown>) => ({ queryKey: [ params ], }),
  mine: null,
});

const campaigns = createQueryKeys('campaigns', {
  detail: (id: string) => [ id, ],
  list: (params?: Record<string, unknown>) => ({ queryKey: [ params ], }),
  mine: null,
});

const characters = createQueryKeys('characters', {
  detail: (id: string) => [ id, ],
  list: (params?: Record<string, unknown>) => ({ queryKey: [ params ], }),
  mine: null,
});

const health = createQueryKeys('health', {
  check: null,
});

export const queryKeys = mergeQueryKeys(users, campaigns, characters, health);
