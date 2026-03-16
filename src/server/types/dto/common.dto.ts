export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN';
export type CampaignRole = 'PLAYER' | 'MASTER' | 'SUB_MASTER';
export type SessionRole = 'PLAYER' | 'MASTER';
export type Status = 'PREPARING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'ON_HOLD';
export type DocVisibility = 'PUBLIC' | 'PRIVATE';
export type DocStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
export type CharacterStatus = 'ACTIVE' | 'RESTING' | 'RETIRED' | 'DECEASED';
export type TransactionType = 'REWARD' | 'INCOME' | 'EXPENSE' | 'EXCHANGE' | 'INIT';
export type LogActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE';

export interface CommonInDto {
  [key: string]: any; // 동적 쿼리 파라미터 (suffix 등) 허용
  id?: number;
  idList?: number[];
  page?: number;
  size?: number;
  sort?: string;
  useYn?: 'Y' | 'N';
  deleteYn?: 'Y' | 'N';
  creatorId?: number;
  createDate?: string;
  updaterId?: number;
  updateDate?: string;
  deleterId?: number;
  deleteDate?: string;
}

export interface CommonQueryDto {
  [key: string]: any; // 동적 쿼리 파라미터 (suffix 등) 허용
  id?: number;
  idList?: number[];
  page?: number;
  size?: number;
  sort?: string;
  useYn?: 'Y' | 'N';
  deleteYn?: 'Y' | 'N';
  creatorId?: number;
  createDate?: string;
  updaterId?: number;
  updateDate?: string;
  deleterId?: number;
  deleteDate?: string;
}

export interface CommonOutDto {
  id?: number;
  useYn?: 'Y' | 'N';
  deleteYn?: 'Y' | 'N';
  creatorId?: number | null;
  createDate?: Date | string | null;
  updaterId?: number | null;
  updateDate?: Date | string | null;
  deleterId?: number | null;
  deleteDate?: Date | string | null;
}
