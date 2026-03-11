import { appConfig } from '~/config/app.config';
import type { ApiResponse } from '~/types/common.types';
import { checkAndHandleApiError } from '~/utils/api-error-handler';

export async function useGet<TData = unknown>(
  url: string,
  body?: string | Record<string, any> | ReadableStream | Blob | ArrayBuffer | ArrayBufferView,
  callback?: (data: ApiResponse<TData> | undefined) => void,
  errorCallback?: (error: ApiResponse<TData>) => void,
  options?: {
    enabled?: boolean | Ref<boolean> | ComputedRef<boolean>;
  }
) {
  const token = useCookie('token');
  const authToken = token.value;

  const enabled = options?.enabled ?? true;
  const enabledValue = unref(enabled);

  const watchOptions = typeof enabled === 'object'
    ? [ enabled, ]
    : false;

  const { data: response, ...other } = await useFetch<ApiResponse<TData>>(url, {
    method: 'GET',
    baseURL: appConfig.api.route,
    ...(body && { body, }),
    immediate: enabledValue,
    watch: watchOptions,
    onRequest({ options: requestOptions, }) {
      if (authToken) {
        const headers = new Headers(requestOptions.headers);
        headers.set('Authorization', `Bearer ${authToken}`);
        requestOptions.headers = headers;
      }
    },
    onResponse({ response: res, }) {
      // 모든 응답이 HTTP 200이므로, ResponseType.error 필드를 확인하여 에러 처리
      if (res._data) {
        const hasError = checkAndHandleApiError(res._data, errorCallback);

        if (!hasError && callback) {
          // 에러가 없을 때만 성공 콜백 호출
          callback(res._data);
        }
      }
    },
    onResponseError({ response: errorResponse, }) {
      // 네트워크 에러 등 실제 HTTP 에러 처리
      if (errorCallback && errorResponse._data) {
        checkAndHandleApiError(errorResponse._data, errorCallback);
      }
    },
  });

  // enabled가 reactive인 경우 watch하여 자동으로 execute
  if (typeof enabled === 'object' && enabledValue === false) {
    watch(enabled, (newValue) => {
      if (newValue && other.status.value === 'idle') {
        other.execute();
      }
    });
  }

  return {
    response,
    ...other,
  };
}
