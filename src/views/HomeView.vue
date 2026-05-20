<template>
  <div class="page-wrap home-view">
    <section class="soft-hero home-hero">
      <div class="hero-copy">
        <el-tag effect="plain" type="primary">今天也遇见同频的人</el-tag>
        <h1>遇见同频的人，也更懂自己。</h1>
        <p>16Lab 把人格图鉴、社区讨论、MBTI 测试和 AI 陪聊放在一起。你可以慢慢看，也可以直接开始聊。</p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="$router.push('/personalities')">探索人格图鉴</el-button>
          <el-button size="large" @click="$router.push('/mbti-test')">做一次测试</el-button>
        </div>
      </div>

      <div class="hero-board" aria-hidden="true">
        <div class="board-card main">
          <strong>INTJ-A</strong>
          <span>职业选择困惑</span>
        </div>
        <div class="board-card floating">
          <strong>ENFP</strong>
          <span>有人懂我这句话了</span>
        </div>
      </div>
    </section>

    <div class="home-layout">
      <aside class="section-stack">
        <el-card shadow="never">
          <div class="profile-card">
            <el-avatar :size="56">{{ avatarText }}</el-avatar>
            <div>
              <strong>{{ currentUser.nickname }}</strong>
              <span>{{ currentUser.mbti }} · 16Lab 探索者</span>
            </div>
          </div>
          <el-row :gutter="8" class="profile-stats">
            <el-col v-for="item in stats" :key="item.label" :span="8">
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
            </el-col>
          </el-row>
          <el-button type="primary" class="full-button" :icon="EditPen" @click="$router.push('/create')">发布新动态</el-button>
        </el-card>

        <el-card shadow="never">
          <template #header>我加入的社区</template>
          <div class="side-list">
            <RouterLink v-for="item in joinedCommunities" :key="item.id" :to="`/communities/${item.id}`" class="side-community">
              <span class="community-badge" :class="item.tone">{{ item.short }}</span>
              <span>
                <strong>{{ item.name }}</strong>
                <small>{{ item.members }} 成员</small>
              </span>
            </RouterLink>
          </div>
        </el-card>
      </aside>

      <main class="section-stack">
        <el-row :gutter="14">
          <el-col v-for="feature in features" :key="feature.title" :xs="24" :md="8">
            <RouterLink :to="feature.to" class="feature-link">
              <el-card shadow="hover">
                <el-icon :size="24"><component :is="feature.icon" /></el-icon>
                <strong>{{ feature.title }}</strong>
                <p>{{ feature.text }}</p>
              </el-card>
            </RouterLink>
          </el-col>
        </el-row>

        <el-card shadow="never">
          <template #header>
            <div class="panel-head">
              <span>社区动态</span>
              <el-radio-group v-model="activeFeed" size="small">
                <el-radio-button label="recommend">推荐</el-radio-button>
                <el-radio-button label="latest">最新</el-radio-button>
                <el-radio-button label="hot">热门</el-radio-button>
              </el-radio-group>
            </div>
          </template>

          <div class="post-list">
            <article v-for="post in visiblePosts" :key="post.id" class="post-item">
              <div class="post-head">
                <el-avatar>{{ post.author.slice(0, 1) }}</el-avatar>
                <div>
                  <strong>{{ post.author }}</strong>
                  <span>{{ post.authorMbti }} · {{ post.communityName }} · {{ post.time }}</span>
                </div>
              </div>
              <RouterLink class="post-title" :to="`/posts/${post.id}`">{{ post.title }}</RouterLink>
              <p>{{ post.content }}</p>
              <div class="tag-row">
                <el-tag v-for="tag in post.tags" :key="tag" type="info" effect="plain">#{{ tag }}</el-tag>
              </div>
              <div class="post-actions">
                <span><el-icon><ChatDotRound /></el-icon>{{ post.comments }}</span>
                <span><el-icon><Star /></el-icon>{{ post.views }}</span>
                <span><el-icon><Pointer /></el-icon>{{ post.likes }}</span>
              </div>
            </article>
          </div>
        </el-card>
      </main>

      <aside class="section-stack">
        <el-card shadow="never">
          <template #header>今日趋势</template>
          <el-timeline>
            <el-timeline-item v-for="item in trends" :key="item.title" :timestamp="item.count">
              {{ item.title }}
            </el-timeline-item>
          </el-timeline>
        </el-card>

        <el-card shadow="never" class="warm-card">
          <strong>还没找到同频的人？</strong>
          <p>去社区广场慢慢逛。先关注一个感兴趣的话题，内容会越来越准。</p>
          <el-button type="primary" plain @click="$router.push('/square')">去社区广场</el-button>
        </el-card>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ChatDotRound, Compass, EditPen, MagicStick, Pointer, Star, UserFilled } from '@element-plus/icons-vue'
import { communities, currentUser, posts } from '../data/mockData'

const activeFeed = ref('recommend')
const avatarText = computed(() => currentUser.nickname.slice(0, 2))
const stats = [
  { label: '关注', value: currentUser.followingCount },
  { label: '粉丝', value: currentUser.followerCount },
  { label: '获赞', value: currentUser.likeCount }
]
const features = [
  { title: '人格图鉴', text: '查看 16 型人格的特点、优势和成长建议。', to: '/personalities', icon: UserFilled },
  { title: 'MBTI 测试', text: '用一组轻量问题，重新校准你的类型。', to: '/mbti-test', icon: Compass },
  { title: 'AI 陪聊', text: '把想不通的事说出来，慢慢拆。', to: '/ai', icon: MagicStick }
]
const trends = [
  { title: 'INTJ 适合做管理吗？', count: '4.8k 讨论' },
  { title: '高敏感怎么建立边界？', count: '3.2k 讨论' },
  { title: 'ENFP 如何保持执行力？', count: '2.7k 讨论' }
]
const joinedCommunities = computed(() => communities.filter((item) => item.joined).slice(0, 4))
const visiblePosts = computed(() => {
  if (activeFeed.value === 'latest') return [...posts].reverse()
  if (activeFeed.value === 'hot') return [...posts].sort((a, b) => b.likes - a.likes)
  return posts
})
</script>

<style scoped>
.home-view {
  display: grid;
  gap: 20px;
}

.home-hero {
  min-height: 260px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 24px;
  align-items: center;
  padding: 34px;
}

.hero-copy h1 {
  margin: 16px 0 0;
  font-size: 42px;
  line-height: 1.12;
}

.hero-copy p {
  max-width: 560px;
  color: var(--lab-muted);
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

.hero-board {
  position: relative;
  min-height: 210px;
}

.board-card {
  position: absolute;
  display: grid;
  gap: 8px;
  border: 1px solid #dbe7f4;
  border-radius: 8px;
  padding: 18px;
  background: #fff;
  box-shadow: var(--lab-shadow);
}

.board-card.main {
  right: 34px;
  top: 22px;
  width: 220px;
}

.board-card.floating {
  left: 14px;
  bottom: 20px;
  width: 190px;
}

.board-card strong {
  color: var(--lab-blue);
  font-size: 30px;
}

.home-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 300px;
  gap: 20px;
  align-items: start;
}

.profile-card,
.post-head,
.side-community {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-card strong,
.profile-card span,
.side-community strong,
.side-community small,
.post-head strong,
.post-head span {
  display: block;
}

.profile-card span,
.side-community small,
.post-head span {
  margin-top: 4px;
  color: var(--lab-muted);
  font-size: 13px;
}

.profile-stats {
  margin: 18px 0;
  text-align: center;
}

.profile-stats strong,
.profile-stats span {
  display: block;
}

.profile-stats span {
  color: var(--lab-muted);
  font-size: 12px;
}

.full-button {
  width: 100%;
}

.side-list {
  display: grid;
  gap: 12px;
}

.community-badge {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  background: var(--lab-blue);
}

.community-badge.green,
.community-badge.mint {
  background: var(--lab-green);
}

.community-badge.rose {
  background: #df6b8f;
}

.community-badge.gold {
  background: var(--lab-gold);
}

.community-badge.lavender {
  background: #7b70dd;
}

.feature-link {
  display: block;
  height: 100%;
}

.feature-link :deep(.el-card) {
  height: 100%;
}

.feature-link :deep(.el-card__body) {
  display: grid;
  gap: 10px;
}

.feature-link strong {
  font-size: 18px;
}

.feature-link p,
.post-item p,
.warm-card p {
  margin: 0;
  color: var(--lab-muted);
  line-height: 1.7;
}

.post-list {
  display: grid;
  gap: 18px;
}

.post-item {
  display: grid;
  gap: 12px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--lab-line);
}

.post-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.post-title {
  color: #16213d;
  font-size: 20px;
  line-height: 1.4;
  font-weight: 900;
}

.post-actions {
  display: flex;
  gap: 24px;
  color: var(--lab-muted);
}

.post-actions span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.warm-card :deep(.el-card__body) {
  display: grid;
  gap: 12px;
}

@media (max-width: 1240px) {
  .home-layout,
  .home-hero {
    grid-template-columns: 1fr;
  }
}
</style>
