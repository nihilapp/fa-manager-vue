<script setup lang='ts'>
import { ref } from 'vue';

import { useGet } from '@app/composables/query/useGet';
import { queryKeys } from '@app/utils/query-keys';

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────
const statusText = ref('아직 확인 전');

// ─────────────────────────────────────────────────────────────
// COMPOSABLES — 외부 훅 사용
// ─────────────────────────────────────────────────────────────
const {
  response,
  execute,
  isFetching,
} = await useGet<boolean>({
  api: '/health',
  enabled: false,
  key: queryKeys.health.check.queryKey,
  onSuccess: (res) => {
    statusText.value = String(res.data);
  },
  onError: (error) => {
    statusText.value = `실패: ${String(error.message)}`;
  },
});

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────
async function handleCheckHealth() {
  statusText.value = '확인 중...';

  try {
    await execute();

    if (!response.value?.error) {
      statusText.value = String(response.value?.data ?? false);
    }
  }
  catch {
    if (!response.value) {
      statusText.value = '실패: 서버 응답을 받지 못했습니다.';
    }
  }
}

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────
</script>

<template>
  <section class='home'>
    <h1 class='title'>
      Health Check
    </h1>

    <button
      class='action'
      type='button'
      :disabled='isFetching'
      @click='handleCheckHealth'
    >
      {{ isFetching ? '확인 중...' : '서버 상태 확인' }}
    </button>

    <p class='status'>
      결과: {{ statusText }}
    </p>
  </section>
</template>

<style scoped>
.home {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: linear-gradient(180deg, #f7f4ea 0%, #ebe4d3 100%);
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #2f241f;
}

.action {
  border: none;
  border-radius: 999px;
  background: #2f241f;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 600;
  color: #f8f5ef;
  cursor: pointer;
}

.action:disabled {
  cursor: wait;
  opacity: 0.7;
}

.status {
  min-width: 220px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.75);
  padding: 16px 20px;
  text-align: center;
  font-size: 18px;
  color: #2f241f;
}
</style>
