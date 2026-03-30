type Primitive = string | number | boolean;

export type ApiRequestBody
  = string
    | object
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
export type ApiRequestQuery
  = Record<string, unknown>
    | Ref<Record<string, unknown> | undefined>
    | ComputedRef<Record<string, unknown> | undefined>
    | undefined;

export type ApiRequestKey = string | unknown[] | readonly unknown[];
export type ApiRequestStatus = 'idle' | 'pending' | 'success' | 'error';
type BaseApiResponse<TData = null> = import('../../../server/types/response.types').BaseApiResponse<TData>;
type ApiErrorResponse = BaseApiResponse<null>;

export interface ApiRequestHandlers<TData> {
  onSuccess?: (response: BaseApiResponse<TData>) => void;
  onError?: (error: ApiErrorResponse) => void;
}

export const createApiRequestHeaders = () => {
  const token = useCookie<string | null>('token');

  return token.value
    ? { Authorization: `Bearer ${token.value}`, }
    : undefined;
};

export const createApiFetchOptions = <TBody extends ApiRequestBody = ApiRequestBody>(options: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: ApiRequestQuery;
  body?: TBody;
}) => {
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
};

const extractApiErrorData = (error: unknown): ApiErrorResponse | undefined => {
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
};

export const handleApiResponse = <TData>(
  response: BaseApiResponse<TData> | undefined,
  handlers: ApiRequestHandlers<TData> = {}
): BaseApiResponse<TData> | undefined => {
  if (!response) {
    return response;
  }

  const hasError = checkAndHandleApiError(response, handlers.onError);

  if (!hasError) {
    handlers.onSuccess?.(response);
  }

  return response;
};

export const handleApiRequestError = <TData>(
  error: unknown,
  onError?: (error: ApiErrorResponse) => void
): ApiErrorResponse | undefined => {
  const errorData = extractApiErrorData(error);

  if (!errorData) {
    return undefined;
  }

  checkAndHandleApiError(errorData, onError);

  return errorData;
};
