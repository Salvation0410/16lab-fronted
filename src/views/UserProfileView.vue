<template>
  <section class="page-wrap section-stack">
    <el-card shadow="never">
      <div class="profile-head">
        <el-avatar :size="72">{{ profile.nickname.slice(0, 2) }}</el-avatar>
        <div>
          <h1 class="page-title">{{ profile.nickname }}</h1>
          <p class="page-subtitle">{{ profile.bio }}</p>
          <div class="tag-row">
            <el-tag>{{ profile.mbti }}</el-tag>
            <el-tag type="success" effect="plain">16Lab 探索者</el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never">
      <el-tabs v-model="tab">
        <el-tab-pane label="帖子" name="posts" />
        <el-tab-pane label="收藏" name="favorites" />
        <el-tab-pane label="MBTI 记录" name="history" />
      </el-tabs>

      <div v-if="tab !== 'history'" class="profile-posts">
        <RouterLink v-for="post in posts" :key="post.id" :to="`/posts/${post.id}`">
          <strong>{{ post.title }}</strong>
          <span>{{ post.time }} · {{ post.likes }} 赞</span>
        </RouterLink>
      </div>

      <el-timeline v-else>
        <el-timeline-item v-for="item in userHistories" :key="item.startTime" :timestamp="item.startTime">
          <strong>{{ item.mbti }}</strong>
          <p>{{ item.note }}</p>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { currentUser as profile, posts, userHistories } from '../data/mockData'

const tab = ref('posts')
</script>

<style scoped>
.profile-head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 18px;
  align-items: center;
}

.profile-posts {
  display: grid;
  gap: 14px;
}

.profile-posts a {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--lab-line);
}

.profile-posts span {
  color: var(--lab-muted);
}
</style>
