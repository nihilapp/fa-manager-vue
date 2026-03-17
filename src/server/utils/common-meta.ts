function toDateOrCurrent(value: Date | string | null | undefined, current: Date | string | null | undefined) {
  if (value === undefined) {
    return current ?? null;
  }

  if (value === null) {
    return null;
  }

  return value instanceof Date
    ? value
    : new Date(value);
}

export function resolveCommonMetaUpdate(
  body: Partial<CommonInDto>,
  current: CommonOutDto,
  actorId?: number | null
) {
  return {
    useYn: body.useYn !== undefined
      ? body.useYn
      : (current.useYn ?? 'Y'),
    deleteYn: body.deleteYn !== undefined
      ? body.deleteYn
      : (current.deleteYn ?? 'N'),
    creatorId: body.creatorId !== undefined
      ? body.creatorId
      : (current.creatorId ?? null),
    createDate: toDateOrCurrent(body.createDate, current.createDate),
    updaterId: body.updaterId !== undefined
      ? body.updaterId
      : (actorId ?? current.updaterId ?? null),
    updateDate: body.updateDate !== undefined
      ? toDateOrCurrent(body.updateDate, current.updateDate)
      : new Date(),
    deleterId: body.deleterId !== undefined
      ? body.deleterId
      : (current.deleterId ?? null),
    deleteDate: body.deleteDate !== undefined
      ? toDateOrCurrent(body.deleteDate, current.deleteDate)
      : (current.deleteDate ?? null),
  };
}
