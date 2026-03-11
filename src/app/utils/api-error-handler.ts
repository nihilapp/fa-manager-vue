import type { ApiResponse, ResponseCode } from '~/types/common.types';

/**
 * API 에러 처리 결과
 */
export interface ApiErrorHandleResult {
  shouldRedirect: boolean;
  redirectPath?: string;
  shouldShowToast: boolean;
  toastMessage?: string;
  shouldLog: boolean;
}

/**
 * API 응답 코드에 따른 처리 로직
 *
 * 백엔드의 ResponseCode Enum을 기준으로 에러 처리를 수행합니다.
 * 성공 코드(OK, CREATED, ACCEPTED, NO_CONTENT)는 이 함수에서 처리하지 않습니다.
 *
 * @param code - 응답 코드
 * @param message - 에러 메시지
 * @returns 처리 결과
 */
export function handleApiError(code: ResponseCode, message: string): ApiErrorHandleResult {
  const result: ApiErrorHandleResult = {
    shouldRedirect: false,
    shouldShowToast: true,
    toastMessage: message,
    shouldLog: false,
  };

  switch (code) {
  // ============================================
  // 클라이언트 에러 (4xx)
  // ============================================
    case 'BAD_REQUEST': // 400
      result.toastMessage = message || '잘못된 요청입니다.';
      break;

    case 'UNAUTHORIZED': // 401
      result.shouldRedirect = true;
      result.redirectPath = '/auth/signin';
      result.toastMessage = message || '로그인이 필요합니다.';
      break;

    case 'FORBIDDEN': // 403
      result.toastMessage = message || '권한이 없습니다.';
      result.shouldLog = true;
      break;

    case 'NOT_FOUND': // 404
      result.toastMessage = message || '요청한 리소스를 찾을 수 없습니다.';
      break;

    case 'METHOD_NOT_ALLOWED': // 405
      result.toastMessage = message || '허용되지 않은 요청 방법입니다.';
      result.shouldLog = true;
      break;

    case 'CONFLICT': // 409
      result.toastMessage = message || '리소스 충돌이 발생했습니다. (중복 등)';
      break;

    case 'VALIDATION_ERROR': // 422
    case 'UNPROCESSABLE_ENTITY': // 422
      result.toastMessage = message || '입력값을 확인해주세요.';
      break;

      // ============================================
      // 서버 에러 (5xx)
      // ============================================
    case 'INTERNAL_SERVER_ERROR': // 500
      result.toastMessage = message || '서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.';
      result.shouldLog = true;
      break;

    case 'BAD_GATEWAY': // 502
      result.toastMessage = message || '게이트웨이 오류가 발생했습니다.';
      result.shouldLog = true;
      break;

    case 'SERVICE_UNAVAILABLE': // 503
      result.toastMessage = message || '서비스를 사용할 수 없습니다. 잠시 후 다시 시도해주세요.';
      result.shouldLog = true;
      break;

      // ============================================
      // 기타 에러
      // ============================================
    case 'ERROR':
      result.toastMessage = message || '알 수 없는 에러가 발생했습니다.';
      result.shouldLog = true;
      break;

      // ============================================
      // 성공 코드는 처리하지 않음 (이 함수는 에러 처리용)
      // ============================================
    case 'OK':
    case 'CREATED':
    case 'ACCEPTED':
    case 'NO_CONTENT':
    default:
    // 성공 코드이거나 알 수 없는 코드인 경우
    // error 필드가 true인데 성공 코드가 온다면 로깅
      if (code === 'OK' || code === 'CREATED' || code === 'ACCEPTED' || code === 'NO_CONTENT') {
        result.shouldLog = true;
        console.warn('[API Warning]', '에러 응답인데 성공 코드가 포함되었습니다.', { code, message, });
      }
      result.toastMessage = message || '알 수 없는 에러가 발생했습니다.';
      result.shouldLog = true;
      break;
  }

  return result;
}

/**
 * ResponseType의 에러 여부 확인 및 처리
 * @param response - API 응답
 * @param errorCallback - 에러 콜백 함수
 * @returns 에러가 있으면 true, 없으면 false
 */
export function checkAndHandleApiError<TData = unknown>(
  response: ApiResponse<TData> | undefined,
  errorCallback?: (error: ApiResponse<TData>) => void
): boolean {
  if (!response) {
    return false;
  }

  if (response.error) {
    const handleResult = handleApiError(response.code, response.message);

    // 리다이렉트 필요 시 처리
    if (handleResult.shouldRedirect && handleResult.redirectPath) {
      // 클라이언트 사이드에서만 리다이렉트
      if (import.meta.client) {
        navigateTo(handleResult.redirectPath);
      }
    }

    // 로깅 필요 시 처리
    if (handleResult.shouldLog) {
      console.error('[API Error]', {
        code: response.code,
        message: response.message,
        responseTime: response.responseTime,
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

/**
 * ResponseType에서 에러를 throw하는 헬퍼 함수
 * @param response - API 응답
 * @throws ResponseType (에러인 경우)
 */
export function throwIfError<TData = unknown>(response: ApiResponse<TData> | undefined): void {
  if (response && response.error) {
    // 에러 처리를 수행하되, throw는 하지 않음 (콜백으로 처리)
    checkAndHandleApiError(response);
  }
}
