import { appConfig } from '~/config/app.config';
import type { OpenGraphType, SiteMetadata } from '~/types/common.types';

export const useSetMeta = (meta: SiteMetadata) => {
  const siteDescription = meta.description || appConfig.site.description;
  const siteKeywords = meta.keywords
    ? `${appConfig.site.keywords}, ${meta.keywords}`
    : appConfig.site.keywords;
  const siteUrl = `${appConfig.site.url}${meta.url}`;
  const siteImageLink = meta.imageLink
    ? `${appConfig.site.url}${meta.imageLink}`
    : `${appConfig.site.url}${appConfig.images.cover.link}`;
  const siteImageAlt = meta.imageAlt || appConfig.images.cover.alt;
  const siteType = meta.type || (appConfig.site.type as OpenGraphType);

  // Nuxt.js useHead로 메타데이터 설정
  useHead({
    title: `${meta.title} - ${appConfig.site.title}`,
    meta: [
      { name: 'description', content: siteDescription, },
      { name: 'keywords', content: siteKeywords, },
      { name: 'author', content: appConfig.author.name, },
      { name: 'robots', content: meta.robots || 'index, follow', },
      { name: 'generator', content: 'Nuxt.js', },
      { name: 'google-site-verification', content: appConfig.google.verification, },
      { name: 'version', content: appConfig.site.version, },

      // Open Graph
      { property: 'og:title', content: meta.title, },
      { property: 'og:description', content: siteDescription, },
      { property: 'og:locale', content: 'ko_KR', },
      { property: 'og:type', content: siteType, },
      { property: 'og:site_name', content: appConfig.site.title, },
      { property: 'og:url', content: siteUrl, },
      { property: 'og:image', content: siteImageLink, },
      { property: 'og:image:width', content: '1920', },
      { property: 'og:image:height', content: '1080', },
      { property: 'og:image:alt', content: siteImageAlt, },

      // Twitter
      { name: 'twitter:card', content: 'summary_large_image', },
      { name: 'twitter:image', content: siteImageLink, },
      { name: 'twitter:image:width', content: '1920', },
      { name: 'twitter:image:height', content: '1080', },
      { name: 'twitter:image:alt', content: siteImageAlt, },
    ],
    link: [
      { rel: 'canonical', href: siteUrl, },
    ],
    htmlAttrs: {
      lang: 'ko',
    },
  });

  // 설정된 메타데이터 반환 (디버깅용)
  return {
    title: meta.title,
    description: siteDescription,
    keywords: siteKeywords,
    url: siteUrl,
    imageLink: siteImageLink,
    imageAlt: siteImageAlt,
    type: siteType,
  };
};
