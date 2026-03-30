interface UsePostReturn<TData, TBody> {
  data: Ref<BaseApiResponse<TData> | undefined>;
  response: Ref<BaseApiResponse<TData> | undefined>;
  error: Ref<ApiErrorResponse | undefined>;
  pending: Ref<boolean>;
  status: Ref<ApiRequestStatus>;
  execute: (body?: TBody) => Promise<BaseApiResponse<TData> | undefined>;
  mutateAsync: (body?: TBody) => Promise<BaseApiResponse<TData> | undefined>;
  clear: () => void;
};

interface UsePostOptions<TData, TBody extends ApiRequestBody = ApiRequestBody> {
  api: string;
  enabled?: ApiRequestEnabled;
  key?: ApiRequestKey;
  fetcher?: (body?: TBody) => Promise<BaseApiResponse<TData>>;
  onSuccess?: (response: BaseApiResponse<TData>) => void;
  onError?: (error: ApiErrorResponse) => void;
}

const createUsePost = <TData = unknown, TBody extends ApiRequestBody = ApiRequestBody>({
  api,
  enabled,
  key,
  fetcher,
  onSuccess,
  onError,
}: UsePostOptions<TData, TBody>): UsePostReturn<TData, TBody> => {
  void key;

  const isEnabled = computed(() => toValue(enabled) ?? true);
  const response = ref<BaseApiResponse<TData>>();
  const error = ref<ApiErrorResponse>();
  const pending = ref(false);
  const status = ref<ApiRequestStatus>('idle');

  const execute = async (body?: TBody) => {
    if (!isEnabled.value) {
      return response.value;
    }

    pending.value = true;
    status.value = 'pending';
    error.value = undefined;

    try {
      const result = fetcher
        ? await fetcher(body)
        : await $fetch<BaseApiResponse<TData>>(api, createApiFetchOptions({
          method: 'POST',
          body,
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

  return {
    data: response,
    response,
    error,
    pending,
    status,
    execute,
    mutateAsync: execute,
    clear,
  };
};

export const usePost = createUsePost;
