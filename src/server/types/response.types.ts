export interface BaseApiResponse<TData = null> {
  data: TData;
  error: boolean;
  code: RESPONSE_CODE;
  message: RESPONSE_MESSAGE;
  responseTime?: number;
}

export interface ListDataType<TData = null> {
  list: TData[]; // 현재 페이지의 데이터 목록
  totalElements: number; // 전체 데이터 개수 (필터링 전 원본 데이터 총합)
  filteredElements: number; // 필터링된 데이터 개수 (실제 페이징 기준이 되는 개수)

  // 페이징 관련 필드
  currentPage: number; // 현재 페이지 (0부터 시작, 비페이징이면 0)
  pageSize: number; // 페이지 당 데이터 개수 (비페이징이면 0)
  totalPages: number; // 전체 페이지 수 (filteredElements 기준, 비페이징이면 0)

  // 페이지 경계 필드
  firstPage: number; // 첫 번째 페이지 번호 (항상 0)
  lastPage: number; // 마지막 페이지 번호 (비페이징이면 0)

  // 상태 판단 필드
  hasPrev: boolean; // 이전 페이지 존재 여부
  hasNext: boolean; // 다음 페이지 존재 여부
  isFirst: boolean; // 첫 번째 페이지 여부
  isLast: boolean; // 마지막 페이지 여부
  isEmpty: boolean; // 현재 리스트가 비어있는지 여부

  // 이동 관련 필드
  prevPage: number; // 이전 페이지 번호 (없으면 0)
  nextPage: number; // 다음 페이지 번호 (없으면 0)
}

export type ListPageData<TData = null> = Omit<ListDataType<TData>, 'list'>;
