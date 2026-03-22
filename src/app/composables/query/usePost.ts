import type { UseMutationReturnType } from '@tanstack/vue-query';

export type UsePostMutationResult<TData, TBody> = UseMutationReturnType<
  BaseResponse<TData> | undefined,
  unknown,
  TBody | undefined,
  unknown
>;

export type UsePostReturn<TData, TBody> = UsePostMutationResult<TData, TBody> & {
  response: UsePostMutationResult<TData, TBody>['data'];
  execute: UsePostMutationResult<TData, TBody>['mutateAsync'];
};

export interface UsePostOptions<TData, TBody = ApiRequestBody> {
  api: string;
  enabled?: ApiRequestEnabled;
  key?: ApiRequestKey;
  fetcher?: (body?: TBody) => Promise<BaseResponse<TData>>;
  onSuccess?: (data: BaseResponse<TData>) => void;
  onError?: (error: BaseResponse<TData>) => void;
}

export function usePost<TData = unknown, TBody = ApiRequestBody>({
  api,
  enabled,
  key,
  fetcher,
  onSuccess,
  onError,
}: UsePostOptions<TData, TBody>): UsePostReturn<TData, TBody> {
  const isEnabled = computed(() => toValue(enabled) ?? true);
  const mutation: UsePostMutationResult<TData, TBody> = useMutation({
    mutationKey: key
      ? (Array.isArray(key)
        ? key
        : [ key, api, ])
      : [ 'post', api, ],
    mutationFn: async (body?: TBody) => {
      if (!isEnabled.value) {
        return undefined;
      }

      return fetcher
        ? fetcher(body)
        : (await apiClient.post<BaseResponse<TData>>(api, body)).data;
    },
    onSuccess: (data) => {
      handleApiResponse(data, {
        onSuccess,
        onError,
      });
    },
    onError: (error) => {
      handleApiRequestError(error, onError);
    },
  });

  return {
    response: mutation.data,
    execute: mutation.mutateAsync,
    ...mutation,
  };
}
