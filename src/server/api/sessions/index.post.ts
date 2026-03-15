export default defineEventHandler(async (event) => {
  const discordId = event.req.headers.get('X-Discord-ID');
  const body = await readBody<SessionInDto>(event);

  if (!discordId) {
    return BaseResponse.error(RESPONSE_CODE.UNAUTHORIZED, RESPONSE_MESSAGE.REQUIRE_DISCORD_ID);
  }

  const { user, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  // 2. 캠페인 조회 및 마스터 권한 확인
  const campaign = await db.query.campaignsTable.findFirst({
    where: (table, { eq, }) => eq(table.id, body.campaignId!),
  });

  if (!campaign) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CAMPAIGN_NOT_FOUND);
  }

  if (!hasPermission(campaign.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.SESSION_FORBIDDEN);
  }

  // 3. 세션 생성
  const [ session, ] = await db.insert(sessionsTable).values({
    ...body,
    creatorId: user!.id,
  }).returning();

  return BaseResponse.data(session, RESPONSE_CODE.CREATED, RESPONSE_MESSAGE.CREATE_SESSION_SUCCESS);
});
