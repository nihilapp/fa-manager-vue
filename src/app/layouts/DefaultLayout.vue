<script setup lang="ts">
import '~/assets/styles/alt-body.css';

import CommonContent from '@app/components/layout/common-layout/CommonContent.vue';
import CommonFooter from '@app/components/layout/common-layout/CommonFooter.vue';
import CommonHeader from '@app/components/layout/common-layout/CommonHeader.vue';
</script>

<template>
  <div data-app='nihil-app' class='flex flex-col h-full'>
    <CommonHeader />
    <CommonContent>
      <slot />
    </CommonContent>
    <CommonFooter />
  </div>
</template>
