export function createResponse<T>(
  data: T,
  error: boolean,
  message: string,
  code: ResponseCode
): ApiResponse<T> {
  return {
    error,
    message,
    data,
    code,
    responseTime: Date.now(),
  };
}
