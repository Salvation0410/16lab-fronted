<template>
  <section class="panel">
    <div class="page-header">
      <div>
        <h1 class="page-title">消息中心</h1>
        <p class="muted">点赞、收藏、关注、评论和系统通知</p>
      </div>
      <button class="ghost-button" @click="readAll">全部已读</button>
    </div>
    <div class="list">
      <div v-for="item in notifications" :key="item.id" class="list-item notification-item">
        <div>
          <strong>{{ item.title }}</strong>
          <p>{{ item.content }}</p>
          <span class="muted">{{ item.type }} · {{ item.createTime }}</span>
        </div>
        <button v-if="item.isRead === 0" class="plain-button" @click="read(item.id)">已读</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { notificationApi } from '../api'

const notifications = ref([])

async function load() {
  const data = await notificationApi.list({ page: 1, size: 50 })
  notifications.value = data.list
}

async function read(id) {
  await notificationApi.read(id)
  await load()
}

async function readAll() {
  await notificationApi.readAll()
  await load()
}

onMounted(load)
</script>

<style scoped>
.notification-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
</style>
