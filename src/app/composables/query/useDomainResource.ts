interface RefetchableRequest {
  refetch?: () => Promise<unknown>;
}

export const isApiRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object'
  && value !== null
);

const isListPayload = <T>(value: unknown): value is ListData<T> => (
  isApiRecord(value)
  && Array.isArray(value.list)
);

const matchesGuard = <T>(value: unknown, guard?: (item: unknown) => item is T): value is T => (
  guard
    ? guard(value)
    : true
);

export const extractItemPayload = <T>(
  value: unknown,
  guard?: (item: unknown) => item is T
): T | null => {
  if (isListPayload(value)) {
    const item = value.list.find((entry) => matchesGuard(entry, guard));
    return (item as T | undefined) ?? null;
  }

  if (Array.isArray(value)) {
    const item = value.find((entry) => matchesGuard(entry, guard));
    return (item as T | undefined) ?? null;
  }

  if (!matchesGuard(value, guard)) {
    return null;
  }

  return (value as T | null) ?? null;
};

export const extractItemById = <T extends { id: number | string }>(
  value: unknown,
  id: number | string,
  guard?: (item: unknown) => item is T
): T | null => {
  if (isListPayload(value)) {
    const item = value.list.find((entry) => {
      if (!matchesGuard(entry, guard)) {
        return false;
      }

      return String(entry.id) === String(id);
    });

    return (item as T | undefined) ?? null;
  }

  if (Array.isArray(value)) {
    const item = value.find((entry) => {
      if (!matchesGuard(entry, guard)) {
        return false;
      }

      return String(entry.id) === String(id);
    });

    return (item as T | undefined) ?? null;
  }

  if (!matchesGuard(value, guard)) {
    return null;
  }

  return String(value.id) === String(id)
    ? value
    : null;
};

export const extractListPayload = <T>(
  value: unknown,
  guard?: (item: unknown) => item is T
): {
  list: T[];
  pageData: ListPageData<T> | null;
} => {
  if (isListPayload(value)) {
    const filteredList = guard
      ? value.list.filter((entry): entry is T => guard(entry))
      : value.list as T[];

    if (filteredList.length > 0 || value.list.length === 0 || !guard) {
      const {
        list: _list,
        ...pageData
      } = value;

      return {
        list: filteredList,
        pageData: pageData as ListPageData<T>,
      };
    }
  }

  if (Array.isArray(value)) {
    const filteredList = guard
      ? value.filter((entry): entry is T => guard(entry))
      : value as T[];

    return {
      list: filteredList,
      pageData: null,
    };
  }

  const item = extractItemPayload<T>(value, guard);

  return {
    list: item
      ? [ item, ]
      : [],
    pageData: null,
  };
};

export const refetchApiRequests = async (...requests: Array<RefetchableRequest | null | undefined>) => {
  const jobs: Promise<unknown>[] = [];

  for (const request of requests) {
    if (request?.refetch) {
      jobs.push(request.refetch());
    }
  }

  await Promise.all(jobs);
};
