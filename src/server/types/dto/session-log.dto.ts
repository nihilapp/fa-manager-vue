export interface SessionLogQueryDto extends CommonQueryDto {
  sessionId?: number;
  userId?: number;
  title?: string;
}

export interface SessionLogCreateDto {
  sessionId: number;
  userId: number;
  title: string;
  content?: string | null;
  fileUrl?: string | null;
}

export interface SessionLogUpdateDto extends CommonInDto {
  title?: string;
  content?: string | null;
  fileUrl?: string | null;
}

export interface SessionLogOutDto extends CommonOutDto {
  sessionId: number;
  userId: number;
  title: string;
  content: string | null;
  fileUrl: string | null;

  session: SessionOutDto | null;
  user: PlayerOutDto | null;
}
