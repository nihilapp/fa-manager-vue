/**
 * Spring Boot JPA의 Page 객체와 유사하게 페이징 결괏값을 생성하는 유틸리티
 *
 * @param list - 현재 페이지에 해당하는 데이터 배열
 * @param totalElements - 전체 데이터 개수
 * @param page - 현재 페이지 번호 (기본 1)
 * @param size - 페이지 당 데이터 개수 (기본 10)
 * @returns 페이징 메타데이터가 포함된 PageDataType 형식의 객체
 */
export function createPage<TData>(
  list: TData[],
  totalElements: number,
  page: number = 0, // 0페이지부터 시작
  size: number = 10
): PageDataType<TData> {
  const totalPages = Math.ceil(totalElements / size) || 1;
  const currentPage = Math.max(0, page); // 최소 0페이지

  return {
    list,
    totalElements,
    totalPages,
    currentPage,
    pageSize: size,
    isFirst: currentPage === 0,
    isLast: currentPage >= totalPages - 1,
    isEmpty: list.length === 0,
  };
}
