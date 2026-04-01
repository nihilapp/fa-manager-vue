const resolveUrl = (path: string | undefined, fallbackPath: string): string => {
  const targetPath = path?.trim() || fallbackPath;
  const siteUrl = appConfig.site.url.trim();

  if (!siteUrl) {
    return targetPath;
  }

  return new URL(targetPath, siteUrl).toString();
};

export const useSetMeta = (meta: SiteMetadata) => {
  const pageTitle = computed(() => toValue(meta.title)?.trim() || '');
  const documentTitle = computed(() => pageTitle.value
    ? `${pageTitle.value} - ${appConfig.site.title}`
    : appConfig.site.title);
  const siteDescription = computed(() => toValue(meta.description)?.trim() || appConfig.site.description);
  const siteUrl = computed(() => resolveUrl(toValue(meta.url), '/'));
  const siteImageLink = computed(() => resolveUrl(toValue(meta.imageLink), appConfig.images.cover.link));
  const siteImageAlt = computed(() => toValue(meta.imageAlt)?.trim() || appConfig.images.cover.alt);
  const siteType = computed(() => toValue(meta.type) || (appConfig.site.type as OpenGraphType));
  const robots = computed(() => toValue(meta.robots) || 'index, follow');

  useSeoMeta({
    title: () => documentTitle.value,
    description: () => siteDescription.value,
    author: appConfig.author.name,
    robots: () => robots.value,
    ogTitle: () => documentTitle.value,
    ogDescription: () => siteDescription.value,
    ogLocale: 'ko_KR',
    ogType: () => siteType.value,
    ogSiteName: appConfig.site.title,
    ogUrl: () => siteUrl.value,
    ogImage: () => siteImageLink.value,
    ogImageAlt: () => siteImageAlt.value,
    twitterCard: 'summary_large_image',
    twitterTitle: () => documentTitle.value,
    twitterDescription: () => siteDescription.value,
    twitterImage: () => siteImageLink.value,
  });

  useHead({
    meta: [
      { name: 'generator', content: 'Nuxt.js', },
      { name: 'google-site-verification', content: appConfig.google.verification, },
      { name: 'version', content: appConfig.site.version, },
      { property: 'og:image:width', content: '1920', },
      { property: 'og:image:height', content: '1080', },
      { property: 'og:image:alt', content: () => siteImageAlt.value, },
      { name: 'twitter:image:width', content: '1920', },
      { name: 'twitter:image:height', content: '1080', },
      { name: 'twitter:image:alt', content: () => siteImageAlt.value, },
    ],
    link: [
      { rel: 'canonical', href: () => siteUrl.value, },
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
