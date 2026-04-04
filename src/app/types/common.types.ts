type ResolvableMetaValue<T> = MaybeRefOrGetter<T>;

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
  title: ResolvableMetaValue<string>;
  url: ResolvableMetaValue<string>;
  description?: ResolvableMetaValue<string | undefined>;
  author?: ResolvableMetaValue<string | undefined>;
  keywords?: ResolvableMetaValue<string | undefined>;
  type?: ResolvableMetaValue<OpenGraphType | undefined>;
  tags?: ResolvableMetaValue<string | undefined>;
  section?: ResolvableMetaValue<string | undefined>;
  created?: ResolvableMetaValue<string | undefined>;
  updated?: ResolvableMetaValue<string | undefined>;
  imageLink?: ResolvableMetaValue<string | undefined>;
  imageAlt?: ResolvableMetaValue<string | undefined>;
  robots?: ResolvableMetaValue<
    | 'index, follow'
    | 'noindex, nofollow'
    | 'index, nofollow'
    | 'noindex, follow'
    | undefined
  >;
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

export interface NavItem {
  label: string;
  link: string;
  icon: IconName | '';
  isPublic?: boolean;
  colspan?: number;
}

export interface DataTableColumn<T = any> {
  key: keyof T | (string & {});
  label: string;
  width?: string | number;
  headerStyle?: string;
  cellStyle?: string;
  icon?: IconName;
  iconStyle?: string;
  slotName?: string;
  align?: 'justify-start' | 'justify-center' | 'justify-end';
  sortable?: boolean;
  filterable?: boolean;
}

export type StatusColor
  = 'gray'
    | 'red'
    | 'rose'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'black';
