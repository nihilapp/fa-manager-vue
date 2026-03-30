export async function checkCommunityAccess(event: H3Event): Promise<BaseApiResponse> {
  const {
    user,
    error,
    isDevelopmentBypass,
    checkAdmin,
    canAccessSelf,
  } = await authHelper(event);

  if (isDevelopmentBypass) {
    return BaseApiResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.OK);
  }

  if (error) {
    return error;
  }

  if (!user) {
    return BaseApiResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.FORBIDDEN);
  }

  if (checkAdmin()) {
    return BaseApiResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.OK);
  }

  if (canAccessSelf()) {
    return BaseApiResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.OK);
  }

  return BaseApiResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.FORBIDDEN);
}
