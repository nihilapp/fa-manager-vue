type Primitive = string | number | boolean;

export type ApiRequestBody
  = string
    | Record<string, unknown>
    | Primitive[]
    | ReadableStream
    | Blob
    | ArrayBuffer
    | ArrayBufferView
    | FormData
    | URLSearchParams
    | null
    | undefined;

export type ApiRequestEnabled = boolean | Ref<boolean> | (() => boolean);

export type ApiRequestKey = string | unknown[] | readonly unknown[];
export type ApiRequestStatus = 'idle' | 'pending' | 'success' | 'error';
export type ApiErrorResponse = BaseResponse<null>;
export type BaseApiResponse<TData> = BaseResponse<TData> | ApiErrorResponse;

export interface ApiRequestHandlers<TData> {
  onSuccess?: (data: BaseResponse<TData>) => void;
  onError?: (error: ApiErrorResponse) => void;
}

export function createApiRequestHeaders() {
  const token = useCookie<string | null>('token');

  return token.value
    ? { Authorization: `Bearer ${token.value}`, }
    : undefined;
}

export function createApiFetchOptions<TBody = ApiRequestBody>(options: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: unknown;
  body?: TBody;
}) {
  const {
    method,
    query,
    body,
  } = options;

  return {
    baseURL: appConfig.api.route,
    method,
    headers: createApiRequestHeaders(),
    query,
    body,
  };
}

function extractApiErrorData(error: unknown): ApiErrorResponse | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const responseData = 'response' in error && typeof error.response === 'object' && error.response
    ? (error.response as { data?: ApiErrorResponse }).data
    : undefined;

  if (responseData) {
    return responseData;
  }

  const directData = 'data' in error
    ? (error as { data?: ApiErrorResponse }).data
    : undefined;

  return directData;
}

export function handleApiResponse<TData>(
  response: BaseApiResponse<TData> | undefined,
  handlers: ApiRequestHandlers<TData> = {}
): BaseApiResponse<TData> | undefined {
  if (!response) {
    return response;
  }

  const hasError = checkAndHandleApiError(response, handlers.onError);

  if (!hasError) {
    handlers.onSuccess?.(response);
  }

  return response;
}

export function handleApiRequestError<TData>(
  error: unknown,
  onError?: (error: ApiErrorResponse) => void
): ApiErrorResponse | undefined {
  const errorData = extractApiErrorData(error);

  if (!errorData) {
    return undefined;
  }

  checkAndHandleApiError(errorData, onError);

  return errorData;
}
