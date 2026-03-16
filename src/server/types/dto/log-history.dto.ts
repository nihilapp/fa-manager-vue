import type { UserOutDto } from '../dto.types';
import type {
  CommonOutDto,
  CommonQueryDto,
  LogActionType,
} from './common.dto';

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

export interface LogHistoryUpdateDto {
  tableName?: string;
  targetId?: number;
  actionType?: LogActionType;
  oldData?: any;
  newData?: any;
  description?: string | null;
  useYn?: 'Y' | 'N';
  deleteYn?: 'Y' | 'N';
}

export interface LogHistoryOutDto extends CommonOutDto {
  userId?: number;
  tableName?: string;
  targetId?: number;
  actionType?: LogActionType;
  oldData?: any;
  newData?: any;
  description?: string | null;

  user?: UserOutDto;
}
