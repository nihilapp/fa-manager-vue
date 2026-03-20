import {
  QueryClient,
  VueQueryPlugin,
  type VueQueryPluginOptions,
  dehydrate,
  hydrate,
} from '@tanstack/vue-query';

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5분
        retry: 1,
      },
    },
  });

  const options: VueQueryPluginOptions = { queryClient, };

  nuxtApp.vueApp.use(VueQueryPlugin, options);

  if (import.meta.server) {
    nuxtApp.hooks.hook('app:rendered', (context) => {
      context.ssrContext!.payload.vueQueryState = dehydrate(queryClient);
    });
  }

  if (import.meta.client) {
    nuxtApp.hooks.hook('app:created', () => {
      hydrate(queryClient, nuxtApp.payload.vueQueryState);
    });
  }
});
