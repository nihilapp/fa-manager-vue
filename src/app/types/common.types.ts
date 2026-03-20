export type OpenGraphType
  = | 'article'
    | 'book'
    | 'music.song'
    | 'music.album'
    | 'music.playlist'
    | 'music.radio_status'
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
