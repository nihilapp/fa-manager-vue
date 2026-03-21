import { navigateTo } from '#imports';

import { RESPONSE_CODE } from '@server/constant/response-code';

function resolveMessage(message: BaseResponse['message'] | string): string {
  return typeof message === 'string'
    ? message
    : String(message);
}

function resolveRedirectPath(code: BaseResponse['code']): string | undefined {
  if (code === RESPONSE_CODE.UNAUTHORIZED) {
    return '/auth/signin';
  }

  return undefined;
}

function shouldLogApiError(code: BaseResponse['code']): boolean {
  return code === RESPONSE_CODE.FORBIDDEN
    || code === RESPONSE_CODE.INTERNAL_SERVER_ERROR
    || code === RESPONSE_CODE.BAD_GATEWAY;
}

/**
 * ResponseType의 에러 여부 확인 및 처리
 * @param response - API 응답
 * @param errorCallback - 에러 콜백 함수
 * @returns 에러가 있으면 true, 없으면 false
 */
export function checkAndHandleApiError<TData = unknown>(
  response: BaseResponse<TData> | undefined,
  errorCallback?: (error: BaseResponse<TData>) => void
): boolean {
  if (!response) {
    return false;
  }

  if (response.error) {
    const redirectPath = resolveRedirectPath(response.code);

    // 리다이렉트 필요 시 처리
    if (redirectPath) {
      // 클라이언트 사이드에서만 리다이렉트
      if (import.meta.client) {
        navigateTo(redirectPath);
      }
    }

    // 로깅 필요 시 처리
    if (shouldLogApiError(response.code)) {
      console.error('[API Error]', {
        code: response.code,
        message: response.message,
        responseTime: response.responseTime,
      });
    }

    if (
      response.code === RESPONSE_CODE.OK
      || response.code === RESPONSE_CODE.CREATED
      || response.code === RESPONSE_CODE.NO_CONTENT
    ) {
      console.warn('[API Warning]', '에러 응답인데 성공 코드가 포함되었습니다.', {
        code: response.code,
        message: resolveMessage(response.message),
      });
    }

    // 에러 콜백 호출
    if (errorCallback) {
      errorCallback(response);
    }

    return true;
  }

  return false;
}
