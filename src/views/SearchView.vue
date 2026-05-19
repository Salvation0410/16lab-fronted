<template>
  <div class="search-page">
    <header class="search-header">
      <div class="header-inner">
        <RouterLink class="brand-lockup" to="/">
          <span class="brand-name">16Lab</span>
          <span class="brand-subtitle">MBTI 社区</span>
        </RouterLink>

        <nav class="top-nav" aria-label="主导航">
          <RouterLink to="/">首页</RouterLink>
          <RouterLink to="/search">发现</RouterLink>
          <RouterLink to="/square">社区</RouterLink>
          <RouterLink to="/mbti-test">测试</RouterLink>
          <RouterLink to="/ai">AI 陪聊</RouterLink>
        </nav>

        <form class="header-search" @submit.prevent="performSearch">
          <Search :size="17" />
          <input v-model="keyword" aria-label="搜索关键词" />
          <button v-if="keyword" type="button" aria-label="清空搜索" @click="keyword = ''">
            <X :size="16" />
          </button>
        </form>

        <div class="header-actions">
          <RouterLink class="publish-button" to="/create">
            <Plus :size="17" />
            发布
          </RouterLink>
          <RouterLink class="header-icon" to="/notifications" aria-label="通知">
            <Bell :size="19" />
          </RouterLink>
          <button class="header-icon" type="button" aria-label="私信">
            <Mail :size="19" />
          </button>
          <button class="profile-button" type="button" aria-label="个人主页">
            <img :src="profileAvatar" alt="" />
            <ChevronDown :size="16" />
          </button>
        </div>
      </div>
    </header>

    <main class="search-shell">
      <aside class="filter-panel" aria-label="搜索筛选">
        <h1>搜索筛选</h1>

        <section class="filter-section">
          <h2>内容类型</h2>
          <label
            v-for="option in contentTypes"
            :key="option.value"
            class="filter-option"
            :class="{ active: contentType === option.value }"
          >
            <input v-model="contentType" type="radio" name="contentType" :value="option.value" />
            <span class="radio-dot" />
            <span class="filter-label">{{ option.label }}</span>
            <span v-if="option.count" class="filter-count">{{ option.count }}</span>
          </label>
        </section>

        <section class="filter-section">
          <h2>发布时间</h2>
          <label
            v-for="option in timeOptions"
            :key="option.value"
            class="filter-option"
            :class="{ active: timeRange === option.value }"
          >
            <input v-model="timeRange" type="radio" name="timeRange" :value="option.value" />
            <span class="radio-dot" />
            <span class="filter-label">{{ option.label }}</span>
            <span v-if="option.count" class="filter-count">{{ option.count }}</span>
            <CalendarDays v-if="option.value === 'custom'" :size="15" class="option-icon" />
          </label>
        </section>

        <section class="filter-section">
          <h2>相关人格 <small>可多选</small></h2>
          <label
            v-for="option in personalityOptions"
            :key="option.value"
            class="filter-option check-option"
            :class="{ active: selectedPersonalities.includes(option.value) }"
          >
            <input
              type="checkbox"
              :checked="selectedPersonalities.includes(option.value)"
              @change="togglePersonality(option.value)"
            />
            <span class="check-box">
              <Check v-if="selectedPersonalities.includes(option.value)" :size="13" />
            </span>
            <span class="filter-label">{{ option.label }}</span>
            <span class="filter-count">{{ option.count }}</span>
          </label>
          <button class="more-filter" type="button">展开更多</button>
        </section>

        <div class="filter-actions">
          <button class="reset-button" type="button" @click="resetFilters">重置</button>
          <button class="apply-button" type="button" @click="performSearch">筛选</button>
        </div>
      </aside>

      <section class="result-column" aria-label="搜索结果">
        <div class="search-entry">
          <form class="main-search" @submit.prevent="performSearch">
            <Search :size="23" />
            <input v-model="keyword" aria-label="搜索关键词" />
            <button v-if="keyword" type="button" aria-label="清空搜索" @click="keyword = ''">
              <X :size="20" />
            </button>
          </form>
          <button class="clear-link" type="button" @click="clearSearch">清空搜索</button>
        </div>

        <div class="tabs-row" role="tablist" aria-label="结果类型">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            role="tab"
            :aria-selected="activeTab === tab.value"
            :class="{ active: activeTab === tab.value }"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
            <span>{{ tab.count }}</span>
          </button>
        </div>

        <div class="result-toolbar">
          <div class="select-group">
            <button type="button">
              综合排序
              <ChevronDown :size="16" />
            </button>
            <button type="button">
              时间不限
              <ChevronDown :size="16" />
            </button>
          </div>
          <div class="quick-checks">
            <label>
              <input v-model="onlyFeatured" type="checkbox" />
              <span />
              只看精华
            </label>
            <label>
              <input v-model="onlyWithImage" type="checkbox" />
              <span />
              只看有图
            </label>
          </div>
          <p>找到约 {{ formattedResultCount }} 条结果</p>
        </div>

        <article v-for="item in visiblePosts" :key="item.id" class="result-card">
          <div class="post-head">
            <img class="avatar" :src="item.avatar" alt="" />
            <div>
              <div class="author-line">
                <strong>{{ item.author }}</strong>
                <span>{{ item.mbti }}</span>
                <small>· {{ item.time }}</small>
              </div>
            </div>
            <button type="button" aria-label="更多操作">
              <MoreHorizontal :size="21" />
            </button>
          </div>

          <div class="post-body">
            <div class="post-copy">
              <h2>{{ item.title }}</h2>
              <p>
                <template v-for="(part, index) in item.excerpt" :key="`${item.id}-${index}`">
                  <mark v-if="part.mark">{{ part.text }}</mark>
                  <span v-else>{{ part.text }}</span>
                </template>
              </p>
              <div class="tag-row">
                <span v-for="tag in item.tags" :key="tag">#{{ tag }}</span>
              </div>
            </div>
            <img v-if="item.image" class="post-image" :src="item.image" :alt="item.imageAlt" />
          </div>

          <div class="metric-row">
            <span>
              <MessageCircle :size="17" />
              {{ item.comments }}
            </span>
            <span>
              <MessagesSquare :size="17" />
              {{ item.replies }}
            </span>
            <span class="like">
              <Heart :size="17" fill="currentColor" />
              {{ item.likes }}
            </span>
          </div>
        </article>

        <div class="recommend-strip">
          <div class="strip-visual">
            <Search :size="36" />
          </div>
          <div>
            <strong>没有找到相关结果</strong>
            <p>换个关键词试试，或者看看下面的推荐内容。</p>
          </div>
          <button type="button">查看推荐内容</button>
        </div>
      </section>

      <aside class="right-column" aria-label="相关推荐">
        <section class="side-card">
          <div class="side-title">
            <h2>相关用户</h2>
            <button type="button">
              查看全部
              <ChevronRight :size="16" />
            </button>
          </div>
          <div class="side-list">
            <div v-for="user in relatedUsers" :key="user.name" class="user-row">
              <img :src="user.avatar" alt="" />
              <div>
                <strong>{{ user.name }}</strong>
                <span>{{ user.fans }}</span>
              </div>
              <em>{{ user.mbti }}</em>
              <button type="button">关注</button>
            </div>
          </div>
        </section>

        <section class="side-card">
          <div class="side-title">
            <h2>相关社区</h2>
            <button type="button">
              查看全部
              <ChevronRight :size="16" />
            </button>
          </div>
          <div class="side-list">
            <div v-for="community in relatedCommunities" :key="community.name" class="community-row">
              <span :style="{ background: community.color }">{{ community.initial }}</span>
              <div>
                <strong>{{ community.name }}</strong>
                <small>{{ community.members }} 成员</small>
              </div>
              <button type="button">加入</button>
            </div>
          </div>
        </section>

        <section class="guide-card">
          <div>
            <h2>没找到想要的内容?</h2>
            <p>试试这些热门内容吧</p>
            <ul>
              <li>INFJ 和 INFP 的区别</li>
              <li>INFJ 适合什么工作?</li>
              <li>INFJ 的爱情观</li>
              <li>如何与 INFJ 相处?</li>
            </ul>
            <RouterLink to="/mbti-test">换个关键词试试</RouterLink>
          </div>
          <div class="guide-visual" aria-hidden="true">
            <span class="cloud cloud-a" />
            <span class="cloud cloud-b" />
            <span class="box" />
            <Sparkles :size="28" />
          </div>
        </section>
      </aside>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Heart,
  Mail,
  MessageCircle,
  MessagesSquare,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  X
} from 'lucide-vue-next'

const route = useRoute()
const keyword = ref(route.query.q || 'INFJ')
const committedKeyword = ref(keyword.value || 'INFJ')
const activeTab = ref('all')
const contentType = ref('all')
const timeRange = ref('any')
const selectedPersonalities = ref(['不限'])
const onlyFeatured = ref(false)
const onlyWithImage = ref(false)

const profileAvatar =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80'

const contentTypes = [
  { value: 'all', label: '全部' },
  { value: 'post', label: '帖子', count: '1,234' },
  { value: 'user', label: '用户', count: '328' },
  { value: 'community', label: '社区', count: '86' }
]

const timeOptions = [
  { value: 'any', label: '时间不限' },
  { value: 'day', label: '一天内', count: '186' },
  { value: 'week', label: '一周内', count: '482' },
  { value: 'month', label: '一月内', count: '1,024' },
  { value: 'custom', label: '自定义' }
]

const personalityOptions = [
  { value: '不限', label: '不限', count: '' },
  { value: 'INFJ', label: 'INFJ', count: '1,648' },
  { value: 'INFP', label: 'INFP', count: '1,238' },
  { value: 'INTJ', label: 'INTJ', count: '985' },
  { value: 'ENFJ', label: 'ENFJ', count: '876' },
  { value: '其他人格', label: '其他人格', count: '2,135' }
]

const tabs = [
  { value: 'all', label: '综合', count: '' },
  { value: 'posts', label: '帖子', count: '1,234' },
  { value: 'users', label: '用户', count: '328' },
  { value: 'communities', label: '社区', count: '86' }
]

const posts = [
  {
    id: 1,
    author: '星星落在肩上',
    mbti: 'INFJ',
    time: '2 小时前',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80',
    title: 'INFJ 的能量恢复方式：独处 + 创造',
    excerpt: [
      { text: '作为 ' },
      { text: 'INFJ', mark: true },
      { text: '，独处对我来说不是逃避，而是充电。我喜欢在安静的环境里写日记、画画、整理思绪。' }
    ],
    tags: ['INFJ', '能量恢复', '独处时光'],
    comments: 128,
    replies: 45,
    likes: 352,
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=320&q=80',
    imageAlt: '安静客厅里的日光和桌面'
  },
  {
    id: 2,
    author: '老喵不是猫',
    mbti: 'INFJ',
    time: '5 小时前',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80',
    title: 'INFJ 在职场中的优势与挑战',
    excerpt: [
      { text: '从事产品经理三年，分享 ' },
      { text: 'INFJ', mark: true },
      { text: ' 在职场的一些真实感受：共情力强、洞察力敏锐，执行力稳定。' }
    ],
    tags: ['INFJ', '职场', 'MBTI'],
    comments: 96,
    replies: 68,
    likes: 276,
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=320&q=80',
    imageAlt: '明亮工作桌和笔记本电脑'
  },
  {
    id: 3,
    author: '温柔的自由人',
    mbti: 'INFJ',
    time: '1 天前',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=96&q=80',
    title: '如何判断自己是不是真的 INFJ?',
    excerpt: [
      { text: '做了好几次测试，结果都是 ' },
      { text: 'INFJ', mark: true },
      { text: '，但还是会怀疑自己是不是太理想化了。有没有朋友能分享真实的自己?' }
    ],
    tags: ['INFJ', '自我认知', 'MBTI测试'],
    comments: 208,
    replies: 134,
    likes: 589
  },
  {
    id: 4,
    author: '想去看海',
    mbti: 'INFJ',
    time: '2 天前',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=96&q=80',
    title: 'INFJ 的社交：慢热但真诚',
    excerpt: [
      { text: '我不是不喜欢社交，只是需要时间建立信任。一旦认定你，就是一辈子的朋友。' }
    ],
    tags: ['INFJ', '社交', '人际关系'],
    comments: 77,
    replies: 32,
    likes: 189
  }
]

const relatedUsers = [
  {
    name: '星星落在肩上',
    fans: '粉丝 1.2k',
    mbti: 'INFJ',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80'
  },
  {
    name: '温柔的自由人',
    fans: '粉丝 856',
    mbti: 'INFJ',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=96&q=80'
  },
  {
    name: '老喵不是猫',
    fans: '粉丝 634',
    mbti: 'INFJ',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80'
  },
  {
    name: '想去看海',
    fans: '粉丝 523',
    mbti: 'INFJ',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=96&q=80'
  },
  {
    name: 'INFJ 治愈馆',
    fans: '粉丝 412',
    mbti: 'INFJ',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=96&q=80'
  }
]

const relatedCommunities = [
  { name: 'INFJ 小世界', members: '7.3k', initial: 'I', color: '#7d8cff' },
  { name: 'INFJ 成长日记', members: '5.1k', initial: 'F', color: '#66d6c0' },
  { name: 'INFJ 的内心宇宙', members: '3.2k', initial: 'N', color: '#91c4ff' },
  { name: 'MBTI 16 型人格', members: '8.1k', initial: 'M', color: '#f6b0a5' },
  { name: 'MBTI 交流广场', members: '12.6k', initial: 'T', color: '#2f4c68' }
]

const visiblePosts = computed(() => {
  if (activeTab.value !== 'all' && activeTab.value !== 'posts') return posts.slice(0, 2)
  if (onlyWithImage.value) return posts.filter((post) => post.image)
  if (onlyFeatured.value) return posts.slice(0, 3)
  return posts
})

const formattedResultCount = computed(() => {
  const base = committedKeyword.value.toUpperCase() === 'INFJ' ? 1648 : 328
  return base.toLocaleString('zh-CN')
})

function performSearch() {
  committedKeyword.value = keyword.value.trim() || 'INFJ'
}

function clearSearch() {
  keyword.value = ''
  committedKeyword.value = ''
}

function togglePersonality(value) {
  if (value === '不限') {
    selectedPersonalities.value = ['不限']
    return
  }

  const current = selectedPersonalities.value.filter((item) => item !== '不限')
  if (current.includes(value)) {
    selectedPersonalities.value = current.filter((item) => item !== value)
  } else {
    selectedPersonalities.value = [...current, value]
  }

  if (!selectedPersonalities.value.length) {
    selectedPersonalities.value = ['不限']
  }
}

function resetFilters() {
  contentType.value = 'all'
  timeRange.value = 'any'
  selectedPersonalities.value = ['不限']
  onlyFeatured.value = false
  onlyWithImage.value = false
}
</script>

<style scoped>
.search-page {
  --ink: #17213a;
  --muted: #7a8599;
  --soft: #f5f8fc;
  --line: #e6ebf3;
  --accent: #ff6b5e;
  --accent-soft: #fff1ef;
  --blue: #378cf4;
  min-height: 100vh;
  color: var(--ink);
  background:
    radial-gradient(circle at 10% 20%, rgba(198, 224, 255, .34), transparent 28%),
    radial-gradient(circle at 88% 12%, rgba(255, 231, 220, .34), transparent 26%),
    linear-gradient(180deg, #fbfdff 0%, #f4f8fc 46%, #eef5fb 100%);
  font-family: "Microsoft YaHei", "PingFang SC", "Segoe UI", sans-serif;
  letter-spacing: 0;
}

.search-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(255, 255, 255, .86);
  border-bottom: 1px solid rgba(226, 232, 240, .72);
  backdrop-filter: blur(18px);
}

.header-inner {
  height: 76px;
  display: grid;
  grid-template-columns: 210px minmax(360px, 1fr) minmax(220px, 280px) auto;
  align-items: center;
  gap: 22px;
  width: min(1480px, calc(100vw - 32px));
  margin: 0 auto;
}

.brand-lockup {
  display: inline-flex;
  align-items: baseline;
  gap: 14px;
  min-width: 0;
}

.brand-name {
  font-size: 30px;
  line-height: 1;
  font-weight: 900;
  color: #081633;
}

.brand-subtitle {
  color: #5d687c;
  font-size: 14px;
  white-space: nowrap;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(22px, 4vw, 56px);
  min-width: 0;
  font-size: 15px;
  font-weight: 700;
}

.top-nav a {
  color: #24304a;
  white-space: nowrap;
  transition: color .18s ease;
}

.top-nav a:hover,
.top-nav a.router-link-active {
  color: var(--accent);
}

.header-search,
.main-search {
  display: flex;
  align-items: center;
  background: #f2f5fa;
  border: 1px solid transparent;
  color: #9aa4b5;
}

.header-search {
  height: 42px;
  border-radius: 8px;
  padding: 0 12px;
}

.header-search:focus-within,
.main-search:focus-within {
  border-color: #c9d8ef;
  background: #fff;
  box-shadow: 0 12px 32px rgba(65, 91, 132, .12);
}

.header-search input,
.main-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ink);
  font-weight: 700;
}

.header-search button,
.main-search button {
  border: 0;
  background: transparent;
  color: #a4adbd;
  display: inline-grid;
  place-items: center;
  padding: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.publish-button {
  min-width: 108px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  color: #fff;
  background: linear-gradient(180deg, #ff7468 0%, #ff5d50 100%);
  font-weight: 800;
  box-shadow: 0 10px 22px rgba(255, 95, 80, .24);
}

.header-icon,
.profile-button {
  border: 0;
  background: transparent;
  color: #27324c;
  display: inline-grid;
  place-items: center;
}

.header-icon {
  width: 34px;
  height: 34px;
}

.profile-button {
  grid-auto-flow: column;
  gap: 7px;
  padding: 0;
}

.profile-button img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 6px 18px rgba(24, 37, 56, .16);
}

.search-shell {
  width: min(1480px, calc(100vw - 32px));
  margin: 26px auto 48px;
  display: grid;
  grid-template-columns: 268px minmax(560px, 1fr) 366px;
  gap: 22px;
  align-items: start;
}

.filter-panel,
.side-card,
.guide-card {
  background: rgba(255, 255, 255, .88);
  border: 1px solid rgba(232, 237, 245, .86);
  border-radius: 8px;
  box-shadow: 0 18px 46px rgba(76, 97, 126, .08);
}

.filter-panel {
  position: sticky;
  top: 102px;
  overflow: hidden;
}

.filter-panel h1 {
  margin: 0;
  padding: 22px 23px 12px;
  font-size: 16px;
}

.filter-section {
  padding: 14px 23px 18px;
  border-bottom: 1px solid var(--line);
}

.filter-section h2 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 14px;
  font-size: 15px;
}

.filter-section h2 small {
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
}

.filter-option {
  height: 37px;
  display: grid;
  grid-template-columns: 18px 1fr auto;
  align-items: center;
  gap: 10px;
  color: #536078;
  font-size: 14px;
  cursor: pointer;
}

.filter-option input,
.quick-checks input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.filter-option.active {
  color: var(--accent);
  font-weight: 700;
}

.radio-dot,
.check-box {
  width: 16px;
  height: 16px;
  border: 1px solid #c8d1de;
  background: #fff;
}

.radio-dot {
  border-radius: 50%;
}

.filter-option.active .radio-dot {
  border-color: #ff9b90;
  box-shadow: inset 0 0 0 5px #ff9b90;
}

.check-box {
  border-radius: 4px;
  display: inline-grid;
  place-items: center;
  color: #fff;
}

.check-option.active .check-box {
  border-color: var(--accent);
  background: var(--accent);
}

.filter-count {
  justify-self: end;
  color: #66728a;
  font-weight: 700;
  font-size: 13px;
}

.filter-option.active .filter-count {
  color: var(--accent);
}

.option-icon {
  justify-self: end;
  color: #8b96a8;
}

.more-filter {
  width: 100%;
  height: 34px;
  border: 0;
  background: transparent;
  color: #98a3b5;
  font-size: 13px;
  font-weight: 700;
}

.filter-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  padding: 20px 23px;
}

.reset-button,
.apply-button {
  height: 42px;
  border-radius: 8px;
  font-weight: 800;
}

.reset-button {
  border: 1px solid #dce3ee;
  background: #fff;
  color: #4b5870;
}

.apply-button {
  border: 0;
  color: #fff;
  background: linear-gradient(180deg, #ff7468 0%, #ff5d50 100%);
  box-shadow: 0 10px 22px rgba(255, 95, 80, .22);
}

.result-column {
  min-width: 0;
}

.search-entry {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 96px;
  gap: 22px;
  align-items: center;
  margin-bottom: 24px;
}

.main-search {
  height: 58px;
  border-radius: 8px;
  padding: 0 16px;
  background: rgba(255, 255, 255, .94);
  border-color: #dde5f0;
  box-shadow: 0 12px 28px rgba(55, 76, 104, .08);
}

.main-search input {
  padding: 0 12px;
  font-size: 21px;
}

.clear-link {
  height: 42px;
  border: 0;
  background: transparent;
  color: #8f9aac;
  font-weight: 700;
}

.tabs-row {
  height: 56px;
  display: flex;
  align-items: end;
  gap: 42px;
  border-bottom: 1px solid var(--line);
}

.tabs-row button {
  position: relative;
  height: 46px;
  border: 0;
  background: transparent;
  color: #68748b;
  font-size: 16px;
  font-weight: 800;
}

.tabs-row button span {
  margin-left: 7px;
  font-weight: 700;
}

.tabs-row button.active {
  color: var(--accent);
}

.tabs-row button.active::after {
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 38px;
  height: 2px;
  border-radius: 99px;
  background: var(--accent);
  content: "";
}

.result-toolbar {
  min-height: 68px;
  display: grid;
  grid-template-columns: auto minmax(260px, 1fr) auto;
  align-items: center;
  gap: 22px;
}

.select-group,
.quick-checks {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.select-group button {
  height: 40px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #dfe6f0;
  border-radius: 8px;
  background: rgba(255, 255, 255, .74);
  color: #56627a;
  padding: 0 14px;
  font-weight: 700;
}

.quick-checks label {
  height: 38px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #536078;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.quick-checks span {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid #c8d1de;
  background: #fff;
}

.quick-checks input:checked + span {
  border-color: var(--accent);
  background: var(--accent);
  box-shadow: inset 0 0 0 3px #fff;
}

.result-toolbar p {
  margin: 0;
  color: #909bad;
  font-size: 14px;
  font-weight: 700;
  text-align: right;
}

.result-card {
  padding: 24px;
  margin-bottom: 14px;
  background: rgba(255, 255, 255, .94);
  border: 1px solid rgba(232, 237, 245, .88);
  border-radius: 8px;
  box-shadow: 0 18px 48px rgba(70, 92, 122, .08);
}

.post-head {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 32px;
  gap: 14px;
  align-items: center;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 6px 16px rgba(29, 44, 68, .14);
}

.author-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}

.author-line strong {
  font-size: 15px;
}

.author-line span,
.user-row em {
  height: 20px;
  display: inline-flex;
  align-items: center;
  padding: 0 7px;
  border-radius: 6px;
  background: #e9f2ff;
  color: #3f8df6;
  font-style: normal;
  font-size: 12px;
  font-weight: 900;
}

.author-line small {
  color: #8d97aa;
  font-size: 13px;
  font-weight: 700;
}

.post-head button {
  width: 32px;
  height: 32px;
  border: 0;
  background: transparent;
  color: #17213a;
}

.post-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 156px;
  gap: 24px;
  align-items: center;
  padding-left: 56px;
  margin-top: 10px;
}

.post-copy h2 {
  margin: 0 0 10px;
  font-size: 18px;
  line-height: 1.42;
}

.post-copy p {
  margin: 0;
  color: #47536a;
  font-size: 15px;
  line-height: 1.8;
}

.post-copy mark {
  padding: 0 3px;
  color: var(--accent);
  background: transparent;
  font-weight: 900;
}

.post-image {
  width: 156px;
  height: 116px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 10px 26px rgba(38, 57, 79, .12);
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 14px;
}

.tag-row span {
  color: #2f93ff;
  font-size: 13px;
  font-weight: 800;
}

.metric-row {
  display: flex;
  align-items: center;
  gap: 30px;
  padding-left: 56px;
  margin-top: 20px;
  color: #63708a;
  font-size: 14px;
  font-weight: 700;
}

.metric-row span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.metric-row .like {
  color: #ff786c;
}

.recommend-strip {
  min-height: 94px;
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr) 172px;
  align-items: center;
  gap: 18px;
  padding: 18px 24px;
  background: rgba(255, 255, 255, .88);
  border: 1px solid rgba(232, 237, 245, .88);
  border-radius: 8px;
}

.strip-visual {
  width: 72px;
  height: 60px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: #72a9f7;
  background: linear-gradient(135deg, #e9f4ff, #f8fbff);
}

.recommend-strip strong {
  display: block;
  margin-bottom: 6px;
}

.recommend-strip p {
  margin: 0;
  color: #8a95a8;
  font-size: 14px;
}

.recommend-strip button,
.guide-card a {
  height: 42px;
  border: 0;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #ff7468 0%, #ff5d50 100%);
  font-weight: 800;
  box-shadow: 0 10px 22px rgba(255, 95, 80, .22);
}

.right-column {
  display: grid;
  gap: 22px;
}

.side-card {
  padding: 24px;
}

.side-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 22px;
}

.side-title h2,
.guide-card h2 {
  margin: 0;
  font-size: 18px;
}

.side-title button {
  border: 0;
  background: transparent;
  color: #99a4b5;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 13px;
  font-weight: 800;
}

.side-list {
  display: grid;
  gap: 18px;
}

.user-row,
.community-row {
  display: grid;
  align-items: center;
  gap: 12px;
}

.user-row {
  grid-template-columns: 44px minmax(0, 1fr) auto 78px;
}

.user-row img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.user-row strong,
.community-row strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
}

.user-row span,
.community-row small {
  display: block;
  margin-top: 4px;
  color: #8c97a8;
  font-size: 13px;
}

.user-row button,
.community-row button {
  height: 36px;
  border: 1px solid #ffb0a8;
  border-radius: 8px;
  color: var(--accent);
  background: #fff;
  font-weight: 800;
}

.community-row {
  grid-template-columns: 44px minmax(0, 1fr) 78px;
}

.community-row > span {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: #fff;
  font-size: 18px;
  font-weight: 900;
}

.guide-card {
  position: relative;
  min-height: 238px;
  padding: 26px 22px;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, .96) 0%, rgba(255, 255, 255, .92) 58%, rgba(214, 233, 255, .84) 100%);
}

.guide-card p {
  margin: 10px 0 14px;
  color: #6a7589;
}

.guide-card ul {
  position: relative;
  z-index: 1;
  margin: 0 0 22px;
  padding-left: 18px;
  color: #2d3852;
  line-height: 1.95;
  font-size: 14px;
  font-weight: 700;
}

.guide-card a {
  position: relative;
  z-index: 2;
  width: 188px;
}

.guide-visual {
  position: absolute;
  right: 18px;
  bottom: 6px;
  width: 150px;
  height: 128px;
  color: #6da5ee;
}

.cloud,
.box {
  position: absolute;
  display: block;
}

.cloud {
  border-radius: 999px;
  background: #cbe3ff;
}

.cloud-a {
  width: 104px;
  height: 44px;
  right: 0;
  bottom: 56px;
}

.cloud-b {
  width: 72px;
  height: 34px;
  right: 60px;
  bottom: 72px;
  background: #ddecff;
}

.box {
  right: 8px;
  bottom: 10px;
  width: 82px;
  height: 54px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f7efe7, #e8d3be);
  box-shadow: 0 14px 28px rgba(76, 113, 153, .16);
}

.guide-visual svg {
  position: absolute;
  right: 52px;
  bottom: 54px;
}

@media (max-width: 1180px) {
  .header-inner {
    grid-template-columns: 180px 1fr 240px auto;
    gap: 16px;
  }

  .search-shell {
    grid-template-columns: 248px minmax(520px, 1fr);
  }

  .right-column {
    grid-column: 2;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .guide-card {
    grid-column: 1 / -1;
  }
}

@media (max-width: 1060px) {
  .header-inner {
    height: auto;
    grid-template-columns: 1fr auto;
    padding: 16px 0;
  }

  .top-nav {
    grid-row: 2;
    grid-column: 1 / -1;
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .header-search {
    grid-column: 1;
    grid-row: 3;
  }

  .header-actions {
    grid-column: 2;
    grid-row: 1;
  }

  .search-shell {
    grid-template-columns: 1fr;
    width: min(840px, calc(100vw - 32px));
  }

  .filter-panel {
    position: static;
  }

  .right-column {
    grid-column: auto;
  }
}

@media (max-width: 720px) {
  .header-inner {
    width: min(100% - 28px, 640px);
    grid-template-columns: 1fr;
  }

  .brand-name {
    font-size: 27px;
  }

  .header-actions {
    grid-column: auto;
    grid-row: auto;
    justify-content: space-between;
  }

  .publish-button {
    min-width: 98px;
  }

  .search-entry,
  .result-toolbar,
  .post-body,
  .recommend-strip,
  .right-column {
    grid-template-columns: 1fr;
  }

  .search-entry {
    gap: 10px;
  }

  .clear-link {
    justify-self: start;
  }

  .tabs-row {
    gap: 22px;
    overflow-x: auto;
  }

  .result-toolbar p {
    text-align: left;
  }

  .result-card {
    padding: 18px;
  }

  .post-body,
  .metric-row {
    padding-left: 0;
  }

  .post-image {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
  }

  .recommend-strip button {
    width: 100%;
  }

  .side-card {
    padding: 18px;
  }

  .user-row {
    grid-template-columns: 44px minmax(0, 1fr) 70px;
  }

  .user-row em {
    display: none;
  }
}
</style>
