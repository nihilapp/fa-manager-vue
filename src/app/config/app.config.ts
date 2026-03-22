export const appConfig: AppConfig = {
  site: {
    title: 'FA 캠페인 매니저',
    description: '환상서고 캠페인 매니저',
    keywords: '',
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
      alt: '',
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
    route: 'http://localhost:3000/api',
  },
} as const;
