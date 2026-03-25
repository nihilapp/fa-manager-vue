type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue | QueryValue[]>;

export interface UseGetReturn<TData> {
  data: Ref<BaseApiResponse<TData> | undefined>;
  response: Ref<BaseApiResponse<TData> | undefined>;
  error: Ref<ApiErrorResponse | undefined>;
  pending: Ref<boolean>;
  status: Ref<ApiRequestStatus>;
  execute: () => Promise<BaseApiResponse<TData> | undefined>;
  refresh: () => Promise<BaseApiResponse<TData> | undefined>;
  refetch: () => Promise<BaseApiResponse<TData> | undefined>;
  clear: () => void;
};

export interface UseGetOptions<TData> {
  api: string;
  enabled?: ApiRequestEnabled;
  fetcher?: () => Promise<BaseApiResponse<TData>>;
  query?: QueryParams | Ref<QueryParams | undefined> | (() => QueryParams | undefined);
  key?: ApiRequestKey;
  staleTime?: number;
  gcTime?: number;
  onSuccess?: (data: BaseResponse<TData>) => void;
  onError?: (error: ApiErrorResponse) => void;
}

export async function useGet<TData = unknown>({
  api,
  enabled,
  fetcher,
  query,
  key,
  staleTime,
  gcTime,
  onSuccess,
  onError,
}: UseGetOptions<TData>): Promise<UseGetReturn<TData>> {
  void enabled;
  void staleTime;
  void gcTime;

  const response = ref<BaseApiResponse<TData>>();
  const error = ref<ApiErrorResponse>();
  const pending = ref(false);
  const status = ref<ApiRequestStatus>('idle');
  const cacheKey = computed(() => key
    ? (Array.isArray(key)
      ? JSON.stringify(key)
      : String(key))
    : JSON.stringify([ 'get', api, toValue(query), ]));

  const request = useFetch<BaseApiResponse<TData>>(api, {
    ...createApiFetchOptions({
      method: 'GET',
      query: computed(() => toValue(query)),
    }),
    key: cacheKey,
    immediate: false,
    watch: false,
    dedupe: 'cancel',
    deep: false,
    getCachedData: () => undefined,
    $fetch: async (requestInfo, options) =>
      fetcher
        ? await fetcher()
        : await $fetch<BaseApiResponse<TData>>(requestInfo, options),
  });

  const execute = async () => {
    pending.value = true;
    status.value = 'pending';
    error.value = undefined;

    try {
      await request.execute();

      if (request.error.value) {
        error.value = handleApiRequestError(request.error.value, onError);
        status.value = 'error';
        return undefined;
      }

      response.value = handleApiResponse(request.data.value, {
        onSuccess,
        onError,
      });
      status.value = response.value?.error
        ? 'error'
        : 'success';
    }
    catch (requestError) {
      error.value = handleApiRequestError(requestError, onError);
      status.value = 'error';
      return undefined;
    }
    finally {
      pending.value = false;
    }

    return response.value;
  };

  const clear = () => {
    request.clear();
    clearNuxtData(cacheKey.value);
    response.value = undefined;
    error.value = undefined;
    pending.value = false;
    status.value = 'idle';
  };

  const refetch = async () => {
    clear();

    return await execute();
  };

  return {
    data: response,
    response,
    error,
    pending,
    status,
    execute,
    refresh: refetch,
    refetch,
    clear,
  };
}
