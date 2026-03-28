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

export interface CurrencyTransactionUpdateDto extends CommonInDto {
  transactionType?: TransactionType;
  description?: string;
  deltaPp?: number;
  deltaGp?: number;
  deltaEp?: number;
  deltaSp?: number;
  deltaCp?: number;
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
  user: PlayerOutDto | null;
  character: CharacterOutDto | null;
}
