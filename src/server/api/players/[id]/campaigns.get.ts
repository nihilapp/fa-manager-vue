export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  const query = getQuery<CampaignQueryDto>(event);
  query.deleteYn = query.deleteYn || 'N';

  const { isAdmin, error, } = await authHelper(event);
  if (error) return error;

  if (!isAdmin) {
    return BaseApiResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.PLAYER_FORBIDDEN);
  }

  if (!Number.isFinite(id)) {
    return BaseApiResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.BAD_REQUEST);
  }

  const player = await db.query.playersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, id),
      eq(table.deleteYn, 'N')
    ),
    columns: {
      id: true,
    },
  });

  if (!player) {
    return BaseApiResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.PLAYER_NOT_FOUND);
  }

  const memberRows = await db.query.campaignMembersTable.findMany({
    where: (table, { eq, and, }) => and(
      eq(table.userId, id),
      eq(table.deleteYn, 'N'),
      query.role
        ? eq(table.role, query.role)
        : undefined
    ),
    columns: {
      campaignId: true,
    },
  });

  const campaignIds = Array.from(new Set(memberRows
    .map((member) => member.campaignId)
    .filter((campaignId): campaignId is number => Number.isFinite(campaignId))));

  const page = Number(query.page || 0);
  const size = Number(query.size || 0);
  const isPaged = size > 0;

  if (campaignIds.length === 0) {
    const listData = new ListData<CampaignOutDto>([], 0, 0, isPaged
      ? page
      : 0, isPaged
      ? size
      : 0);
    return BaseApiResponse.page(listData, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_CAMPAIGN_LIST_SUCCESS);
  }

  const columns = getTableColumns(campaignsTable);
  const baseWhere = buildDrizzleWhere<CampaignQueryDto>(query, {
    id: 'eq',
    idList: 'in',
    name: 'like',
    status: 'eq',
    useYn: 'eq',
    deleteYn: 'eq',
    userId: 'eq',
  }, columns);

  const memberWhere = inArray(campaignsTable.id, campaignIds);
  const where = baseWhere
    ? and(baseWhere, memberWhere)
    : memberWhere;

  const totalRes = await db
    .select({ count: count(), })
    .from(campaignsTable)
    .where(memberWhere);
  const totalElements = totalRes[0]?.count ?? 0;

  const filteredRes = await db
    .select({ count: count(), })
    .from(campaignsTable)
    .where(where);
  const filteredElements = filteredRes[0]?.count ?? 0;

  const list = await db.query.campaignsTable.findMany({
    where,
    orderBy: sortHelper(query.sort || '', columns) as SQL[],
    limit: isPaged
      ? size
      : undefined,
    offset: isPaged
      ? page * size
      : undefined,
    with: {
      user: true,
    },
  });

  const listData = new ListData<CampaignOutDto>(
    list as CampaignOutDto[],
    totalElements,
    filteredElements,
    isPaged
      ? page
      : 0,
    isPaged
      ? size
      : 0
  );

  return BaseApiResponse.page(listData, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_CAMPAIGN_LIST_SUCCESS);
});
