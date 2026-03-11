export const appConfig = {
  site: {
    title: '사이트 이름',
    description: '사이트 설명',
    keywords: '사이트 키워드',
    url: import.meta.dev
      ? 'http://localhost:3000'
      : '',
    type: 'website' as const,
    version: '1.0.0',
  },
  author: {
    name: 'NIHILncunia',
    url: 'https://github.com/nihilncunia',
  },
  images: {
    cover: {
      link: '/opengraph-image.png',
      alt: '사이트 커버 이미지',
    },
    logo: '/logo.png',
    darkLogo: '/logo-dark.png',
  },
  google: {
    verification: '',
    adSrc: '',
    analyticsId: '',
  },
  api: {
    route: 'http://localhost:8000',
  },
} as const;
