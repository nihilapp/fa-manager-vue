export const isSessionInfoItem = (value: unknown): value is SessionOutDto => (
  isApiRecord(value)
  && 'campaignId' in value
  && 'players' in value
);
