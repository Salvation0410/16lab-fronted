<template>
  <div class="home-page">
    <aside class="home-sidebar">
      <section class="profile-panel surface-panel">
        <div class="profile-head">
          <div class="avatar avatar-large">
            <img v-if="profile.avatar" :src="profile.avatar" alt="" />
            <span v-else>{{ profile.initials }}</span>
          </div>
          <div>
            <strong>{{ profile.name }}</strong>
            <span>{{ profile.role }}</span>
            <small>{{ profile.mbti }} · {{ profile.identity }}</small>
          </div>
        </div>

        <dl class="profile-stats">
          <div v-for="item in profile.stats" :key="item.label">
            <dt>{{ item.value }}</dt>
            <dd>{{ item.label }}</dd>
          </div>
        </dl>

        <button class="wide-action" type="button" @click="goCreate">
          <PenLine :size="18" />
          发布新动态
        </button>
      </section>

      <section class="surface-panel compact-panel" aria-label="首页导航">
        <RouterLink v-for="item in shortcuts" :key="item.label" class="side-link" :to="item.to">
          <component :is="item.icon" :size="18" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </section>

      <section id="communities" class="surface-panel compact-panel">
        <div class="panel-title-row">
          <h2>我加入的社区</h2>
          <RouterLink to="/personalities">管理</RouterLink>
        </div>

        <div class="joined-list">
          <RouterLink
              v-for="community in joinedCommunities"
              :key="community.id"
              class="joined-item"
              :to="community.to"
          >
            <span class="community-mark" :class="community.tone">{{ community.short }}</span>
            <span>
              <strong>{{ community.name }}</strong>
              <small>{{ community.members }} 成员</small>
            </span>
            <i v-if="community.active" aria-hidden="true"></i>
          </RouterLink>
        </div>

        <RouterLink class="text-link" to="/personalities">查看更多</RouterLink>
      </section>
    </aside>

    <section class="home-main">
      <section class="home-hero">
        <div class="hero-copy">
          <span class="hero-kicker">今天也遇见同频的人</span>
          <h1>遇见同频的人，理解更多的自己</h1>
          <p>聊性格、日常和那些只有同类才懂的小拧巴。16Lab 把测试、社区和 AI 陪聊放在一起，让认识自己这件事更轻一点。</p>
          <div class="hero-actions">
            <RouterLink class="hero-primary" to="/personalities">
              开始探索
              <ChevronRight :size="18" />
            </RouterLink>
            <RouterLink class="hero-secondary" to="/mbti-test">做一次测试</RouterLink>
          </div>
        </div>

        <div class="hero-scene" aria-hidden="true">
          <div class="scene-card scene-card-left">
            <span>INFP</span>
            <strong>刚刚有人懂了我那句话</strong>
          </div>
          <div class="scene-dialog">
            <div class="dialog-avatar dialog-blue"></div>
            <div class="dialog-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div class="scene-dialog scene-dialog-alt">
            <div class="dialog-avatar dialog-coral"></div>
            <div class="dialog-lines">
              <span></span>
              <span></span>
            </div>
          </div>
          <div class="scene-card scene-card-right">
            <span>今日灵感</span>
            <strong>给 ENFP 的恢复清单</strong>
          </div>
        </div>
      </section>

      <div class="feature-strip">
        <RouterLink v-for="feature in features" :key="feature.title" class="feature-card" :to="feature.to">
          <span class="feature-icon" :class="feature.tone">
            <component :is="feature.icon" :size="24" />
          </span>
          <span>
            <strong>{{ feature.title }}</strong>
            <small>{{ feature.text }}</small>
          </span>
        </RouterLink>
      </div>

      <section class="feed-section">
        <div class="feed-tabs" role="tablist" aria-label="动态筛选">
          <button
              v-for="tab in feedTabs"
              :key="tab.key"
              :class="{ active: activeFeed === tab.key }"
              type="button"
              role="tab"
              :aria-selected="activeFeed === tab.key"
              @click="activeFeed = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>

        <div v-if="searchTerm" class="search-note">
          正在查看和「{{ searchTerm }}」相关的内容
          <button type="button" @click="clearSearch">清除</button>
        </div>

        <article v-for="post in visiblePosts" :key="post.id" class="feed-card">
          <div class="post-topline">
            <div class="author-line">
              <div class="avatar">
                <img v-if="post.avatar" :src="post.avatar" alt="" />
                <span v-else>{{ post.initials }}</span>
              </div>
              <div>
                <strong>{{ post.author }}</strong>
                <span>{{ post.mbti }} · {{ post.time }}</span>
                <small>发布于 {{ post.community }}</small>
              </div>
            </div>
            <button class="more-button" type="button" title="更多">
              <MoreHorizontal :size="20" />
            </button>
          </div>

          <div class="post-body" :class="{ 'has-preview': post.preview }">
            <div class="post-copy">
              <RouterLink class="post-title-link" :to="post.to">{{ post.title }}</RouterLink>
              <p>{{ post.excerpt }}</p>
              <div class="tag-row">
                <RouterLink v-for="tag in post.tags" :key="tag" :to="{ path: '/', query: { q: tag } }">
                  #{{ tag }}
                </RouterLink>
              </div>
            </div>
            <RouterLink v-if="post.preview" class="post-preview" :class="post.preview.tone" :to="post.to">
              <span>{{ post.preview.kicker }}</span>
              <strong>{{ post.preview.title }}</strong>
            </RouterLink>
          </div>

          <div class="post-actions">
            <span><MessageCircle :size="18" />{{ post.comments }}</span>
            <span><Bookmark :size="18" />{{ post.saves }}</span>
            <span><Heart :size="18" />{{ post.likes }}</span>
          </div>
        </article>

        <div v-if="!visiblePosts.length" class="empty-feed">
          {{ emptyText }}
        </div>
      </section>
    </section>

    <aside class="home-rail">
      <section class="surface-panel">
        <div class="panel-title-row">
          <h2>今日趋势</h2>
          <RouterLink to="/personalities">查看更多</RouterLink>
        </div>
        <ol class="trend-list">
          <li v-for="trend in trends" :key="trend.title">
            <span>{{ trend.rank }}</span>
            <div>
              <strong>{{ trend.title }}</strong>
              <small>{{ trend.count }} 讨论</small>
            </div>
          </li>
        </ol>
      </section>

      <section class="surface-panel">
        <div class="panel-title-row">
          <h2>推荐社区</h2>
          <RouterLink to="/personalities">查看更多</RouterLink>
        </div>
        <div class="recommend-list">
          <div v-for="community in recommendedCommunities" :key="community.id" class="recommend-item">
            <span class="community-mark" :class="community.tone">{{ community.short }}</span>
            <div>
              <strong>{{ community.name }}</strong>
              <small>{{ community.members }} 成员</small>
            </div>
            <RouterLink :to="community.to">加入</RouterLink>
          </div>
        </div>
      </section>

      <section class="explore-panel">
        <div>
          <span>还没找到同频的人？</span>
          <strong>去社区逛逛，遇见更多有趣的伙伴吧。</strong>
        </div>
        <RouterLink to="/personalities">探索社区</RouterLink>
      </section>

      <section class="quote-panel">
        <p>性格没有好坏之分。理解自己，接纳自己，就是最好的成长。</p>
        <span>16Lab 社区</span>
      </section>
    </aside>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  Bell,
  Bookmark,
  Bot,
  Brain,
  ChevronRight,
  Clock3,
  Compass,
  Flame,
  Heart,
  Home,
  MessageCircle,
  MoreHorizontal,
  PenLine,
  Sparkles,
  Star,
  UsersRound
} from 'lucide-vue-next'
import { communityApi, postApi } from '../api'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const activeFeed = ref('following')
const feedPosts = ref([])
const communities = ref([])

const feedTabs = [
  { key: 'recommend', label: '推荐' },
  { key: 'following', label: '关注' },
  { key: 'latest', label: '最新' }
]

const shortcuts = [
  { label: '推荐', to: '/', icon: Home },
  { label: '关注', to: '/?tab=following', icon: Bell },
  { label: '话题广场', to: '/personalities', icon: Compass },
  { label: '最新', to: '/?tab=latest', icon: Clock3 },
  { label: '收藏', to: '/?tab=saved', icon: Star }
]

const features = [
  { title: '16 型人格', text: '探索属于你的性格坐标', to: '/personalities', icon: UsersRound, tone: 'blue' },
  { title: 'MBTI 测试', text: '做完就能保存成长记录', to: '/mbti-test', icon: Brain, tone: 'lavender' },
  { title: 'AI 陪聊', text: '把想不通的事慢慢聊开', to: '/ai', icon: Bot, tone: 'mint' }
]

const fallbackPosts = [
  {
    id: 'local-1',
    author: '星星落在肩上',
    initials: '星星',
    mbti: 'ENFP',
    time: '2 小时前',
    community: 'ENFP 快乐星球',
    title: 'ENFP 的能量恢复方式：独处 + 创造',
    excerpt: '最近有点累，分享一下我让自己回血的方式：给自己一个不被打扰的下午，画画、写字、做手账，再和相熟的人聊几句。',
    tags: ['ENFP日常', '能量恢复', '自我关怀'],
    comments: 128,
    saves: 45,
    likes: 352,
    to: '/posts/local-1',
    preview: null
  },
  {
    id: 'local-2',
    author: '银河便利店',
    initials: '银河',
    mbti: 'INTJ',
    time: '3 小时前',
    community: 'MBTI 16 型人格',
    title: 'INTJ 的计划表长什么样？',
    excerpt: '来分享一下我的周计划表，看起来很满，但其实给自己留了很多思考和发呆的时间。效率不是塞满每一分钟。',
    tags: ['INTJ', '计划表', '时间管理'],
    comments: 96,
    saves: 68,
    likes: 276,
    to: '/posts/local-2',
    preview: { kicker: 'Weekly Map', title: '清醒一点的周计划', tone: 'paper' }
  },
  {
    id: 'local-3',
    author: '小向日葵',
    initials: '向葵',
    mbti: 'ISFP',
    time: '4 小时前',
    community: '日常碎碎念',
    title: '下雨天的治愈小事',
    excerpt: '喜欢下雨天的白噪音，泡一杯热茶，翻两页书，感觉整个世界都慢下来了。',
    tags: ['ISFP', '治愈时刻', '雨天'],
    comments: 62,
    saves: 31,
    likes: 188,
    to: '/posts/local-3',
    preview: { kicker: 'Rainy Note', title: '把今天调成慢速', tone: 'rain' }
  }
]

const fallbackCommunities = [
  { id: 'c1', name: 'INFJ · 提倡者之家', short: 'IN', members: '12.6k', tone: 'blue', to: '/personalities', active: true },
  { id: 'c2', name: 'MBTI 16 型人格', short: '16', members: '8.1k', tone: 'coral', to: '/personalities' },
  { id: 'c3', name: '职场生存指南', short: '职', members: '6.7k', tone: 'mint', to: '/personalities' },
  { id: 'c4', name: '日常碎碎念', short: '日', members: '3.2k', tone: 'lavender', to: '/personalities' },
  { id: 'c5', name: 'ENFP 快乐星球', short: 'EN', members: '9.8k', tone: 'rose', to: '/personalities' }
]

const trends = [
  { rank: 1, title: '你们会因为 MBTI 改变自己吗？', count: '12.6k' },
  { rank: 2, title: 'INFJ 的内心世界是怎样的？', count: '8.3k' },
  { rank: 3, title: 'ENFP 的快乐密码是什么？', count: '6.7k' },
  { rank: 4, title: 'INTJ 如何高效学习？', count: '5.2k' },
  { rank: 5, title: 'MBTI 在职场真的有用吗？', count: '4.8k' }
]

const searchTerm = computed(() => String(route.query.q || '').trim())
const profile = computed(() => {
  const name = auth.user?.nickname || auth.user?.username || '小海盐'
  return {
    name,
    initials: String(name).slice(0, 2).toUpperCase(),
    avatar: auth.user?.avatarUrl || '',
    role: auth.isLoggedIn ? '16Lab 探索者' : '游客探索者',
    mbti: auth.user?.mbti || 'INFJ',
    identity: auth.isLoggedIn ? '提倡者' : '先逛逛',
    stats: [
      { label: '关注', value: auth.user?.followingCount || 126 },
      { label: '粉丝', value: auth.user?.followerCount || 342 },
      { label: '获赞', value: auth.user?.likeCount || '1.2k' }
    ]
  }
})
const joinedCommunities = computed(() => communities.value.slice(0, 5))
const recommendedCommunities = computed(() => communities.value.slice(0, 3))
const visiblePosts = computed(() => {
  const term = searchTerm.value.toLowerCase()
  let list = [...feedPosts.value]
  if (activeFeed.value === 'latest') list = list.slice().reverse()
  if (!term) return list
  return list.filter((post) => {
    const text = [post.title, post.excerpt, post.author, post.community, ...(post.tags || [])].join(' ').toLowerCase()
    return text.includes(term)
  })
})
const emptyText = computed(() => {
  if (searchTerm.value) return `没有找到和「${searchTerm.value}」相关的内容`
  return '这里暂时还没有动态'
})

function clearSearch() {
  router.push({ path: '/', query: {} })
}

function goCreate() {
  router.push(auth.isLoggedIn ? '/create' : '/login?redirect=/create')
}

function normalizePost(post, index) {
  const fallback = fallbackPosts[index % fallbackPosts.length]
  const author = post.authorNickname || post.nickname || post.user?.nickname || fallback.author
  return {
    ...fallback,
    id: post.id || fallback.id,
    author,
    initials: String(author).slice(0, 2).toUpperCase(),
    avatar: post.authorAvatar || post.avatarUrl || post.user?.avatarUrl || '',
    mbti: post.mbti || post.user?.mbti || fallback.mbti,
    time: post.createdAt ? '刚刚更新' : fallback.time,
    community: post.communityName || post.community?.name || fallback.community,
    title: post.title || fallback.title,
    excerpt: post.summary || post.contentText || stripTags(post.content || '') || fallback.excerpt,
    tags: Array.isArray(post.tags) && post.tags.length ? post.tags.map((tag) => tag.name || tag).slice(0, 3) : fallback.tags,
    comments: post.commentCount ?? fallback.comments,
    saves: post.favoriteCount ?? fallback.saves,
    likes: post.likeCount ?? fallback.likes,
    to: post.id ? `/posts/${post.id}` : fallback.to
  }
}

function normalizeCommunity(community, index) {
  const fallback = fallbackCommunities[index % fallbackCommunities.length]
  return {
    ...fallback,
    id: community.id || fallback.id,
    name: community.name || fallback.name,
    short: (community.name || fallback.short).slice(0, 2).toUpperCase(),
    members: formatCount(community.memberCount) || fallback.members,
    to: community.id ? `/communities/${community.id}` : fallback.to
  }
}

function stripTags(value) {
  return String(value).replace(/<[^>]+>/g, '').slice(0, 96)
}

function formatCount(value) {
  if (!value && value !== 0) return ''
  if (value >= 10000) return `${(value / 1000).toFixed(1)}k`
  return String(value)
}

async function loadHomeData() {
  feedPosts.value = fallbackPosts
  communities.value = fallbackCommunities

  try {
    const data = await postApi.hot({ page: 1, size: 8 })
    if (Array.isArray(data?.list) && data.list.length) {
      feedPosts.value = data.list.map(normalizePost)
    }
  } catch {
    feedPosts.value = fallbackPosts
  }

  try {
    const data = await communityApi.list({ type: 'MBTI' })
    if (Array.isArray(data) && data.length) {
      communities.value = data.slice(0, 5).map(normalizeCommunity)
    }
  } catch {
    communities.value = fallbackCommunities
  }
}

onMounted(loadHomeData)
</script>