function toDateOrCurrent(
  value: Date | string | null | undefined,
  current: Date | string | null | undefined
): Date | undefined {
  // 값이 아예 없거나 null이면 undefined를 반환하여 DB 수정을 방지합니다.
  if (value === undefined || value === null) {
    if (current === undefined || current === null) return undefined;
    return current instanceof Date
      ? current
      : new Date(current);
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
    // 1. 상태 값 처리: null을 허용하지 않도록 "Y" | "N"으로 강제
    useYn: (body.useYn ?? current.useYn ?? 'Y') as 'Y' | 'N',
    deleteYn: (body.deleteYn ?? current.deleteYn ?? 'N') as 'Y' | 'N',

    // 2. 식별자 처리: null 대신 undefined를 반환하여 Drizzle Update 오류 방지
    creatorId: body.creatorId ?? current.creatorId ?? undefined,
    updaterId: body.updaterId ?? actorId ?? current.updaterId ?? undefined,
    deleterId: body.deleterId ?? current.deleterId ?? undefined,

    // 3. 날짜 처리: toDateOrCurrent 유틸리티를 통해 안전하게 변환
    createDate: toDateOrCurrent(body.createDate, current.createDate),

    updateDate: body.updateDate !== undefined
      ? toDateOrCurrent(body.updateDate, current.updateDate)
      : new Date(), // 업데이트 시 명시적 요청 없으면 현재 시간

    deleteDate: body.deleteDate !== undefined
      ? toDateOrCurrent(body.deleteDate, current.deleteDate)
      : (current.deleteDate
        ? new Date(current.deleteDate)
        : undefined),
  };
}
