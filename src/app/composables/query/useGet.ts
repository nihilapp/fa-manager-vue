import type { UseQueryReturnType } from '@tanstack/vue-query';
import { useQuery } from '@tanstack/vue-query';
import { computed, toValue } from 'vue';

import {
  type ApiRequestEnabled,
  type ApiRequestKey,
  handleApiRequestError,
  handleApiResponse,
} from './useApiRequest';
import { apiClient } from '@app/utils/api-client';

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue | QueryValue[]>;

export type UseGetQueryResult<TData> = UseQueryReturnType<BaseResponse<TData> | undefined, unknown>;

export type UseGetReturn<TData> = UseGetQueryResult<TData> & {
  response: UseGetQueryResult<TData>['data'];
  execute: UseGetQueryResult<TData>['refetch'];
};

export interface UseGetOptions<TData> {
  api: string;
  enabled?: ApiRequestEnabled;
  fetcher?: () => Promise<BaseResponse<TData>>;
  query?: QueryParams | Ref<QueryParams | undefined> | (() => QueryParams | undefined);
  key?: ApiRequestKey;
  staleTime?: number;
  gcTime?: number;
  onSuccess?: (data: BaseResponse<TData>) => void;
  onError?: (error: BaseResponse<TData>) => void;
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
  const queryResult: UseGetQueryResult<TData> = useQuery({
    queryKey: computed(() => {
      const queryParams = toValue(query);

      if (key) {
        return Array.isArray(key) ? key : [ key, queryParams, ];
      }

      return [ 'get', api, queryParams, ];
    }),
    queryFn: async () => {
      try {
        const queryParams = toValue(query);
        const response = fetcher
          ? await fetcher()
          : (await apiClient.get<BaseResponse<TData>>(api, {
            params: queryParams,
          })).data;

        return handleApiResponse(response, {
          onSuccess,
          onError,
        });
      }
      catch (error) {
        handleApiRequestError(error, onError);
        throw error;
      }
    },
    enabled: computed(() => toValue(enabled) ?? true),
    staleTime,
    gcTime,
  });

  // await useGet 형식을 지원하기 위해 suspense 호출
  // SSR 환경이거나 enabled가 true인 경우에만 수행
  const isEnabled = toValue(enabled) ?? true;
  if (isEnabled) {
    try {
      await queryResult.suspense();
    }
    catch (e) {
      // 에러는 onSuccess 내의 checkAndHandleApiError에서 처리됨
    }
  }

  return {
    response: queryResult.data,
    execute: queryResult.refetch,
    ...queryResult,
  };
}
