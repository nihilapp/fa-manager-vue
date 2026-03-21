import type { UseMutationReturnType } from '@tanstack/vue-query';
import { useMutation } from '@tanstack/vue-query';
import { computed, toValue } from 'vue';

import {
  type ApiRequestBody,
  type ApiRequestEnabled,
  type ApiRequestKey,
  handleApiRequestError,
  handleApiResponse,
} from './useApiRequest';
import { apiClient } from '@app/utils/api-client';

export type UsePutMutationResult<TData, TBody> = UseMutationReturnType<
  BaseResponse<TData> | undefined,
  unknown,
  TBody | undefined,
  unknown
>;

export type UsePutReturn<TData, TBody> = UsePutMutationResult<TData, TBody> & {
  response: UsePutMutationResult<TData, TBody>['data'];
  execute: UsePutMutationResult<TData, TBody>['mutateAsync'];
};

export interface UsePutOptions<TData, TBody = ApiRequestBody> {
  api: string;
  enabled?: ApiRequestEnabled;
  key?: ApiRequestKey;
  fetcher?: (body?: TBody) => Promise<BaseResponse<TData>>;
  onSuccess?: (data: BaseResponse<TData>) => void;
  onError?: (error: BaseResponse<TData>) => void;
}

export function usePut<TData = unknown, TBody = ApiRequestBody>({
  api,
  enabled,
  key,
  fetcher,
  onSuccess,
  onError,
}: UsePutOptions<TData, TBody>): UsePutReturn<TData, TBody> {
  const isEnabled = computed(() => toValue(enabled) ?? true);
  const mutation: UsePutMutationResult<TData, TBody> = useMutation({
    mutationKey: key ? (Array.isArray(key) ? key : [ key, api, ]) : [ 'put', api, ],
    mutationFn: async (body?: TBody) => {
      if (!isEnabled.value) {
        return undefined;
      }

      return fetcher
        ? fetcher(body)
        : (await apiClient.put<BaseResponse<TData>>(api, body)).data;
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
