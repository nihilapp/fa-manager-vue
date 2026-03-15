export interface BaseResponseType<TData = null> {
  data: TData;
  error: boolean;
  code: RESPONSE_CODE;
  message: RESPONSE_MESSAGE;
}

export interface ListDataType<TData = null> {
  list: TData[]; // 현재 페이지의 데이터 목록
  totalElements: number; // 전체 데이터 개수 (필터링 전 원본 데이터 총합)
  filteredElements: number; // 필터링된 데이터 개수 (실제 페이징 기준이 되는 개수)

  // 페이징 관련 필드
  currentPage: number | null; // 현재 페이지 (0부터 시작)
  pageSize: number | null; // 페이지 당 데이터 개수
  totalPages: number | null; // 전체 페이지 수 (filteredElements 기준)

  // 페이지 경계 필드
  firstPage: number | null; // 첫 번째 페이지 번호 (항상 0)
  lastPage: number | null; // 마지막 페이지 번호

  // 상태 판단 필드
  hasPrev: boolean | null; // 이전 페이지 존재 여부
  hasNext: boolean | null; // 다음 페이지 존재 여부
  isFirst: boolean | null; // 첫 번째 페이지 여부
  isLast: boolean | null; // 마지막 페이지 여부
  isEmpty: boolean | null; // 현재 리스트가 비어있는지 여부

  // 이동 관련 필드
  prevPage: number | null; // 이전 페이지 번호
  nextPage: number | null; // 다음 페이지 번호
}
