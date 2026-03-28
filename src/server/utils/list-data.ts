export class ListData<TData> {
  readonly list: TData[];
  readonly totalElements: number;
  readonly filteredElements: number;
  readonly currentPage: number;
  readonly pageSize: number;

  private readonly _isPaged: boolean;

  constructor(
    list: TData[],
    totalElements: number,
    filteredElements: number,
    currentPage = 0,
    pageSize = 0
  ) {
    this.list = list;
    this.totalElements = totalElements;
    this.filteredElements = filteredElements;

    this._isPaged = pageSize > 0;
    this.currentPage = currentPage;
    this.pageSize = pageSize;
  }

  /**
   * 첫 번째 페이지 번호를 반환합니다. (0-based)
   */
  get firstPage(): number {
    return 0;
  }

  /**
   * 마스터의 지침에 따라 filteredElements를 기준으로 전체 페이지 수를 계산합니다.
   */
  get totalPages(): number {
    if (!this._isPaged || this.pageSize === 0) return 0;
    return Math.ceil(this.filteredElements / this.pageSize);
  }

  get lastPage(): number {
    return Math.max(0, this.totalPages - 1);
  }

  get hasPrev(): boolean {
    return this._isPaged && this.currentPage > 0;
  }

  get hasNext(): boolean {
    return this._isPaged && this.currentPage < this.lastPage;
  }

  get isFirst(): boolean {
    return this._isPaged && this.currentPage === 0;
  }

  get isLast(): boolean {
    return this._isPaged && this.currentPage === this.lastPage;
  }

  get isEmpty(): boolean {
    return this.list.length === 0;
  }

  get prevPage(): number {
    return this.hasPrev
      ? this.currentPage - 1
      : 0;
  }

  get nextPage(): number {
    return this.hasNext
      ? this.currentPage + 1
      : 0;
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
      hasPrev: this.hasPrev,
      hasNext: this.hasNext,
      isFirst: this.isFirst,
      isLast: this.isLast,
      isEmpty: this.isEmpty,
      prevPage: this.prevPage,
      nextPage: this.nextPage,
    };
  }
}
