import type { CharacterOutDto, UserOutDto } from '../dto.types';
import type {
  CommonOutDto,
  CommonQueryDto,
  TransactionType,
} from './common.dto';

export interface CurrencyTransactionQueryDto extends CommonQueryDto {
  userId?: number;
  characterId?: number;
  transactionType?: TransactionType;
  description?: string;
}

export interface CurrencyTransactionCreateDto {
  characterId: number;
  transactionType?: TransactionType;
  description: string;
  deltaPp?: number;
  deltaGp?: number;
  deltaEp?: number;
  deltaSp?: number;
  deltaCp?: number;
}

export interface CurrencyTransactionUpdateDto {
  transactionType?: TransactionType;
  description?: string;
  deltaPp?: number;
  deltaGp?: number;
  deltaEp?: number;
  deltaSp?: number;
  deltaCp?: number;
  useYn?: 'Y' | 'N';
  deleteYn?: 'Y' | 'N';
}

export interface CurrencyTransactionOutDto extends CommonOutDto {
  userId: number;
  characterId: number;
  transactionType: TransactionType;
  description: string;
  deltaPp: number;
  deltaGp: number;
  deltaEp: number;
  deltaSp: number;
  deltaCp: number;
  user?: UserOutDto;
  character?: CharacterOutDto;
}
