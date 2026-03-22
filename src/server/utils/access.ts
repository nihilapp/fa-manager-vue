export async function checkCommunityAccess(event: H3Event): Promise<BaseResponse> {
  const {
    user,
    error,
    isDevelopmentBypass,
    checkAdmin,
    canAccessSelf,
  } = await authHelper(event);

  if (error) {
    return error;
  }

  if (isDevelopmentBypass) {
    return BaseResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.OK);
  }

  if (!user) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.FORBIDDEN);
  }

  if (checkAdmin()) {
    return BaseResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.OK);
  }

  if (canAccessSelf()) {
    return BaseResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.OK);
  }

  return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.FORBIDDEN);
}
