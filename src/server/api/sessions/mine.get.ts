export default defineEventHandler(async (event) => {
  const query = getQuery<SessionQueryDto>(event);
  query.deleteYn = query.deleteYn || 'N';

  const { user, error, } = await authHelper(event);
  if (error) return error;

  const ownedCampaigns = await db.query.campaignsTable.findMany({
    where: (table, { eq, and, }) => and(
      eq(table.userId, user!.id),
      eq(table.deleteYn, 'N')
    ),
    columns: {
      id: true,
    },
  });

  const campaignIds = ownedCampaigns
    .map((campaign) => campaign.id)
    .filter((id): id is number => Number.isFinite(id));

  const page = Number(query.page || 0);
  const size = Number(query.size || 0);
  const isPaged = size > 0;

  if (campaignIds.length === 0) {
    const listData = new ListData<SessionOutDto>(
      [],
      0,
      0,
      isPaged
        ? page
        : 0,
      isPaged
        ? size
        : 0
    );

    return BaseApiResponse.page(listData, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_SESSION_LIST_SUCCESS);
  }

  const columns = getTableColumns(sessionsTable);
  const baseWhere = buildDrizzleWhere<SessionQueryDto>(query, {
    id: 'eq',
    idList: 'in',
    campaignId: 'eq',
    no: 'eq',
    status: 'dynamic',
    name: 'like',
    useYn: 'eq',
    deleteYn: 'eq',
  }, columns);

  const ownerWhere = inArray(sessionsTable.campaignId, campaignIds);
  const where = baseWhere
    ? and(baseWhere, ownerWhere)
    : ownerWhere;

  const totalRes = await db
    .select({ count: count(), })
    .from(sessionsTable)
    .where(ownerWhere);
  const totalElements = totalRes[0]?.count ?? 0;

  const filteredRes = await db
    .select({ count: count(), })
    .from(sessionsTable)
    .where(where);
  const filteredElements = filteredRes[0]?.count ?? 0;

  const list = await db.query.sessionsTable.findMany({
    where,
    orderBy: sortHelper(query.sort || '', columns) as SQL[],
    limit: isPaged
      ? size
      : undefined,
    offset: isPaged
      ? page * size
      : undefined,
    with: {
      campaign: true,
      players: {
        with: {
          character: true,
          user: true,
        },
      },
    },
  });

  const listData = new ListData<SessionOutDto>(
    list as SessionOutDto[],
    totalElements,
    filteredElements,
    isPaged
      ? page
      : 0,
    isPaged
      ? size
      : 0
  );

  return BaseApiResponse.page(listData, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_SESSION_LIST_SUCCESS);
});
