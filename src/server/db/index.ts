import { PrismaClient } from '@prisma/client';

// BigInt 타입을 JSON으로 변환할 때 에러가 나지 않도록 설정 (PostgreSQL BigInt 대응)
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? [ 'query', 'error', 'warn', ]
    : [ 'error', ],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// 기존 db 변수명을 유지하여 기존 코드와의 호환성 확보
export const db = prisma;
