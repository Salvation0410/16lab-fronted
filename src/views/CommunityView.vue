<template>
  <section class="community-page">
    <main class="community-main">
      <nav class="community-breadcrumb" aria-label="面包屑">
        <RouterLink to="/">社区广场</RouterLink>
        <span>/</span>
        <RouterLink to="/personalities">MBTI 社区</RouterLink>
        <span>/</span>
        <strong>{{ community.name }}</strong>
      </nav>

      <section class="community-hero">
        <div class="community-cover" :class="community.coverTone">
          <div class="cover-glow"></div>
          <div class="cover-mascot">
            <div class="mascot-hood"></div>
            <div class="mascot-face"></div>
            <div class="mascot-body"></div>
          </div>
        </div>

        <div class="community-card">
          <div class="community-head">
            <div class="community-lockup">
              <div class="community-avatar" :class="community.coverTone">
                <img v-if="community.avatarUrl" :src="community.avatarUrl" alt="" />
                <span v-else>{{ community.initials }}</span>
              </div>
              <div class="community-copy">
                <div class="community-title-row">
                  <h1>{{ community.name }}</h1>
                  <span>{{ community.typeLabel }}</span>
                </div>
                <p>{{ community.description }}</p>
              </div>
            </div>

            <div class="community-actions">
              <button class="follow-button" type="button" @click="followCommunity">
                <Check v-if="isFollowing" :size="16" />
                <Plus v-else :size="16" />
                {{ isFollowing ? '已关注' : '关注' }}
              </button>
              <button class="subtle-button" type="button">
                <Share2 :size="16" />
                分享
              </button>
              <button class="icon-more" type="button" title="更多">
                <MoreHorizontal :size="18" />
              </button>
            </div>
          </div>

          <div class="community-stats">
            <div v-for="item in community.stats" :key="item.label">
              <component :is="item.icon" :size="16" />
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
            </div>
          </div>

          <div class="community-members">
            <div class="member-stack" aria-hidden="true">
              <span v-for="member in community.memberStack" :key="member.name" :class="member.tone">
                {{ member.short }}
              </span>
            </div>
            <p>等 {{ community.joinedCount }} 位好友已加入</p>
          </div>
        </div>
      </section>

      <section class="community-feed">
        <div class="feed-toolbar">
          <div class="feed-tabs" role="tablist" aria-label="内容筛选">
            <button
              v-for="item in tabs"
              :key="item.key"
              :class="{ active: activeTab === item.key }"
              type="button"
              role="tab"
              :aria-selected="activeTab === item.key"
              @click="activeTab = item.key"
            >
              {{ item.label }}
            </button>
          </div>

          <RouterLink class="publish-post" :to="publishTarget">
            <PenSquare :size="16" />
            发布新帖
          </RouterLink>
        </div>

        <div class="community-notice">
          <div class="notice-left">
            <Megaphone :size="16" />
            <span>公告：</span>
            <p>{{ community.notice }}</p>
          </div>
          <button type="button">
            查看详情
            <ArrowRight :size="14" />
          </button>
        </div>

        <article v-for="post in visiblePosts" :key="post.id" class="community-post">
          <div class="post-header">
            <div class="post-author">
              <div class="author-avatar" :class="post.authorTone">
                <img v-if="post.avatarUrl" :src="post.avatarUrl" alt="" />
                <span v-else>{{ post.initials }}</span>
              </div>
              <div>
                <div class="author-meta">
                  <strong>{{ post.author }}</strong>
                  <span>{{ post.mbti }}</span>
                  <small>{{ post.time }}</small>
                  <i v-if="post.sticky">{{ post.sticky }}</i>
                </div>
              </div>
            </div>

            <button class="icon-more" type="button" title="更多">
              <MoreHorizontal :size="18" />
            </button>
          </div>

          <div class="post-body" :class="{ compact: !post.preview }">
            <div class="post-copy">
              <RouterLink class="post-title" :to="post.to">{{ post.title }}</RouterLink>
              <p>{{ post.excerpt }}</p>
              <div class="post-tags">
                <RouterLink v-for="tag in post.tags" :key="tag" :to="{ path: '/search', query: { q: tag } }">
                  #{{ tag }}
                </RouterLink>
              </div>
            </div>

            <RouterLink
              v-if="post.preview"
              class="post-preview"
              :class="post.preview.tone"
              :style="post.preview.image ? { backgroundImage: `url(${post.preview.image})` } : undefined"
              :to="post.to"
            >
              <span>{{ post.preview.kicker }}</span>
              <strong>{{ post.preview.title }}</strong>
            </RouterLink>
          </div>

          <div class="post-footer">
            <span><MessageCircle :size="17" />{{ post.comments }}</span>
            <span><Bookmark :size="17" />{{ post.saves }}</span>
            <span><Heart :size="17" />{{ post.likes }}</span>
          </div>
        </article>

        <div v-if="!visiblePosts.length" class="community-empty">
          <CircleHelp :size="18" />
          这里还没有符合当前筛选的帖子
        </div>
      </section>
    </main>

    <aside class="community-side">
      <section class="side-panel">
        <div class="side-header">
          <h2>社区规则</h2>
          <button type="button">查看全部</button>
        </div>
        <ol class="rule-list">
          <li v-for="rule in community.rules" :key="rule.title">
            <span>{{ rule.rank }}</span>
            <div>
              <strong>{{ rule.title }}</strong>
              <p>{{ rule.text }}</p>
            </div>
          </li>
        </ol>
      </section>

      <section class="side-panel helper-panel">
        <div class="side-header helper-header">
          <h2>社区小助手</h2>
        </div>
        <div class="helper-body">
          <div class="helper-avatar">
            <div class="mascot-hood"></div>
            <div class="mascot-face"></div>
          </div>
          <div>
            <strong>{{ community.helper.name }}</strong>
            <span>{{ community.helper.tag }}</span>
            <p>{{ community.helper.text }}</p>
          </div>
        </div>
        <button class="helper-button" type="button">私信小助手</button>
      </section>

      <section class="side-panel">
        <div class="side-header">
          <h2>活跃成员</h2>
          <button type="button">查看全部</button>
        </div>
        <div class="member-rank">
          <div v-for="member in community.activeMembers" :key="member.name" class="member-rank-item">
            <span class="rank-mark">{{ member.rank }}</span>
            <div class="author-avatar" :class="member.tone">
              <span>{{ member.short }}</span>
            </div>
            <div class="member-copy">
              <strong>{{ member.name }}</strong>
              <small>{{ member.mbti }}</small>
            </div>
            <em>{{ member.score }}</em>
          </div>
        </div>
      </section>

      <section class="side-panel">
        <div class="side-header">
          <h2>相关社区推荐</h2>
          <button type="button">换一换</button>
        </div>
        <div class="related-list">
          <div v-for="item in community.relatedCommunities" :key="item.name" class="related-item">
            <div class="related-avatar" :class="item.tone">{{ item.short }}</div>
            <div class="related-copy">
              <strong>{{ item.name }}</strong>
              <small>{{ item.type }}</small>
              <small>{{ item.members }} 成员</small>
            </div>
            <RouterLink :to="item.to">关注</RouterLink>
          </div>
        </div>
      </section>
    </aside>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  ArrowRight,
  Bookmark,
  CalendarPlus,
  Check,
  CircleHelp,
  Flame,
  Heart,
  Megaphone,
  MessageCircle,
  MoreHorizontal,
  PenSquare,
  Plus,
  ScrollText,
  Share2,
  UserPlus
} from 'lucide-vue-next'
import { communityApi, interactionApi } from '../api'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const activeTab = ref('hot')
const community = ref(createFallbackCommunity())
const feedPosts = ref(createFallbackPosts())
const isFollowing = ref(false)

const tabs = [
  { key: 'hot', label: '热门' },
  { key: 'latest', label: '最新' },
  { key: 'featured', label: '精华' },
  { key: 'qa', label: '问答' }
]

const publishTarget = computed(() => (auth.isLoggedIn ? '/create' : '/login?redirect=/create'))
const visiblePosts = computed(() => {
  const list = [...feedPosts.value]

  if (activeTab.value === 'latest') {
    return list.slice().sort((left, right) => right.order - left.order)
  }

  if (activeTab.value === 'featured') {
    return list
      .filter((item) => item.sticky || item.likes >= 300)
      .sort((left, right) => right.likes - left.likes)
  }

  if (activeTab.value === 'qa') {
    const questions = list.filter((item) => item.title.includes('？') || item.title.includes('?'))
    return questions.length ? questions : list.slice(0, 2)
  }

  return list
})

function createFallbackCommunity() {
  return {
    name: 'INFJ 小世界',
    initials: 'IN',
    avatarUrl: '',
    typeLabel: 'MBTI 社区',
    description: 'INFJ 的温暖角落，分享内心世界，互相理解与支持，一起摸索理想和现实之间的平衡。',
    coverTone: 'forest',
    notice: '欢迎来到 INFJ 小世界。发帖前先看一眼社区规则，友善交流，慢一点也没关系。',
    joinedCount: 12,
    memberStack: [
      { name: '青禾', short: '青', tone: 'sage' },
      { name: '阿宁', short: '宁', tone: 'peach' },
      { name: '迟迟', short: '迟', tone: 'sky' },
      { name: '知夏', short: '夏', tone: 'gold' },
      { name: '微澜', short: '澜', tone: 'mint' }
    ],
    stats: [
      { label: '帖子', value: '7.3k', icon: ScrollText },
      { label: '关注', value: '12.6k', icon: UserPlus },
      { label: '今日新增', value: '86', icon: CalendarPlus }
    ],
    rules: [
      { rank: 1, title: '保持友善与尊重', text: '请尊重每一位成员的观点和感受，避免人身攻击和嘲讽。' },
      { rank: 2, title: '内容相关', text: '发帖尽量围绕 INFJ 或 MBTI 相关内容，别把社区带偏。' },
      { rank: 3, title: '保护隐私', text: '别公开别人的隐私信息，涉及现实生活的细节请打码。' },
      { rank: 4, title: '禁止恶意行为', text: '引战、刷屏、搬运未授权内容都会被处理。' },
      { rank: 5, title: '文明发帖', text: '标题尽量清楚，内容别太空，带上合适标签会更容易被看到。' }
    ],
    helper: {
      name: '小 INFJ',
      tag: '官方',
      text: '有社区规则、发帖标签或者举报相关的问题，都可以来问我。'
    },
    activeMembers: [
      { rank: 1, name: '星星落在肩上', short: '星', mbti: 'INFJ', score: '3.2k 积分', tone: 'sky' },
      { rank: 2, name: '温柔的自由人', short: '温', mbti: 'INFJ', score: '2.8k 积分', tone: 'peach' },
      { rank: 3, name: '想去看海', short: '海', mbti: 'INFJ', score: '2.5k 积分', tone: 'sage' }
    ],
    relatedCommunities: [
      { name: 'INTJ 城堡', type: 'MBTI 社区', members: '8.6k', short: 'IJ', tone: 'indigo', to: '/personalities' },
      { name: 'INFP 治愈馆', type: 'MBTI 社区', members: '9.1k', short: 'FP', tone: 'mint', to: '/personalities' },
      { name: 'ENFP 快乐星球', type: 'MBTI 社区', members: '15.8k', short: 'EN', tone: 'peach', to: '/personalities' }
    ]
  }
}

function createFallbackPosts() {
  return [
    {
      id: 'local-community-1',
      author: '星星落在肩上',
      initials: '星',
      authorTone: 'sky',
      avatarUrl: '',
      mbti: 'INFJ',
      time: '2 小时前',
      sticky: '置顶',
      title: 'INFJ 的能量恢复方式：独处 + 创造',
      excerpt: '作为 INFJ，独处对我来说不是逃避，而是充电。我喜欢在安静的环境里写日记、画画、整理思绪，这些方式让我重新连上自己。',
      tags: ['INFJ', '能量恢复', '独处时光'],
      comments: 128,
      saves: 45,
      likes: 352,
      order: 4,
      to: '/posts/local-community-1',
      preview: { kicker: 'Quiet Room', title: '留一点安静给自己', tone: 'room', image: '' }
    },
    {
      id: 'local-community-2',
      author: '温柔的自由人',
      initials: '温',
      authorTone: 'peach',
      avatarUrl: '',
      mbti: 'INFJ',
      time: '5 小时前',
      sticky: '',
      title: '如何判断自己是不是真的 INFJ？',
      excerpt: '做了好几次测试，结果都是 INFJ，但还是会怀疑自己是不是太理想化了。有没有同样经历过“下页究竟是谁”的阶段？',
      tags: ['INFJ', '自我认识', 'MBTI测试'],
      comments: 208,
      saves: 134,
      likes: 589,
      order: 3,
      to: '/posts/local-community-2',
      preview: { kicker: 'Sunset Talk', title: '把疑惑摊开聊一聊', tone: 'sunset', image: '' }
    },
    {
      id: 'local-community-3',
      author: '想去看海',
      initials: '海',
      authorTone: 'sage',
      avatarUrl: '',
      mbti: 'INFJ',
      time: '1 天前',
      sticky: '',
      title: 'INFJ 的社交：慢热但真诚',
      excerpt: '我不是不喜欢社交，只是需要时间确认这段关系值不值得认真投入。一旦认定了，就会想一直陪着对方走下去。',
      tags: ['INFJ', '社交', '人际关系'],
      comments: 77,
      saves: 32,
      likes: 189,
      order: 2,
      to: '/posts/local-community-3',
      preview: { kicker: 'Night Table', title: '慢一点也能靠近', tone: 'night', image: '' }
    },
    {
      id: 'local-community-4',
      author: '森林里的小鹿',
      initials: '鹿',
      authorTone: 'gold',
      avatarUrl: '',
      mbti: 'INFJ',
      time: '2 天前',
      sticky: '',
      title: 'INFJ 的理想生活是什么样的？',
      excerpt: '有书，有音乐，有植物，有几个能深聊的朋友，还有一只猫。热闹不需要很多，刚刚好就够了。',
      tags: ['INFJ', '理想生活', '慢节奏'],
      comments: 65,
      saves: 49,
      likes: 240,
      order: 1,
      to: '/posts/local-community-4',
      preview: { kicker: 'Soft Morning', title: '我想过的那种日子', tone: 'morning', image: '' }
    }
  ]
}

function formatCompact(value, fallback) {
  if (value === null || value === undefined || value === '') return fallback
  const numeric = Number(value)
  if (!Number.isNaN(numeric)) {
    if (numeric >= 10000) return `${(numeric / 1000).toFixed(1)}k`
    return String(numeric)
  }
  return String(value)
}

function createTone(index) {
  const tones = ['sky', 'peach', 'sage', 'gold', 'mint']
  return tones[index % tones.length]
}

function normalizeCommunity(payload) {
  const fallback = createFallbackCommunity()
  const name = payload?.name || fallback.name
  return {
    ...fallback,
    name,
    initials: String(name).slice(0, 2).toUpperCase(),
    avatarUrl: payload?.avatarUrl || payload?.iconUrl || '',
    typeLabel: payload?.categoryName || payload?.typeName || fallback.typeLabel,
    description: payload?.description || fallback.description,
    notice: payload?.announcement || fallback.notice,
    joinedCount: payload?.friendJoinCount || fallback.joinedCount,
    stats: [
      { label: '帖子', value: formatCompact(payload?.postCount, fallback.stats[0].value), icon: ScrollText },
      { label: '关注', value: formatCompact(payload?.followCount || payload?.memberCount, fallback.stats[1].value), icon: UserPlus },
      { label: '今日新增', value: formatCompact(payload?.todayCount || payload?.dailyNewCount, fallback.stats[2].value), icon: CalendarPlus }
    ]
  }
}

function stripTags(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizePost(payload, index) {
  const fallback = createFallbackPosts()[index % createFallbackPosts().length]
  const author = payload?.authorNickname || payload?.nickname || payload?.user?.nickname || fallback.author
  const title = payload?.title || fallback.title
  return {
    ...fallback,
    id: payload?.id || fallback.id,
    author,
    initials: String(author).slice(0, 1).toUpperCase(),
    authorTone: createTone(index),
    avatarUrl: payload?.authorAvatar || payload?.avatarUrl || payload?.user?.avatarUrl || '',
    mbti: payload?.mbti || payload?.user?.mbti || fallback.mbti,
    time: payload?.createdAt ? '刚刚更新' : fallback.time,
    sticky: payload?.isPinned ? '置顶' : fallback.sticky,
    title,
    excerpt: payload?.summary || stripTags(payload?.contentText || payload?.content) || fallback.excerpt,
    tags: Array.isArray(payload?.tags) && payload.tags.length
      ? payload.tags.map((item) => item.name || item).slice(0, 3)
      : fallback.tags,
    comments: payload?.commentCount ?? fallback.comments,
    saves: payload?.favoriteCount ?? fallback.saves,
    likes: payload?.likeCount ?? fallback.likes,
    order: payload?.createdAt ? createFallbackPosts().length + index : fallback.order,
    to: payload?.id ? `/posts/${payload.id}` : fallback.to,
    preview: payload?.coverUrl
      ? { kicker: fallback.preview.kicker, title: fallback.preview.title, tone: 'image', image: payload.coverUrl }
      : fallback.preview
  }
}

function withFallbackPosts(items) {
  if (items.length >= 4) return items
  const extras = createFallbackPosts()
    .slice(0, 4 - items.length)
    .map((item, index) => ({
      ...item,
      id: `${item.id}-extra-${index}`
    }))
  return [...items, ...extras]
}

async function loadFeedPosts() {
  const communityId = route.params.id

  try {
    const response = await communityApi.posts(communityId, { sort: activeTab.value === 'latest' ? 'latest' : 'hot', page: 1, size: 20 })
    if (Array.isArray(response?.list) && response.list.length) {
      feedPosts.value = withFallbackPosts(response.list.map(normalizePost))
      return
    }
  } catch {
    // fall through to fallback posts
  }

  feedPosts.value = createFallbackPosts()
}

async function loadCommunityMeta() {
  const communityId = route.params.id

  try {
    const detail = await communityApi.detail(communityId)
    community.value = normalizeCommunity(detail)
    isFollowing.value = Boolean(detail?.isFollowing)
  } catch {
    community.value = createFallbackCommunity()
  }

  try {
    const list = await communityApi.list({ type: 'MBTI' })
    if (Array.isArray(list) && list.length) {
      const related = list
        .filter((item) => String(item.id) !== String(communityId))
        .slice(0, 3)
        .map((item, index) => ({
          name: item.name,
          type: item.categoryName || 'MBTI 社区',
          members: formatCompact(item.memberCount, createFallbackCommunity().relatedCommunities[index]?.members || '8.0k'),
          short: String(item.name || '').slice(0, 2).toUpperCase() || createFallbackCommunity().relatedCommunities[index]?.short || 'MB',
          tone: ['indigo', 'mint', 'peach'][index % 3],
          to: `/communities/${item.id}`
        }))

      if (related.length) {
        community.value = {
          ...community.value,
          relatedCommunities: related
        }
      }
    }
  } catch {
    // keep fallback communities
  }
}

async function loadCommunityPage() {
  community.value = createFallbackCommunity()
  feedPosts.value = createFallbackPosts()
  isFollowing.value = false

  await loadCommunityMeta()
  await loadFeedPosts()
}

async function followCommunity() {
  if (!auth.isLoggedIn) {
    router.push(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }

  try {
    await interactionApi.followCommunity(route.params.id)
    isFollowing.value = true
  } catch {
    isFollowing.value = true
  }
}

watch(
  () => route.params.id,
  () => {
    loadCommunityPage()
  },
  { immediate: true }
)

watch(activeTab, () => {
  if (activeTab.value === 'hot' || activeTab.value === 'latest') {
    loadFeedPosts()
  }
})
</script>

<style scoped>
.community-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 318px;
  gap: 20px;
  width: min(100%, 1380px);
  margin: 0 auto;
}

.community-main {
  min-width: 0;
  display: grid;
  gap: 16px;
}

.community-side {
  position: sticky;
  top: 96px;
  display: grid;
  align-content: start;
  gap: 16px;
  height: max-content;
}

.community-breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #95a2b6;
  font-size: 13px;
}

.community-breadcrumb strong {
  color: #5c6a80;
  font-weight: 800;
}

.community-hero,
.community-post,
.side-panel,
.community-notice,
.community-empty {
  border: 1px solid rgba(224, 230, 239, .92);
  border-radius: 8px;
  background: rgba(255, 255, 255, .95);
  box-shadow: 0 16px 40px rgba(48, 68, 103, .07);
}

.community-hero {
  overflow: hidden;
}

.community-cover {
  position: relative;
  min-height: 168px;
  overflow: hidden;
}

.community-cover.forest {
  background:
    radial-gradient(circle at 18% 16%, rgba(255, 250, 239, .72), transparent 22%),
    radial-gradient(circle at 72% 20%, rgba(255, 255, 255, .35), transparent 22%),
    linear-gradient(145deg, #cfe7c1, #c0dfbd 34%, #99c59b 68%, #8ab59a);
}

.community-cover::before,
.community-cover::after {
  content: "";
  position: absolute;
  inset: auto;
  border-radius: 999px 999px 0 0;
}

.community-cover::before {
  left: -3%;
  bottom: -56px;
  width: 42%;
  height: 120px;
  background: rgba(93, 148, 102, .2);
}

.community-cover::after {
  right: -6%;
  bottom: -52px;
  width: 52%;
  height: 138px;
  background: rgba(104, 156, 111, .28);
}

.cover-glow {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, .26), rgba(255, 255, 255, 0) 50%),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, .06) 0 1px, transparent 1px 60px);
}

.cover-mascot {
  position: absolute;
  right: 88px;
  bottom: -6px;
  width: 174px;
  height: 174px;
}

.mascot-hood {
  position: absolute;
  inset: 10px 22px 38px;
  border-radius: 48% 48% 44% 44%;
  background: linear-gradient(180deg, #f7fff5, #e8f4e6);
  box-shadow: inset 0 0 0 2px rgba(87, 142, 101, .1);
}

.mascot-hood::before,
.mascot-hood::after {
  content: "";
  position: absolute;
  top: 14px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #7fb085;
}

.mascot-hood::before {
  left: 10px;
}

.mascot-hood::after {
  right: 10px;
}

.mascot-face {
  position: absolute;
  left: 58px;
  top: 46px;
  width: 58px;
  height: 64px;
  border-radius: 46% 46% 48% 48%;
  background: #f6d9c4;
  box-shadow: inset 0 -8px 0 rgba(227, 168, 134, .18);
}

.mascot-face::before,
.mascot-face::after {
  content: "";
  position: absolute;
  top: 26px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #394768;
}

.mascot-face::before {
  left: 16px;
}

.mascot-face::after {
  right: 16px;
}

.mascot-body {
  position: absolute;
  left: 40px;
  right: 42px;
  bottom: 8px;
  height: 82px;
  border-radius: 34px 34px 20px 20px;
  background: linear-gradient(180deg, #88c18e, #5c8f64);
}

.community-card {
  display: grid;
  gap: 18px;
  margin: -42px 18px 18px;
  padding: 20px 22px 18px;
  border: 1px solid rgba(224, 230, 239, .9);
  border-radius: 8px;
  background: rgba(255, 255, 255, .98);
  box-shadow: 0 20px 44px rgba(43, 64, 96, .08);
}

.community-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.community-lockup {
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 16px;
  align-items: center;
}

.community-avatar {
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 18px;
  color: #fff;
  font-size: 22px;
  font-weight: 900;
}

.community-avatar.forest {
  background: linear-gradient(145deg, #8dc191, #5d8d65);
}

.community-avatar img,
.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.community-copy {
  min-width: 0;
}

.community-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.community-title-row h1 {
  margin: 0;
  color: #16213d;
  font-size: 23px;
  line-height: 1.25;
}

.community-title-row span {
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0 10px;
  color: #5f9f6c;
  background: #edf8ef;
  font-size: 12px;
  font-weight: 800;
}

.community-copy p {
  max-width: 560px;
  margin: 10px 0 0;
  color: #5b6980;
  line-height: 1.7;
}

.community-actions {
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 10px;
  align-items: start;
}

.follow-button,
.publish-post {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-radius: 10px;
  padding: 0 18px;
  color: #fff;
  background: linear-gradient(180deg, #ff7565, #ff5448);
  box-shadow: 0 12px 24px rgba(255, 93, 76, .18);
  font-weight: 900;
}

.subtle-button,
.icon-more {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #e1e7f0;
  border-radius: 10px;
  padding: 0 14px;
  color: #4d5a73;
  background: #fff;
  font-weight: 800;
}

.icon-more {
  width: 42px;
  padding: 0;
}

.community-stats {
  display: grid;
  grid-template-columns: repeat(3, max-content);
  gap: 26px;
}

.community-stats div {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #8793a6;
}

.community-stats strong {
  color: #24324d;
}

.community-members {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.community-members p {
  margin: 0;
  color: #6f7c90;
}

.member-stack {
  display: flex;
}

.member-stack span {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  margin-left: -8px;
  border: 2px solid #fff;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  font-weight: 900;
}

.member-stack span:first-child {
  margin-left: 0;
}

.sage,
.author-avatar.sage,
.member-stack .sage,
.related-avatar.sage {
  background: linear-gradient(145deg, #86bb8d, #5f8f69);
}

.peach,
.author-avatar.peach,
.member-stack .peach,
.related-avatar.peach {
  background: linear-gradient(145deg, #ffb28f, #e9866f);
}

.sky,
.author-avatar.sky,
.member-stack .sky,
.related-avatar.sky {
  background: linear-gradient(145deg, #7bb6ff, #4b82d9);
}

.gold,
.author-avatar.gold,
.member-stack .gold {
  background: linear-gradient(145deg, #f6c67c, #df9d4e);
}

.mint,
.author-avatar.mint,
.member-stack .mint,
.related-avatar.mint {
  background: linear-gradient(145deg, #72d2c1, #2fa48d);
}

.indigo,
.related-avatar.indigo {
  background: linear-gradient(145deg, #6d7cf5, #4653c2);
}

.feed-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.feed-tabs {
  min-height: 58px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  border: 1px solid rgba(224, 230, 239, .9);
  border-radius: 8px;
  background: rgba(255, 255, 255, .95);
  box-shadow: 0 16px 40px rgba(48, 68, 103, .05);
}

.feed-tabs button {
  position: relative;
  min-height: 40px;
  border: 0;
  padding: 0 12px;
  color: #7a8699;
  background: transparent;
  font-weight: 800;
}

.feed-tabs button::after {
  content: "";
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 0;
  height: 2px;
  border-radius: 99px;
  background: transparent;
}

.feed-tabs button.active {
  color: #19233e;
}

.feed-tabs button.active::after {
  background: #ff624f;
}

.community-notice {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 16px;
  color: #60708a;
  background: linear-gradient(90deg, #fff6f2, #fffdfb);
}

.notice-left {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.notice-left span {
  color: #ff6a52;
  font-weight: 900;
}

.notice-left p {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.community-notice button,
.side-header button {
  border: 0;
  color: #ff744f;
  background: transparent;
  font-weight: 800;
}

.community-post {
  padding: 20px;
}

.post-header,
.post-author,
.post-footer {
  display: flex;
  align-items: center;
}

.post-header {
  justify-content: space-between;
  gap: 12px;
}

.post-author {
  min-width: 0;
  gap: 12px;
}

.author-avatar,
.related-avatar,
.helper-avatar {
  flex: 0 0 auto;
}

.author-avatar {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  color: #fff;
  font-size: 15px;
  font-weight: 900;
}

.author-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.author-meta strong {
  color: #1b2742;
}

.author-meta span {
  min-height: 22px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0 8px;
  color: #527fe7;
  background: #eef5ff;
  font-size: 12px;
  font-weight: 800;
}

.author-meta small {
  color: #8a96a9;
}

.author-meta i {
  min-height: 22px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0 8px;
  color: #ff6b54;
  background: #fff0ec;
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
}

.post-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 170px;
  gap: 18px;
  margin-top: 18px;
}

.post-body.compact {
  grid-template-columns: 1fr;
}

.post-title {
  display: block;
  color: #18233f;
  font-size: 18px;
  line-height: 1.45;
  font-weight: 900;
}

.post-copy p {
  margin: 10px 0 0;
  color: #46536d;
  line-height: 1.78;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.post-tags a {
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  padding: 0 10px;
  color: #3684ff;
  background: #edf6ff;
  font-size: 13px;
  font-weight: 800;
}

.post-preview {
  min-height: 118px;
  display: grid;
  align-content: end;
  gap: 8px;
  overflow: hidden;
  padding: 14px;
  border-radius: 8px;
  background-position: center;
  background-size: cover;
}

.post-preview span {
  color: rgba(23, 33, 57, .65);
  font-size: 12px;
  font-weight: 900;
}

.post-preview strong {
  color: #1a2743;
  line-height: 1.35;
}

.post-preview.room {
  background:
    radial-gradient(circle at 72% 24%, rgba(255, 244, 220, .82), transparent 18%),
    linear-gradient(145deg, #eef6e8, #fdf5eb 52%, #d7ebda),
    #f5efe8;
}

.post-preview.sunset {
  background:
    radial-gradient(circle at 70% 28%, rgba(255, 242, 186, .96), transparent 12%),
    linear-gradient(180deg, #ffb08b 0, #ff8a67 32%, #8ab0de 72%, #4f79b5);
}

.post-preview.night {
  background:
    radial-gradient(circle at 54% 68%, rgba(255, 212, 145, .24), transparent 18%),
    linear-gradient(145deg, #8bb0d6, #56749c 42%, #314863);
}

.post-preview.morning {
  background:
    radial-gradient(circle at 72% 24%, rgba(255, 245, 224, .86), transparent 16%),
    linear-gradient(145deg, #f2f7ed, #f8efe5 44%, #dbeeda);
}

.post-preview.image {
  background-color: #dce8ef;
}

.post-footer {
  gap: 28px;
  margin-top: 18px;
  color: #6c788d;
}

.post-footer span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.post-footer span:last-child {
  color: #ff624f;
}

.community-empty {
  min-height: 132px;
  display: grid;
  place-items: center;
  gap: 10px;
  color: #7d889a;
}

.side-panel {
  padding: 18px;
}

.side-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.side-header h2 {
  margin: 0;
  color: #18233f;
  font-size: 17px;
}

.rule-list {
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.rule-list li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
}

.rule-list li > span {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: #ff6d53;
  background: #fff1ec;
  font-weight: 900;
}

.rule-list strong {
  display: block;
  color: #1f2b47;
  line-height: 1.35;
}

.rule-list p {
  margin: 6px 0 0;
  color: #728093;
  line-height: 1.65;
}

.helper-panel {
  background: linear-gradient(180deg, rgba(255, 255, 255, .98), rgba(246, 251, 247, .96));
}

.helper-body {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: center;
}

.helper-avatar {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: linear-gradient(145deg, #e9f4e7, #d4ead4);
}

.helper-avatar .mascot-hood {
  inset: 7px 11px 19px;
}

.helper-avatar .mascot-face {
  left: 21px;
  top: 18px;
  width: 22px;
  height: 26px;
}

.helper-avatar .mascot-face::before,
.helper-avatar .mascot-face::after {
  top: 10px;
  width: 3px;
  height: 3px;
}

.helper-avatar .mascot-face::before {
  left: 6px;
}

.helper-avatar .mascot-face::after {
  right: 6px;
}

.helper-body strong {
  display: inline-block;
  color: #1c2943;
}

.helper-body span {
  margin-left: 8px;
  color: #ff6a52;
  font-size: 12px;
  font-weight: 800;
}

.helper-body p {
  margin: 8px 0 0;
  color: #6c798d;
  line-height: 1.65;
}

.helper-button {
  width: 100%;
  min-height: 40px;
  margin-top: 16px;
  border: 0;
  border-radius: 10px;
  color: #fff;
  background: linear-gradient(180deg, #ff7565, #ff5448);
  font-weight: 900;
  box-shadow: 0 12px 24px rgba(255, 93, 76, .16);
}

.member-rank,
.related-list {
  display: grid;
  gap: 14px;
}

.member-rank-item {
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
}

.rank-mark {
  width: 18px;
  color: #ff8b45;
  font-size: 13px;
  font-weight: 900;
}

.member-copy strong,
.related-copy strong {
  display: block;
  color: #1c2943;
}

.member-copy small,
.related-copy small {
  display: block;
  margin-top: 4px;
  color: #7f8b9e;
}

.member-rank-item em {
  color: #6b778d;
  font-style: normal;
}

.related-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
}

.related-avatar {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: #fff;
  font-size: 13px;
  font-weight: 900;
}

.related-item a {
  min-width: 58px;
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffc9c1;
  border-radius: 9px;
  color: #ff5d50;
  font-weight: 900;
}

@media (max-width: 1240px) {
  .community-page {
    grid-template-columns: 1fr;
  }

  .community-side {
    position: static;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 920px) {
  .community-head,
  .feed-toolbar,
  .community-notice {
    flex-direction: column;
    align-items: stretch;
  }

  .community-actions {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .community-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .post-body {
    grid-template-columns: 1fr;
  }

  .community-side {
    grid-template-columns: 1fr;
  }

  .cover-mascot {
    right: 24px;
    transform: scale(.88);
    transform-origin: bottom right;
  }
}

@media (max-width: 680px) {
  .community-card {
    margin: -34px 12px 12px;
    padding: 16px;
  }

  .community-lockup {
    grid-template-columns: 1fr;
  }

  .community-avatar {
    width: 64px;
    height: 64px;
  }

  .community-actions {
    grid-template-columns: 1fr;
  }

  .feed-tabs {
    overflow-x: auto;
  }

  .post-footer {
    justify-content: space-between;
    gap: 12px;
  }

  .community-notice {
    padding: 14px 16px;
  }

  .notice-left p {
    white-space: normal;
  }
}
</style>
