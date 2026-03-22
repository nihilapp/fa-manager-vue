import type { OpenGraphType, SiteMetadata } from '@app/types/common.types';

function resolveUrl(path: string | undefined, fallbackPath: string): string {
  const targetPath = path?.trim() || fallbackPath;
  const siteUrl = appConfig.site.url.trim();

  if (!siteUrl) {
    return targetPath;
  }

  return new URL(targetPath, siteUrl).toString();
}

export const useSetMeta = (meta: SiteMetadata) => {
  const pageTitle = meta.title.trim();
  const documentTitle = pageTitle
    ? `${pageTitle} - ${appConfig.site.title}`
    : appConfig.site.title;
  const siteDescription = meta.description || appConfig.site.description;
  const siteUrl = resolveUrl(meta.url, '/');
  const siteImageLink = resolveUrl(meta.imageLink, appConfig.images.cover.link);
  const siteImageAlt = meta.imageAlt || appConfig.images.cover.alt;
  const siteType = meta.type || (appConfig.site.type as OpenGraphType);

  useSeoMeta({
    title: documentTitle,
    description: siteDescription,
    author: appConfig.author.name,
    robots: meta.robots || 'index, follow',
    ogTitle: documentTitle,
    ogDescription: siteDescription,
    ogLocale: 'ko_KR',
    ogType: siteType,
    ogSiteName: appConfig.site.title,
    ogUrl: siteUrl,
    ogImage: siteImageLink,
    ogImageAlt: siteImageAlt,
    twitterCard: 'summary_large_image',
    twitterTitle: documentTitle,
    twitterDescription: siteDescription,
    twitterImage: siteImageLink,
  });

  useHead({
    meta: [
      { name: 'generator', content: 'Nuxt.js', },
      { name: 'google-site-verification', content: appConfig.google.verification, },
      { name: 'version', content: appConfig.site.version, },
      { property: 'og:image:width', content: '1920', },
      { property: 'og:image:height', content: '1080', },
      { property: 'og:image:alt', content: siteImageAlt, },
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

  return {
    title: documentTitle,
    description: siteDescription,
    url: siteUrl,
    imageLink: siteImageLink,
    imageAlt: siteImageAlt,
    type: siteType,
  };
};
