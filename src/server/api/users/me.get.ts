export default defineEventHandler(async (event) => {
  const { user, error, } = await authHelper(event);

  if (error) {
    return error;
  }

  return BaseResponse.data(user, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_MY_INFO_SUCCESS);
});
