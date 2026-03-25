export interface LogHistoryQueryDto extends CommonQueryDto {
  userId?: number;
  tableName?: string;
  targetId?: number;
  actionType?: LogActionType;
  description?: string;
}

export interface LogHistoryCreateDto {
  userId: number;
  tableName: string;
  targetId: number;
  actionType: LogActionType;
  oldData?: any;
  newData?: any;
  description?: string | null;
}

export interface LogHistoryUpdateDto extends CommonInDto {
  tableName?: string;
  targetId?: number;
  actionType?: LogActionType;
  oldData?: any;
  newData?: any;
  description?: string | null;
}

export interface LogHistoryOutDto extends CommonOutDto {
  userId: number;
  tableName: string;
  targetId: number;
  actionType: LogActionType;
  oldData: any;
  newData: any;
  description: string | null;

  user: UserOutDto | null;
}
