<template>
  <section>
    <div class="page-header">
      <div>
        <h1 class="page-title">后台总览</h1>
        <p class="muted">社区核心数据和待处理事项</p>
      </div>
    </div>
    <div class="stat-grid">
      <div v-for="item in stats" :key="item.label" class="stat-card">
        <span class="muted">{{ item.label }}</span>
        <div class="stat-value">{{ item.value }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { adminApi } from '../../api'

const raw = ref({})
const stats = computed(() => [
  { label: '用户数', value: raw.value.userCount ?? 0 },
  { label: '帖子数', value: raw.value.postCount ?? 0 },
  { label: '评论数', value: raw.value.commentCount ?? 0 },
  { label: 'AI会话', value: raw.value.aiConversationCount ?? 0 }
])

onMounted(async () => {
  raw.value = await adminApi.statistics()
})
</script>
