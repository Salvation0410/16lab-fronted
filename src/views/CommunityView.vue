<template>
  <section class="page-wrap page-grid">
    <main class="section-stack">
      <el-card shadow="never" class="community-hero">
        <div class="community-hero-body">
          <div class="community-mark">{{ community.short }}</div>
          <div>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/square' }">社区广场</el-breadcrumb-item>
              <el-breadcrumb-item>{{ community.name }}</el-breadcrumb-item>
            </el-breadcrumb>
            <h1>{{ community.name }}</h1>
            <p>{{ community.description }}</p>
            <div class="tag-row">
              <el-tag>{{ community.type }}</el-tag>
              <el-tag type="success" effect="plain">{{ community.members }} 成员</el-tag>
              <el-tag type="warning" effect="plain">{{ community.posts }} 帖子</el-tag>
            </div>
          </div>
        </div>
      </el-card>

      <el-card shadow="never">
        <template #header>
          <div class="panel-head">
            <span>社区帖子</span>
            <el-button type="primary" :icon="EditPen" @click="$router.push('/create')">发布新帖</el-button>
          </div>
        </template>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="热门" name="hot" />
          <el-tab-pane label="最新" name="latest" />
          <el-tab-pane label="问答" name="qa" />
        </el-tabs>
        <div class="post-list">
          <article v-for="post in communityPosts" :key="post.id" class="post-item">
            <RouterLink class="post-title" :to="`/posts/${post.id}`">{{ post.title }}</RouterLink>
            <p>{{ post.content }}</p>
            <div class="post-foot">
              <span>{{ post.author }} · {{ post.time }}</span>
              <span>{{ post.likes }} 赞 · {{ post.comments }} 评论</span>
            </div>
          </article>
        </div>
      </el-card>
    </main>

    <aside class="section-stack">
      <el-card shadow="never">
        <template #header>社区规则</template>
        <el-alert title="友善表达，别急着给别人贴标签。" type="info" :closable="false" />
        <el-alert title="讨论具体问题，比争论类型高低更有用。" type="success" :closable="false" />
        <el-alert title="涉及隐私的内容请先打码。" type="warning" :closable="false" />
      </el-card>

      <el-card shadow="never">
        <template #header>相关社区</template>
        <div class="side-list">
          <RouterLink v-for="item in related" :key="item.id" :to="`/communities/${item.id}`" class="related-item">
            <span class="community-badge" :class="item.tone">{{ item.short }}</span>
            <strong>{{ item.name }}</strong>
          </RouterLink>
        </div>
      </el-card>
    </aside>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { EditPen } from '@element-plus/icons-vue'
import { communities, findCommunity, posts } from '../data/mockData'

const route = useRoute()
const activeTab = ref('hot')
const community = computed(() => findCommunity(route.params.id))
const communityPosts = computed(() => posts.filter((post) => post.communityId === community.value.id || activeTab.value))
const related = computed(() => communities.filter((item) => item.id !== community.value.id).slice(0, 3))
</script>

<style scoped>
.community-hero-body {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 20px;
  align-items: center;
}

.community-mark {
  width: 96px;
  height: 96px;
  display: grid;
  place-items: center;
  border-radius: 20px;
  color: #fff;
  background: linear-gradient(145deg, #7fb7f4, #2f80ed);
  font-size: 30px;
  font-weight: 900;
}

.community-hero h1 {
  margin: 12px 0 8px;
  font-size: 32px;
}

.community-hero p,
.post-item p {
  color: var(--lab-muted);
  line-height: 1.75;
}

.post-list,
.side-list {
  display: grid;
  gap: 14px;
}

.post-item {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--lab-line);
}

.post-title {
  color: #14213d;
  font-size: 19px;
  font-weight: 900;
}

.post-foot {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--lab-muted);
  font-size: 13px;
}

.related-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.community-badge {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: #fff;
  background: var(--lab-blue);
  font-size: 12px;
  font-weight: 900;
}
</style>
