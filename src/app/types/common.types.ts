export type OpenGraphType
  = | 'article'
    | 'book'
    | 'music.song'
    | 'music.album'
    | 'music.playlist'
    | 'music.radio_station'
    | 'profile'
    | 'website'
    | 'video.tv_show'
    | 'video.other'
    | 'video.movie'
    | 'video.episode';

export interface SiteMetadata {
  title: string;
  url: string;
  description?: string;
  author?: string;
  keywords?: string;
  type?: OpenGraphType;
  tags?: string;
  section?: string;
  created?: string;
  updated?: string;
  imageLink?: string;
  imageAlt?: string;
  robots?:
    | 'index, follow'
    | 'noindex, nofollow'
    | 'index, nofollow'
    | 'noindex, follow';
}

export interface AppConfig {
  site: {
    title: string;
    description: string;
    keywords: string;
    url: string;
    type: OpenGraphType;
    version: string;
  };
  author: {
    name: string;
    url: string;
  };
  images: {
    cover: {
      link: string;
      alt: string;
    };
    logo: string;
    darkLogo: string;
  };
  google: {
    verification: string;
    adSrc: string;
    analyticsId: string;
  };
  api: {
    route: string;
  };
}

/**
 * API 응답 타입
 *
 * 모든 API 응답은 HTTP 200 상태 코드를 반환하며,
 * 실제 성공/실패 여부는 `error` 필드와 `code` 필드로 판단합니다.
 *
 * - `error: false` + `code: 'OK' | 'CREATED' | 'ACCEPTED' | 'NO_CONTENT'` → 성공
 * - `error: true` + `code: 'UNAUTHORIZED' | 'FORBIDDEN' | ...` → 에러
 */
export interface ApiResponse<TData = null> {
  error: boolean;
  message: string;
  data: TData;
  code: ResponseCode;
  responseTime: number;
}

/**
 * Spring Boot JPA의 Page 객체와 유사하게 페이징 메타데이터를 포함하는 타입
 * 페이징 처리가 없는 경우, list 와 totalElements 두 가지 속성만 필수로 반환합니다.
 */
export interface PageDataType<TData = null> {
  list: TData[]; // 현재 페이지의 데이터 목록
  totalElements: number; // 전체 데이터 개수
  totalPages?: number; // 전체 페이지 수 (페이징 시 포함)
  currentPage?: number; // 현재 페이지 (1부터 시작) (페이징 시 포함)
  pageSize?: number; // 페이지 당 데이터 개수 (페이징 시 포함)
  isFirst?: boolean; // 첫 번째 페이지 여부 (페이징 시 포함)
  isLast?: boolean; // 마지막 페이지 여부 (페이징 시 포함)
  isEmpty?: boolean; // 현재 페이지 데이터가 비어있는지 여부 (페이징 시 포함)
}
