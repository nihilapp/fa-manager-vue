export default defineEventHandler(async (event) => {
  const query = getQuery<CampaignQueryDto>(event);
  query.deleteYn = query.deleteYn || 'N';

  const { user, error, } = await authHelper(event);
  if (error) return error;

  const scopedQuery: CampaignQueryDto = {
    ...query,
    userId: user!.id,
  };

  const columns = getTableColumns(campaignsTable);
  const where = buildDrizzleWhere<CampaignQueryDto>(scopedQuery, {
    id: 'eq',
    idList: 'in',
    name: 'like',
    status: 'eq',
    useYn: 'eq',
    deleteYn: 'eq',
    userId: 'eq',
  }, columns);

  const totalRes = await db
    .select({ count: count(), })
    .from(campaignsTable)
    .where(eq(campaignsTable.userId, user!.id));
  const totalElements = totalRes[0]?.count ?? 0;

  const filteredRes = await db
    .select({ count: count(), })
    .from(campaignsTable)
    .where(where);
  const filteredElements = filteredRes[0]?.count ?? 0;

  const page = Number(query.page || 0);
  const size = Number(query.size || 0);
  const isPaged = size > 0;

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
      : null,
    isPaged
      ? size
      : null
  );

  return BaseResponse.page(listData, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_CAMPAIGN_LIST_SUCCESS);
});
