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

export type UsePatchMutationResult<TData, TBody> = UseMutationReturnType<
  BaseResponse<TData> | undefined,
  unknown,
  TBody | undefined,
  unknown
>;

export type UsePatchReturn<TData, TBody> = UsePatchMutationResult<TData, TBody> & {
  response: UsePatchMutationResult<TData, TBody>['data'];
  execute: UsePatchMutationResult<TData, TBody>['mutateAsync'];
};

export interface UsePatchOptions<TData, TBody = ApiRequestBody> {
  api: string;
  enabled?: ApiRequestEnabled;
  key?: ApiRequestKey;
  fetcher?: (body?: TBody) => Promise<BaseResponse<TData>>;
  onSuccess?: (data: BaseResponse<TData>) => void;
  onError?: (error: BaseResponse<TData>) => void;
}

export function usePatch<TData = unknown, TBody = ApiRequestBody>({
  api,
  enabled,
  key,
  fetcher,
  onSuccess,
  onError,
}: UsePatchOptions<TData, TBody>): UsePatchReturn<TData, TBody> {
  const isEnabled = computed(() => toValue(enabled) ?? true);
  const mutation: UsePatchMutationResult<TData, TBody> = useMutation({
    mutationKey: key ? (Array.isArray(key) ? key : [ key, api, ]) : [ 'patch', api, ],
    mutationFn: async (body?: TBody) => {
      if (!isEnabled.value) {
        return undefined;
      }

      return fetcher
        ? fetcher(body)
        : (await apiClient.patch<BaseResponse<TData>>(api, body)).data;
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
