import type { UseMutationReturnType } from '@tanstack/vue-query';

export type UseDeleteMutationResult<TData, TBody> = UseMutationReturnType<
  BaseResponse<TData> | undefined,
  unknown,
  TBody | undefined,
  unknown
>;

export type UseDeleteReturn<TData, TBody> = UseDeleteMutationResult<TData, TBody> & {
  response: UseDeleteMutationResult<TData, TBody>['data'];
  execute: UseDeleteMutationResult<TData, TBody>['mutateAsync'];
};

export interface UseDeleteOptions<TData, TBody = ApiRequestBody> {
  api: string;
  enabled?: ApiRequestEnabled;
  key?: ApiRequestKey;
  fetcher?: (body?: TBody) => Promise<BaseResponse<TData>>;
  onSuccess?: (data: BaseResponse<TData>) => void;
  onError?: (error: BaseResponse<TData>) => void;
}

export function useDelete<TData = unknown, TBody = ApiRequestBody>({
  api,
  enabled,
  key,
  fetcher,
  onSuccess,
  onError,
}: UseDeleteOptions<TData, TBody>): UseDeleteReturn<TData, TBody> {
  const isEnabled = computed(() => toValue(enabled) ?? true);
  const mutation: UseDeleteMutationResult<TData, TBody> = useMutation({
    mutationKey: key ? (Array.isArray(key) ? key : [ key, api, ]) : [ 'delete', api, ],
    mutationFn: async (body?: TBody) => {
      if (!isEnabled.value) {
        return undefined;
      }

      return fetcher
        ? fetcher(body)
        : (await apiClient.delete<BaseResponse<TData>>(api, {
          data: body,
        })).data;
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
