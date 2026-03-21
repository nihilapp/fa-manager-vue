import axios from 'axios';

import { checkAndHandleApiError } from '@app/utils/api-error-handler';

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

export interface ApiRequestHandlers<TData> {
  onSuccess?: (data: BaseResponse<TData>) => void;
  onError?: (error: BaseResponse<TData>) => void;
}

export function handleApiResponse<TData>(
  response: BaseResponse<TData> | undefined,
  handlers: ApiRequestHandlers<TData> = {}
): BaseResponse<TData> | undefined {
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
  onError?: (error: BaseResponse<TData>) => void
): BaseResponse<TData> | undefined {
  if (!axios.isAxiosError<BaseResponse<TData>>(error)) {
    return undefined;
  }

  const errorData = error.response?.data;

  if (!errorData) {
    return undefined;
  }

  checkAndHandleApiError(errorData, onError);

  return errorData;
}
