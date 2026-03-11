/**
 * 감사 로그(LogHistory)를 생성합니다.
 */
export const createAuditLog = async (
  tableName: string,
  targetId: number | bigint,
  actionType: 'INSERT' | 'UPDATE' | 'DELETE' | 'ROLLBACK',
  oldData: Record<string, unknown> | null = null,
  newData: Record<string, unknown> | null = null,
  userId: number | bigint | null = null
): Promise<void> => {
  try {
    const oldDataStr = oldData
      ? JSON.stringify(oldData)
      : null;
    const newDataStr = newData
      ? JSON.stringify(newData)
      : null;

    // prisma가 auto-import되도록 구성되어 있다고 가정합니다.
    await prisma.logHistory.create({
      data: {
        tableName,
        targetId: BigInt(targetId),
        actionType,
        oldData: oldDataStr,
        newData: newDataStr,
        userId: userId
          ? BigInt(userId)
          : null,
      },
    });
  }
  catch (error) {
    // 감사 로그 생성이 실패하더라도 전체 시스템의 데이터 흐름이 중단되지 않도록 오류만 출력합니다.
    console.error(`[Audit Log Error] Failed to create log for ${tableName}:`, error);
  }
};
