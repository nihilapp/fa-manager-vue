export class ListData<TData> {
  readonly list: TData[];
  readonly totalElements: number;
  readonly filteredElements: number;
  readonly currentPage: number | null;
  readonly pageSize: number | null;

  private readonly _isPaged: boolean;

  constructor(
    list: TData[],
    totalElements: number,
    filteredElements: number,
    currentPage: number | null = null,
    pageSize: number | null = null
  ) {
    this.list = list;
    this.totalElements = totalElements;
    this.filteredElements = filteredElements;

    this._isPaged = pageSize !== null && currentPage !== null;
    this.currentPage = currentPage;
    this.pageSize = pageSize;
  }

  /**
   * 첫 번째 페이지 번호를 반환합니다. (0-based)
   */
  get firstPage(): number | null {
    return this._isPaged
      ? 0
      : null;
  }

  /**
   * 마스터의 지침에 따라 filteredElements를 기준으로 전체 페이지 수를 계산합니다.
   */
  get totalPages(): number | null {
    if (!this._isPaged || this.pageSize === 0) return null;
    return Math.ceil(this.filteredElements / this.pageSize!);
  }

  get lastPage(): number | null {
    const total = this.totalPages;
    // 데이터가 없더라도 페이징이 활성화되어 있다면 최소 0페이지는 존재합니다.
    return total !== null
      ? Math.max(0, total - 1)
      : null;
  }

  get hasPrev(): boolean {
    return this._isPaged && this.currentPage! > 0;
  }

  get hasNext(): boolean {
    const last = this.lastPage;
    return last !== null && this.currentPage! < last;
  }

  get isFirst(): boolean {
    return this._isPaged && this.currentPage === 0;
  }

  get isLast(): boolean {
    const last = this.lastPage;
    return last !== null && this.currentPage === last;
  }

  get isEmpty(): boolean {
    return this.list.length === 0;
  }

  get prevPage(): number | null {
    return this.hasPrev
      ? this.currentPage! - 1
      : null;
  }

  get nextPage(): number | null {
    return this.hasNext
      ? this.currentPage! + 1
      : null;
  }

  toJSON(): ListDataType<TData> {
    return {
      list: this.list,
      totalElements: this.totalElements,
      filteredElements: this.filteredElements,
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      totalPages: this.totalPages,
      firstPage: this.firstPage,
      lastPage: this.lastPage,
      hasPrev: this._isPaged
        ? this.hasPrev
        : null,
      hasNext: this._isPaged
        ? this.hasNext
        : null,
      isFirst: this._isPaged
        ? this.isFirst
        : null,
      isLast: this._isPaged
        ? this.isLast
        : null,
      isEmpty: this.isEmpty,
      prevPage: this.prevPage,
      nextPage: this.nextPage,
    };
  }
}
