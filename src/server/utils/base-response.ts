export class BaseApiResponse {
  static data<TData>(
    data: TData,
    code: RESPONSE_CODE,
    message: RESPONSE_MESSAGE
  ): import('../types/response.types').BaseApiResponse<TData> {
    return {
      data,
      error: false,
      code,
      message,
    };
  }

  static page<TData>(
    data: ListData<TData>,
    code: RESPONSE_CODE,
    message: RESPONSE_MESSAGE
  ): import('../types/response.types').BaseApiResponse<ListDataType<TData>> {
    return {
      data,
      error: false,
      code,
      message,
    };
  }

  static error(
    code: RESPONSE_CODE,
    message: RESPONSE_MESSAGE
  ): import('../types/response.types').BaseApiResponse<null> {
    return {
      data: null,
      error: true,
      code,
      message,
    };
  }
}
