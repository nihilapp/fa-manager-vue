import { RESPONSE_CODE } from '@server/constant/response-code';
import { RESPONSE_MESSAGE } from '@server/constant/response-message';

import { ListData } from './list-data';

export class BaseResponse {
  static data<TData>(
    data: TData,
    code: RESPONSE_CODE,
    message: RESPONSE_MESSAGE
  ): BaseResponseType<TData> {
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
  ): BaseResponseType<ListDataType<TData>> {
    return {
      data,
      error: false,
      code,
      message,
    };
  }

  static error(code: RESPONSE_CODE, message: RESPONSE_MESSAGE): BaseResponseType {
    return {
      data: null,
      error: true,
      code,
      message,
    };
  }
}
