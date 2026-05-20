<template>
  <div class="home-page">
    <aside class="left-rail">
      <el-card class="profile-panel" shadow="never">
        <div class="profile-main">
          <el-avatar :size="56" :src="currentUser.avatar" />
          <div>
            <div class="profile-name">
              <strong>{{ currentUser.name }}</strong>
              <el-tag size="small" effect="light">{{ currentUser.type }}</el-tag>
            </div>
            <span>{{ currentUser.role }}</span>
          </div>
        </div>

        <div class="profile-stats">
          <div v-for="item in userStats" :key="item.label">
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </div>

        <el-button type="primary" class="publish-button" :icon="Plus" @click="go('/create')">
          发布新动态
        </el-button>
      </el-card>

      <el-card class="menu-panel" shadow="never">
        <RouterLink
          v-for="item in sideMenus"
          :key="item.label"
          :to="item.to"
          class="side-menu"
          :class="{ active: item.active }"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </RouterLink>
      </el-card>

      <el-card class="joined-panel" shadow="never">
        <template #header>
          <div class="panel-title">
            <span>我加入的社区</span>
            <el-button link type="primary" @click="go('/square')">管理</el-button>
          </div>
        </template>

        <div class="joined-list">
          <RouterLink v-for="item in joinedCommunities" :key="item.name" to="/square" class="joined-item">
            <el-avatar :size="34" :src="item.avatar" />
            <div>
              <strong>{{ item.name }}</strong>
              <span>{{ item.members }} 成员</span>
            </div>
            <i v-if="item.unread" />
          </RouterLink>
        </div>

        <el-button class="more-link" link type="primary" @click="go('/square')">查看更多</el-button>
      </el-card>
    </aside>

    <main class="home-feed">
      <section class="hero-card">
        <div class="hero-copy">
          <h1>遇见同频的人，理解更多的自己</h1>
          <p>在 16Lab，探索性格的无限可能</p>
          <el-button type="primary" size="large" @click="go('/personalities')">开始探索</el-button>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <div class="plant plant-left" />
          <div class="plant plant-right" />
          <div class="sofa" />
          <div class="person person-left">
            <span class="head" />
            <span class="body" />
          </div>
          <div class="person person-right">
            <span class="head" />
            <span class="body" />
          </div>
          <div class="table" />
        </div>
      </section>

      <section class="feature-grid">
        <RouterLink v-for="item in features" :key="item.title" :to="item.to" class="feature-card">
          <div>
            <h2>{{ item.title }}</h2>
            <p>{{ item.desc }}</p>
          </div>
          <div class="feature-art" :class="item.tone">
            <el-icon><component :is="item.icon" /></el-icon>
          </div>
        </RouterLink>
      </section>

      <el-card class="feed-card" shadow="never">
        <el-tabs v-model="activeTab" class="feed-tabs">
          <el-tab-pane label="推荐" name="recommend" />
          <el-tab-pane label="关注" name="following" />
          <el-tab-pane label="最新" name="latest" />
        </el-tabs>

        <article v-for="post in visiblePosts" :key="post.id" class="post-card">
          <div class="post-head">
            <div class="author-line">
              <el-avatar :size="44" :src="post.avatar" />
              <div>
                <div class="author-name">
                  <strong>{{ post.author }}</strong>
                  <el-tag size="small" effect="light">{{ post.type }}</el-tag>
                  <span>· {{ post.time }}</span>
                </div>
                <p>发布于 {{ post.community }}</p>
              </div>
            </div>
            <el-button text :icon="MoreFilled" />
          </div>

          <div class="post-body">
            <div class="post-copy">
              <RouterLink :to="`/posts/${post.id}`" class="post-title">{{ post.title }}</RouterLink>
              <p v-for="line in post.content" :key="line">{{ line }}</p>
            </div>
            <div v-if="post.preview" class="post-preview">
              <div v-for="row in 6" :key="row" />
            </div>
          </div>

          <div class="tag-row">
            <el-tag v-for="tag in post.tags" :key="tag" type="primary" effect="plain">#{{ tag }}</el-tag>
          </div>

          <div class="post-actions">
            <span><el-icon><ChatDotRound /></el-icon>{{ post.comments }}</span>
            <span><el-icon><Message /></el-icon>{{ post.replies }}</span>
            <span class="liked"><el-icon><Pointer /></el-icon>{{ post.likes }}</span>
          </div>
        </article>
      </el-card>
    </main>

    <aside class="right-rail">
      <el-card class="trend-panel" shadow="never">
        <template #header>
          <div class="panel-title">
            <span>今日趋势</span>
            <el-button link @click="go('/square')">
              查看更多
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </template>

        <div class="trend-list">
          <RouterLink v-for="(item, index) in trends" :key="item.title" to="/square" class="trend-item">
            <strong :class="{ hot: index < 3 }">{{ index + 1 }}</strong>
            <div>
              <p>{{ item.title }}</p>
              <span>{{ item.count }} 讨论</span>
            </div>
          </RouterLink>
        </div>
      </el-card>

      <el-card class="recommend-panel" shadow="never">
        <template #header>
          <div class="panel-title">
            <span>推荐社区</span>
            <el-button link @click="go('/square')">
              查看更多
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </template>

        <div class="recommend-list">
          <div v-for="item in recommendedCommunities" :key="item.name" class="recommend-item">
            <el-avatar :size="38" :src="item.avatar" />
            <div>
              <strong>{{ item.name }}</strong>
              <span>{{ item.members }} 成员</span>
            </div>
            <el-button plain type="primary" size="small">加入</el-button>
          </div>
        </div>
      </el-card>

      <section class="community-cta">
        <h3>还没找到同频的人？</h3>
        <p>去社区逛逛，遇见更多有趣的伙伴吧。</p>
        <el-button type="primary" @click="go('/square')">探索社区</el-button>
      </section>

      <section class="quote-card">
        <span>“</span>
        <p>性格没有好坏之分，理解自己，接纳自己，就是最好的成长。</p>
        <small>— 16Lab 社区</small>
      </section>
    </aside>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  ArrowRight,
  ChatDotRound,
  Clock,
  Collection,
  Compass,
  House,
  MagicStick,
  Message,
  MoreFilled,
  Plus,
  Pointer,
  Star,
  User
} from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('following')

const currentUser = {
  name: '小海盐',
  type: 'INFJ',
  role: '提问者',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
}

const userStats = [
  { label: '关注', value: 126 },
  { label: '粉丝', value: 342 },
  { label: '获赞', value: '1.2k' }
]

const sideMenus = [
  { label: '推荐', to: '/', icon: House, active: true },
  { label: '关注', to: '/', icon: User },
  { label: '话题广场', to: '/square', icon: Collection },
  { label: '最新', to: '/square', icon: Clock },
  { label: '收藏', to: '/users/16', icon: Star }
]

const joinedCommunities = [
  {
    name: 'INFJ·提倡者之家',
    members: '12.6k',
    unread: true,
    avatar: 'https://api.dicebear.com/9.x/personas/svg?seed=infj'
  },
  {
    name: 'MBTI 16 型人格',
    members: '8.1k',
    avatar: 'https://api.dicebear.com/9.x/personas/svg?seed=mbti'
  },
  {
    name: '职场生存指南',
    members: '6.7k',
    avatar: 'https://api.dicebear.com/9.x/personas/svg?seed=career'
  },
  {
    name: '日常碎碎念',
    members: '3.2k',
    avatar: 'https://api.dicebear.com/9.x/personas/svg?seed=daily'
  },
  {
    name: 'ENFP 快乐星球',
    members: '9.8k',
    avatar: 'https://api.dicebear.com/9.x/personas/svg?seed=enfp'
  }
]

const features = [
  {
    title: '16 型人格',
    desc: '探索属于你的性格坐标',
    to: '/personalities',
    icon: Collection,
    tone: 'people'
  },
  {
    title: 'MBTI 测试',
    desc: '专业测评，了解真实的自己',
    to: '/mbti-test',
    icon: Compass,
    tone: 'test'
  },
  {
    title: 'AI 陪聊',
    desc: '随时聊聊，慢慢理清心绪',
    to: '/ai',
    icon: MagicStick,
    tone: 'ai'
  }
]

const posts = [
  {
    id: 101,
    author: '星星落在肩上',
    type: 'ENFP',
    community: 'ENFP 快乐星球',
    time: '2 小时前',
    avatar: 'https://api.dicebear.com/9.x/personas/svg?seed=star',
    title: 'ENFP 的能量恢复方式：独处 + 创造',
    content: ['最近有点累，分享一下我让自己回血的方式：', '1. 独处：给自己一个不被打扰的下午', '2. 创造：画画、写字、做手账...', '3. 和有趣的人聊天：又能充电又能获得新灵感'],
    tags: ['ENFP日常', '能量恢复', '自我关怀'],
    comments: 128,
    replies: 45,
    likes: 352
  },
  {
    id: 102,
    author: '银河便利店',
    type: 'INTJ',
    community: 'MBTI 16 型人格',
    time: '3 小时前',
    avatar: 'https://api.dicebear.com/9.x/personas/svg?seed=galaxy',
    title: 'INTJ 的计划表长什么样？',
    content: ['来分享一下我的周计划表，虽然看起来很满，但其实给自己留了很多思考的时间。', '你们的计划表是什么样的呢？'],
    tags: ['INTJ', '计划表', '时间管理'],
    comments: 96,
    replies: 68,
    likes: 276,
    preview: true
  },
  {
    id: 103,
    author: '小向日葵',
    type: 'ISFP',
    community: '日常碎碎念',
    time: '4 小时前',
    avatar: 'https://api.dicebear.com/9.x/personas/svg?seed=sunflower',
    title: '下雨天的治愈小事',
    content: ['喜欢下雨天的白噪音，泡一杯热茶，看看书，感觉整个世界都慢下来了。'],
    tags: ['ISFP', '生活感', '雨天'],
    comments: 64,
    replies: 22,
    likes: 198
  }
]

const trends = [
  { title: '你们会因为 MBTI 改变自己吗？', count: '12.6k' },
  { title: 'INFJ 的内心世界是怎样的？', count: '8.3k' },
  { title: 'ENFP 的快乐密码是什么？', count: '6.7k' },
  { title: 'INTJ 如何高效学习？', count: '5.2k' },
  { title: 'MBTI 在职场真的有用吗？', count: '4.8k' }
]

const recommendedCommunities = [
  {
    name: 'INFP 小世界',
    members: '7.3k',
    avatar: 'https://api.dicebear.com/9.x/personas/svg?seed=infp'
  },
  {
    name: 'ENTP 头脑风暴',
    members: '6.1k',
    avatar: 'https://api.dicebear.com/9.x/personas/svg?seed=entp'
  },
  {
    name: 'ISFJ 温暖小屋',
    members: '5.4k',
    avatar: 'https://api.dicebear.com/9.x/personas/svg?seed=isfj'
  }
]

const visiblePosts = computed(() => {
  if (activeTab.value === 'latest') return [...posts].reverse()
  return posts
})

function go(path) {
  router.push(path)
}
</script>

<style scoped>
.home-page {
  width: min(100%, 1450px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 246px minmax(0, 1fr) 330px;
  gap: 22px;
  align-items: start;
}

.left-rail,
.right-rail,
.home-feed {
  display: grid;
  gap: 18px;
}

.home-page :deep(.el-card) {
  border: 1px solid rgba(222, 232, 244, .92);
  border-radius: 8px;
  background: rgba(255, 255, 255, .94);
  box-shadow: 0 16px 42px rgba(35, 59, 95, .07);
}

.home-page :deep(.el-card__header) {
  padding: 18px 20px 8px;
  border-bottom: 0;
}

.home-page :deep(.el-card__body) {
  padding: 18px 20px;
}

.profile-panel :deep(.el-card__body) {
  display: grid;
  gap: 18px;
}

.profile-main,
.joined-item,
.recommend-item,
.author-line,
.profile-name,
.panel-title,
.post-head,
.post-actions {
  display: flex;
  align-items: center;
}

.profile-main {
  gap: 13px;
}

.profile-name {
  gap: 7px;
}

.profile-name strong,
.joined-item strong,
.recommend-item strong,
.author-name strong {
  color: #15213b;
  font-weight: 900;
}

.profile-main span,
.joined-item span,
.recommend-item span,
.author-line p,
.trend-item span,
.quote-card small {
  color: #7a8aa2;
  font-size: 13px;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
}

.profile-stats strong,
.profile-stats span {
  display: block;
}

.profile-stats strong {
  color: #17213a;
  font-size: 16px;
}

.profile-stats span {
  margin-top: 4px;
  color: #8492a8;
  font-size: 12px;
}

.publish-button {
  width: 100%;
  min-height: 42px;
  --el-button-bg-color: #ff6657;
  --el-button-border-color: #ff6657;
  --el-button-hover-bg-color: #f25546;
  --el-button-hover-border-color: #f25546;
}

.menu-panel :deep(.el-card__body) {
  display: grid;
  gap: 6px;
  padding: 14px 12px;
}

.side-menu {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 44px;
  padding: 0 12px;
  border-radius: 8px;
  color: #52627b;
  font-weight: 800;
}

.side-menu.active,
.side-menu:hover {
  color: #ef5548;
  background: #fff4f1;
}

.panel-title {
  justify-content: space-between;
  gap: 12px;
  color: #15213b;
  font-weight: 900;
}

.joined-list,
.trend-list,
.recommend-list {
  display: grid;
  gap: 14px;
}

.joined-item {
  position: relative;
  gap: 10px;
}

.joined-item div,
.recommend-item div {
  min-width: 0;
  flex: 1;
}

.joined-item strong,
.joined-item span,
.recommend-item strong,
.recommend-item span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.joined-item i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff574f;
}

.more-link {
  width: 100%;
  margin-top: 14px;
}

.hero-card {
  min-height: 180px;
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, .95fr) minmax(320px, .8fr);
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid rgba(222, 232, 244, .92);
  background:
    linear-gradient(90deg, rgba(255, 255, 255, .98) 0%, rgba(255, 255, 255, .88) 44%, rgba(255, 239, 224, .46) 100%),
    #fff;
  box-shadow: 0 16px 42px rgba(35, 59, 95, .07);
}

.hero-copy {
  position: relative;
  z-index: 2;
  padding: 30px 34px;
}

.hero-copy h1 {
  margin: 0;
  color: #101c36;
  font-size: 28px;
  line-height: 1.3;
  letter-spacing: 0;
}

.hero-copy p {
  margin: 10px 0 22px;
  color: #40516b;
  font-size: 16px;
}

.hero-visual {
  position: relative;
  min-height: 180px;
  background:
    radial-gradient(circle at 22% 28%, rgba(255, 184, 116, .28), transparent 22%),
    radial-gradient(circle at 72% 64%, rgba(88, 174, 222, .22), transparent 28%);
}

.sofa {
  position: absolute;
  right: 34px;
  bottom: 22px;
  width: 270px;
  height: 66px;
  border-radius: 34px 34px 14px 14px;
  background: linear-gradient(180deg, #b9e0ee, #8fc8db);
}

.table {
  position: absolute;
  right: 152px;
  bottom: 22px;
  width: 82px;
  height: 28px;
  border-radius: 50%;
  background: #f3c490;
  box-shadow: 0 20px 0 -11px rgba(125, 77, 36, .35);
}

.person {
  position: absolute;
  bottom: 52px;
  width: 84px;
  height: 100px;
}

.person-left {
  right: 204px;
}

.person-right {
  right: 92px;
}

.person .head {
  position: absolute;
  left: 26px;
  top: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0b083;
  box-shadow: inset 0 8px 0 #51342c;
}

.person .body {
  position: absolute;
  left: 12px;
  top: 34px;
  width: 62px;
  height: 70px;
  border-radius: 26px 26px 14px 14px;
  background: #2f78bd;
  transform: rotate(5deg);
}

.person-right .body {
  background: #ee8f78;
  transform: rotate(-5deg);
}

.plant {
  position: absolute;
  bottom: 26px;
  width: 48px;
  height: 76px;
}

.plant::before,
.plant::after {
  content: "";
  position: absolute;
  border-radius: 80% 10% 80% 10%;
  background: rgba(105, 156, 103, .66);
}

.plant::before {
  width: 34px;
  height: 60px;
  left: 5px;
  transform: rotate(-18deg);
}

.plant::after {
  width: 34px;
  height: 60px;
  right: 0;
  transform: rotate(22deg);
}

.plant-left {
  right: 304px;
}

.plant-right {
  right: 18px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.feature-card {
  min-height: 134px;
  display: flex;
  justify-content: space-between;
  gap: 18px;
  overflow: hidden;
  padding: 26px 22px;
  border: 1px solid rgba(222, 232, 244, .92);
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 16px 42px rgba(35, 59, 95, .06);
  transition: transform .18s ease, box-shadow .18s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 46px rgba(35, 59, 95, .11);
}

.feature-card h2 {
  margin: 0;
  color: #13203b;
  font-size: 21px;
  line-height: 1.2;
}

.feature-card p {
  margin: 16px 0 0;
  color: #61718a;
  line-height: 1.6;
}

.feature-art {
  width: 70px;
  height: 70px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: #2f80ed;
  background: linear-gradient(145deg, #eef7ff, #dff0ff);
  font-size: 30px;
}

.feature-art.test {
  color: #7e79d7;
  background: linear-gradient(145deg, #f5f3ff, #e9e8ff);
}

.feature-art.ai {
  color: #4b73e6;
  background: linear-gradient(145deg, #edf4ff, #e2edff);
}

.feed-card :deep(.el-card__body) {
  padding: 0;
}

.feed-tabs {
  padding: 0 22px;
  border-bottom: 1px solid #e8eef6;
}

.feed-tabs :deep(.el-tabs__header) {
  margin: 0;
}

.feed-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.feed-tabs :deep(.el-tabs__item) {
  height: 62px;
  color: #6f7f96;
  font-size: 16px;
}

.feed-tabs :deep(.el-tabs__item.is-active) {
  color: #14213d;
}

.feed-tabs :deep(.el-tabs__active-bar) {
  height: 2px;
  background: #ff6657;
}

.post-card {
  padding: 24px 22px;
  border-bottom: 1px solid #e8eef6;
}

.post-card:last-child {
  border-bottom: 0;
}

.post-head {
  justify-content: space-between;
  gap: 16px;
}

.author-line {
  min-width: 0;
  gap: 12px;
}

.author-name {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.author-name span {
  color: #8a98ad;
  font-size: 13px;
}

.author-line p {
  margin: 4px 0 0;
}

.post-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  margin-top: 18px;
}

.post-title {
  display: inline-block;
  margin-bottom: 10px;
  color: #121d35;
  font-size: 20px;
  line-height: 1.35;
  font-weight: 900;
}

.post-copy p {
  margin: 0 0 5px;
  color: #34445d;
  line-height: 1.7;
}

.post-preview {
  width: 150px;
  height: 88px;
  display: grid;
  gap: 6px;
  padding: 12px;
  align-self: end;
  border: 1px solid #dce6f3;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(42, 63, 96, .08);
}

.post-preview div {
  height: 5px;
  border-radius: 999px;
  background: linear-gradient(90deg, #f6c46d, #a8d3eb 54%, #b9e3bd);
}

.tag-row {
  margin-top: 16px;
}

.post-actions {
  gap: 56px;
  margin-top: 18px;
  color: #65758e;
}

.post-actions span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.post-actions .liked {
  color: #ff6657;
}

.trend-item {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
}

.trend-item > strong {
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: #7e8da3;
  background: #f1f5fa;
  font-size: 18px;
}

.trend-item > strong.hot {
  color: #ff5f50;
  background: #fff0e9;
}

.trend-item p {
  margin: 1px 0 5px;
  overflow: hidden;
  color: #17213a;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recommend-item {
  gap: 12px;
}

.recommend-item .el-button {
  min-width: 66px;
  border-color: #ff9a90;
  color: #ff6657;
}

.community-cta,
.quote-card {
  border: 1px solid rgba(222, 232, 244, .92);
  border-radius: 8px;
  background: rgba(255, 255, 255, .94);
  box-shadow: 0 16px 42px rgba(35, 59, 95, .07);
}

.community-cta {
  min-height: 216px;
  display: grid;
  justify-items: center;
  align-content: center;
  padding: 28px;
  text-align: center;
  background:
    radial-gradient(circle at 23% 24%, rgba(75, 161, 222, .16), transparent 18%),
    radial-gradient(circle at 79% 74%, rgba(95, 187, 224, .22), transparent 28%),
    linear-gradient(145deg, #f0f9ff, #ffffff 58%, #e8f6ff);
}

.community-cta h3 {
  margin: 0;
  color: #13203b;
  font-size: 20px;
}

.community-cta p {
  margin: 12px 0 22px;
  color: #62728a;
}

.community-cta .el-button {
  min-width: 122px;
  --el-button-bg-color: #ff6657;
  --el-button-border-color: #ff6657;
}

.quote-card {
  padding: 30px 36px;
}

.quote-card span {
  color: #bed7ef;
  font-size: 44px;
  line-height: 1;
  font-family: Georgia, serif;
}

.quote-card p {
  margin: 0;
  color: #26354f;
  font-size: 18px;
  line-height: 1.85;
}

.quote-card small {
  display: block;
  margin-top: 16px;
  text-align: right;
}

@media (max-width: 1280px) {
  .home-page {
    grid-template-columns: 230px minmax(0, 1fr);
  }

  .right-rail {
    grid-column: 1 / -1;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 980px) {
  .home-page,
  .right-rail {
    grid-template-columns: 1fr;
  }

  .hero-card {
    grid-template-columns: 1fr;
  }

  .hero-visual {
    min-height: 160px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hero-copy {
    padding: 24px;
  }

  .hero-copy h1 {
    font-size: 24px;
  }

  .post-body {
    grid-template-columns: 1fr;
  }

  .post-preview {
    width: 100%;
  }

  .post-actions {
    justify-content: space-between;
    gap: 12px;
  }
}
</style>
