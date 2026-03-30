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
  onSuccess?: (response: BaseApiResponse<TData>) => void;
  onError?: (error: ApiErrorResponse) => void;
}

export const useGet = <TData = unknown>({
  api,
  enabled,
  fetcher,
  query,
  key,
  staleTime,
  gcTime,
  onSuccess,
  onError,
}: UseGetOptions<TData>): UseGetReturn<TData> => {
  void enabled;
  void staleTime;
  void gcTime;

  const response = ref<BaseApiResponse<TData>>();
  const error = ref<ApiErrorResponse>();
  const pending = ref(false);
  const status = ref<ApiRequestStatus>('idle');
  const isEnabled = computed(() => toValue(enabled) ?? true);

  void key;

  const execute = async () => {
    if (!isEnabled.value) {
      return response.value;
    }

    pending.value = true;
    status.value = 'pending';
    error.value = undefined;

    try {
      if (fetcher) {
        response.value = handleApiResponse(await fetcher(), {
          onSuccess,
          onError,
        });
        status.value = response.value?.error
          ? 'error'
          : 'success';
        return response.value;
      }

      const result = await $fetch<BaseApiResponse<TData>>(api, createApiFetchOptions({
        method: 'GET',
        query: toValue(query),
      }));

      response.value = handleApiResponse(result, {
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
    response.value = undefined;
    error.value = undefined;
    pending.value = false;
    status.value = 'idle';
  };

  const refetch = () => {
    clear();

    return execute();
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
};
