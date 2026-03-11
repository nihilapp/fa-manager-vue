import { appConfig } from '~/config/app.config';
import type { ApiResponse } from '~/types/common.types';
import { checkAndHandleApiError } from '~/utils/api-error-handler';

export function usePut<TData = unknown>(url: string, callback?: (data: ApiResponse<TData>) => void, errorCallback?: (error: ApiResponse<TData>) => void) {
  const token = useCookie('token');
  const bodyRef = ref<string | Record<string, any> | ReadableStream | Blob | ArrayBuffer | ArrayBufferView | null | undefined>(undefined);

  const { data: response, status, error, execute, ...other } = useAsyncData<ApiResponse<TData>>(
    `put-${url}`,
    async () => {
      const authToken = token.value;
      const headers: HeadersInit = {};

      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      return await $fetch<ApiResponse<TData>>(url, {
        method: 'PUT',
        baseURL: appConfig.api.route,
        body: bodyRef.value,
        headers,
      });
    },
    {
      immediate: false,
    }
  );

  const put = async (body: string | Record<string, any> | ReadableStream | Blob | ArrayBuffer | ArrayBufferView) => {
    bodyRef.value = body;
    try {
      await execute();

      // 모든 응답이 HTTP 200이므로, ResponseType.error 필드를 확인하여 에러 처리
      if (response.value) {
        const hasError = checkAndHandleApiError(response.value, errorCallback);

        if (!hasError && callback) {
          // 에러가 없을 때만 성공 콜백 호출
          callback(response.value);
        }
      }

      return response.value;
    }
    catch (err: any) {
      // 네트워크 에러 등 실제 HTTP 에러 처리
      if (errorCallback) {
        if (err?.response?._data) {
          checkAndHandleApiError(err.response._data, errorCallback);
        }
        else if (err && typeof err === 'object' && 'error' in err) {
          // ResponseType 형태의 에러인 경우
          checkAndHandleApiError(err as ApiResponse<TData>, errorCallback);
        }
      }
      throw err;
    }
  };

  return {
    put,
    response,
    status,
    error,
    ...other,
  };
}
