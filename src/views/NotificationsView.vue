<template>
  <section class="page-wrap section-stack">
    <div class="panel-head">
      <div>
        <h1 class="page-title">消息中心</h1>
        <p class="page-subtitle">点赞、回复和系统消息都放在这里。</p>
      </div>
      <el-button type="primary" plain @click="markAllRead">全部已读</el-button>
    </div>

    <el-card shadow="never">
      <el-timeline>
        <el-timeline-item
          v-for="item in localNotifications"
          :key="item.id"
          :type="item.read ? 'info' : 'primary'"
          :timestamp="item.time"
        >
          <div class="notice-item">
            <div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.content }}</p>
            </div>
            <el-button v-if="!item.read" size="small" @click="item.read = true">标为已读</el-button>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { notifications } from '../data/mockData'

const localNotifications = ref(notifications.map((item) => ({ ...item })))

function markAllRead() {
  localNotifications.value = localNotifications.value.map((item) => ({ ...item, read: true }))
}
</script>

<style scoped>
.notice-item {
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.notice-item p {
  margin: 8px 0 0;
  color: var(--lab-muted);
}
</style>
