<template>
  <section class="square-page">
    <div class="square-head">
      <div class="head-copy">
        <h1>社区广场</h1>
        <p>发现更多有趣的社区，找到同频的伙伴。</p>
      </div>

      <section class="hero-banner" aria-label="社区横幅">
        <div class="hero-copy">
          <span>在社区，遇见同频的你</span>
          <strong>分享体验，交流观点，互相成长</strong>
          <small>{{ heroHint }}</small>
        </div>

        <div class="hero-visual" aria-hidden="true">
          <div class="hero-cloud hero-cloud-a"></div>
          <div class="hero-cloud hero-cloud-b"></div>
          <div class="hero-table"></div>
          <div class="hero-person hero-person-a"></div>
          <div class="hero-person hero-person-b"></div>
          <div class="hero-person hero-person-c"></div>
        </div>

        <button class="hero-action" type="button" @click="goCreateCommunity">
          {{ auth.isLoggedIn ? '创建社区' : '登录 / 注册' }}
        </button>
      </section>
    </div>

    <div class="category-tabs" role="tablist" aria-label="社区分类">
      <button
        v-for="tab in categoryTabs"
        :key="tab.key"
        type="button"
        :class="{ active: activeTab === tab.key }"
        role="tab"
        :aria-selected="activeTab === tab.key"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="square-layout">
      <aside class="filter-panel" aria-label="社区筛选">
        <div class="filter-title">
          <h2>筛选</h2>
          <SlidersHorizontal :size="18" />
        </div>

        <section class="filter-group">
          <h3>社区类型</h3>
          <label
            v-for="option in typeOptions"
            :key="option.key"
            class="filter-option radio-option"
            :class="{ active: typeFilter === option.key }"
          >
            <input v-model="typeFilter" type="radio" name="communityType" :value="option.key" />
            <span class="option-mark"></span>
            <span>{{ option.label }}</span>
            <small>{{ option.count }}</small>
          </label>
        </section>

        <section class="filter-group">
          <div class="filter-row">
            <h3>人格类型</h3>
            <button class="mini-link" type="button" @click="showAllMbti = !showAllMbti">
              {{ showAllMbti ? '收起' : '展开更多' }}
            </button>
          </div>

          <label
            v-for="option in visibleMbtiOptions"
            :key="option.key"
            class="filter-option check-option"
            :class="{ active: mbtiFilters.includes(option.key) }"
          >
            <input
              type="checkbox"
              :checked="mbtiFilters.includes(option.key)"
              @change="toggleMbtiFilter(option.key)"
            />
            <span class="option-check"></span>
            <span>{{ option.label }}</span>
            <small>{{ option.count }}</small>
          </label>
        </section>

        <section class="filter-group">
          <h3>热门程度</h3>
          <label
            v-for="option in heatOptions"
            :key="option.key"
            class="filter-option radio-option"
            :class="{ active: heatFilter === option.key }"
          >
            <input v-model="heatFilter" type="radio" name="heatLevel" :value="option.key" />
            <span class="option-mark"></span>
            <span>{{ option.label }}</span>
          </label>
        </section>

        <div class="filter-actions">
          <button class="filter-reset" type="button" @click="resetFilters">重置</button>
          <button class="filter-apply" type="button" @click="scrollToResults">筛选</button>
        </div>
      </aside>

      <section class="square-content">
        <div ref="resultsAnchor" class="square-toolbar">
          <div class="toolbar-main">
            <label class="sort-select">
              <span>{{ sortMode }}</span>
              <select v-model="sortMode" aria-label="排序方式">
                <option v-for="option in sortOptions" :key="option" :value="option">{{ option }}</option>
              </select>
              <ChevronDown :size="15" />
            </label>

            <label class="toolbar-check">
              <input v-model="onlyJoined" type="checkbox" />
              <span></span>
              只看我加入的
            </label>

            <label class="toolbar-check">
              <input v-model="joinableOnly" type="checkbox" />
              <span></span>
              可加入的社区
            </label>
          </div>

          <p>共找到 {{ filteredCommunities.length }} 个社区</p>
        </div>

        <div class="community-grid">
          <article
            v-for="community in filteredCommunities"
            :key="community.key"
            class="community-card"
            :style="community.themeStyle"
          >
            <RouterLink class="card-cover" :to="community.link">
              <div class="cover-noise"></div>
              <div class="cover-orb cover-orb-a"></div>
              <div class="cover-orb cover-orb-b"></div>
              <div class="cover-wave"></div>
              <span class="cover-note">{{ community.coverLabel }}</span>
            </RouterLink>

            <div class="card-body">
              <div class="card-head">
                <div class="community-stamp">
                  <span>{{ community.badge }}</span>
                </div>
                <div class="card-title">
                  <h3>{{ community.name }}</h3>
                  <div class="card-tags">
                    <span class="tag-strong">{{ community.badge }}</span>
                    <span class="tag-soft">{{ community.typeLabel }}</span>
                  </div>
                </div>
              </div>

              <p>{{ community.description }}</p>

              <div class="card-stats">
                <span>帖子 {{ formatCompact(community.posts) }}</span>
                <span>关注 {{ formatCompact(community.followers) }}</span>
              </div>

              <div class="card-foot">
                <span>{{ community.joined ? '已经关注，随时可以回来聊。' : `成员 ${formatCompact(community.members)}` }}</span>
                <button
                  class="follow-button"
                  :class="{ followed: community.joined }"
                  type="button"
                  :disabled="community.joined && !community.followable"
                  @click="followCommunity(community)"
                >
                  {{ community.joined ? '已关注' : '关注' }}
                </button>
              </div>
            </div>
          </article>
        </div>

        <div class="status-strip">
          <article class="status-card">
            <template v-if="isLoading">
              <LoaderCircle :size="32" class="spin" />
              <strong>加载中</strong>
              <p>正在同步社区数据，马上就好。</p>
            </template>
            <template v-else-if="loadError">
              <RefreshCw :size="32" />
              <strong>连接有点慢</strong>
              <p>{{ loadError }}</p>
              <button type="button" @click="loadCommunities">重新加载</button>
            </template>
            <template v-else-if="!filteredCommunities.length">
              <Search :size="32" />
              <strong>暂无相关社区</strong>
              <p>换个筛选条件，再试一次。</p>
              <button type="button" @click="resetFilters">清空筛选</button>
            </template>
            <template v-else>
              <Sparkles :size="32" />
              <strong>继续逛逛</strong>
              <p>有喜欢的社区就先关注，内容会越来越准。</p>
              <button type="button" @click="scrollToResults">回到上方</button>
            </template>
          </article>

          <article class="status-card">
            <Compass :size="32" />
            <strong>想看更多方向</strong>
            <p>从 MBTI、组合关系和话题社区里慢慢挑，总会遇到合拍的人。</p>
            <RouterLink to="/personalities">去发现更多</RouterLink>
          </article>

          <article class="status-card">
            <Plus :size="32" />
            <strong>想自己开一个</strong>
            <p>把你想聊的主题收拢成一个小社区，邀请同频的人一起进来。</p>
            <button type="button" @click="goCreateCommunity">创建社区</button>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  ChevronDown,
  Compass,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles
} from 'lucide-vue-next'
import { communityApi, interactionApi } from '../api'
import { useAuthStore } from '../stores/auth'

const MBTI_TYPES = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']
const COMMUNITY_TYPE_LABELS = {
  all: '全部社区',
  mbti: 'MBTI 社区',
  pair: '组合社区',
  topic: '话题社区'
}
const THEME_BANK = [
  {
    cover: 'linear-gradient(135deg, #dff4d8 0%, #b2d9b2 42%, #f6fbf3 100%)',
    accent: '#4f9f72',
    chip: '#edf8ef',
    stamp: 'linear-gradient(135deg, #8bd3a2 0%, #58a37a 100%)',
    shadow: 'rgba(79, 159, 114, .22)'
  },
  {
    cover: 'linear-gradient(135deg, #233b8d 0%, #3b68c8 58%, #8ab6ff 100%)',
    accent: '#4f7ef1',
    chip: '#edf2ff',
    stamp: 'linear-gradient(135deg, #7e96ff 0%, #566be4 100%)',
    shadow: 'rgba(79, 126, 241, .24)'
  },
  {
    cover: 'linear-gradient(135deg, #a7e1ff 0%, #d7f4ff 52%, #fff3c7 100%)',
    accent: '#ef8c3d',
    chip: '#fff4ea',
    stamp: 'linear-gradient(135deg, #ffb24c 0%, #ff8a3d 100%)',
    shadow: 'rgba(255, 138, 61, .22)'
  },
  {
    cover: 'linear-gradient(135deg, #dbe7f7 0%, #c6d9eb 46%, #7d8ea8 100%)',
    accent: '#516784',
    chip: '#edf2f7',
    stamp: 'linear-gradient(135deg, #8aa0bd 0%, #5f7899 100%)',
    shadow: 'rgba(81, 103, 132, .2)'
  },
  {
    cover: 'linear-gradient(135deg, #ffe8d7 0%, #ffd2c3 40%, #fff8ec 100%)',
    accent: '#ef7a59',
    chip: '#fff2ed',
    stamp: 'linear-gradient(135deg, #ffb198 0%, #ef7a59 100%)',
    shadow: 'rgba(239, 122, 89, .2)'
  },
  {
    cover: 'linear-gradient(135deg, #ffc59f 0%, #ff9f7f 36%, #ffe7b4 100%)',
    accent: '#f07c56',
    chip: '#fff1eb',
    stamp: 'linear-gradient(135deg, #ffb292 0%, #ff7559 100%)',
    shadow: 'rgba(240, 124, 86, .22)'
  },
  {
    cover: 'linear-gradient(135deg, #183a58 0%, #355d84 46%, #f3cf99 100%)',
    accent: '#4f8bd7',
    chip: '#eef5ff',
    stamp: 'linear-gradient(135deg, #87b7ff 0%, #5d89d9 100%)',
    shadow: 'rgba(78, 139, 215, .24)'
  },
  {
    cover: 'linear-gradient(135deg, #f7efe3 0%, #ecd9c4 46%, #fef7ef 100%)',
    accent: '#b57a52',
    chip: '#f8efe8',
    stamp: 'linear-gradient(135deg, #d3a983 0%, #b57a52 100%)',
    shadow: 'rgba(181, 122, 82, .18)'
  },
  {
    cover: 'linear-gradient(135deg, #d7ecfb 0%, #f8fafc 58%, #f2e7d6 100%)',
    accent: '#6d8ca7',
    chip: '#eef4f8',
    stamp: 'linear-gradient(135deg, #8bb5d8 0%, #6d8ca7 100%)',
    shadow: 'rgba(109, 140, 167, .2)'
  },
  {
    cover: 'linear-gradient(135deg, #f5e7d6 0%, #ddc0a1 42%, #fff6ec 100%)',
    accent: '#9d724b',
    chip: '#f7efe6',
    stamp: 'linear-gradient(135deg, #d3aa6f 0%, #9d724b 100%)',
    shadow: 'rgba(157, 114, 75, .18)'
  },
  {
    cover: 'linear-gradient(135deg, #b8d9e7 0%, #e5f3ff 48%, #fbe0b9 100%)',
    accent: '#3d88ab',
    chip: '#ebf6fb',
    stamp: 'linear-gradient(135deg, #83c9e3 0%, #4597bc 100%)',
    shadow: 'rgba(61, 136, 171, .2)'
  },
  {
    cover: 'linear-gradient(135deg, #f7ead2 0%, #f0d0a0 46%, #f5f1ea 100%)',
    accent: '#cb7d39',
    chip: '#fff2e5',
    stamp: 'linear-gradient(135deg, #f0b46d 0%, #cb7d39 100%)',
    shadow: 'rgba(203, 125, 57, .18)'
  }
]
const FALLBACK_COMMUNITIES = [
  {
    id: 'fallback-infj',
    name: 'INFJ 小世界',
    description: 'INFJ 的温暖角落，分享内心世界，互相理解与支持。',
    typeKey: 'mbti',
    badge: 'INFJ',
    coverLabel: '温柔角落',
    personalityCodes: ['INFJ'],
    members: 12600,
    followers: 7300,
    posts: 12600,
    joined: false,
    joinable: true,
    freshness: 84,
    hotness: 94
  },
  {
    id: 'fallback-intj',
    name: 'INTJ 城堡',
    description: '独立思考，深度探讨，适合把问题聊到最里面。',
    typeKey: 'mbti',
    badge: 'INTJ',
    coverLabel: '深度讨论',
    personalityCodes: ['INTJ'],
    members: 9300,
    followers: 5800,
    posts: 9300,
    joined: false,
    joinable: true,
    freshness: 74,
    hotness: 90
  },
  {
    id: 'fallback-enfp',
    name: 'ENFP 快乐星球',
    description: '一起脑洞大开，分享快乐与灵感，也欢迎偶尔发发疯。',
    typeKey: 'mbti',
    badge: 'ENFP',
    coverLabel: '轻松玩耍',
    personalityCodes: ['ENFP'],
    members: 15800,
    followers: 9200,
    posts: 15800,
    joined: true,
    joinable: true,
    freshness: 89,
    hotness: 98
  },
  {
    id: 'fallback-istj',
    name: 'ISTJ 生活研究所',
    description: '记录生活，追求秩序，也聊那些看似普通但很有用的经验。',
    typeKey: 'mbti',
    badge: 'ISTJ',
    coverLabel: '稳稳过日子',
    personalityCodes: ['ISTJ'],
    members: 7200,
    followers: 4100,
    posts: 7200,
    joined: false,
    joinable: true,
    freshness: 66,
    hotness: 81
  },
  {
    id: 'fallback-intj-infj',
    name: 'INTJ x INFJ',
    description: '理性与感性的高效碰撞，适合认真聊天，也适合慢慢成长。',
    typeKey: 'pair',
    badge: 'CP',
    coverLabel: '组合社区',
    personalityCodes: ['INTJ', 'INFJ'],
    members: 6700,
    followers: 3300,
    posts: 6700,
    joined: false,
    joinable: true,
    freshness: 82,
    hotness: 76
  },
  {
    id: 'fallback-enfp-infj',
    name: 'ENFP x INFJ',
    description: '快乐小狗遇见温柔宇宙守护者，适合聊陪伴、关系和情绪。',
    typeKey: 'pair',
    badge: 'CP',
    coverLabel: '海边日落',
    personalityCodes: ['ENFP', 'INFJ'],
    members: 5400,
    followers: 2900,
    posts: 5400,
    joined: false,
    joinable: true,
    freshness: 87,
    hotness: 72
  },
  {
    id: 'fallback-intp-entp',
    name: 'INTP x ENTP',
    description: '脑洞组合，创意很多，适合聊思路、作品和那些稀奇古怪的问题。',
    typeKey: 'pair',
    badge: 'CP',
    coverLabel: '夜谈小组',
    personalityCodes: ['INTP', 'ENTP'],
    members: 4800,
    followers: 2700,
    posts: 4800,
    joined: false,
    joinable: true,
    freshness: 80,
    hotness: 69
  },
  {
    id: 'fallback-isfj-esfj',
    name: 'ISFJ x ESFJ',
    description: '温暖双份，守护彼此的小确幸，适合聊关系、照顾和生活感。',
    typeKey: 'pair',
    badge: 'CP',
    coverLabel: '日常陪伴',
    personalityCodes: ['ISFJ', 'ESFJ'],
    members: 3900,
    followers: 2100,
    posts: 3900,
    joined: false,
    joinable: true,
    freshness: 72,
    hotness: 63
  },
  {
    id: 'fallback-study',
    name: '学习与成长',
    description: '分享学习方法、成长笔记和那些慢慢建立起来的节奏感。',
    typeKey: 'topic',
    badge: '成长',
    coverLabel: '知识整理',
    personalityCodes: ['INTJ', 'INFJ', 'ISTJ'],
    members: 11200,
    followers: 8600,
    posts: 11200,
    joined: true,
    joinable: true,
    freshness: 91,
    hotness: 88
  },
  {
    id: 'fallback-daily',
    name: '日常碎碎念',
    description: '记录生活，分享日常小情绪，不用太正式，舒服最重要。',
    typeKey: 'topic',
    badge: '日常',
    coverLabel: '随手记',
    personalityCodes: ['ISFP', 'INFP', 'ENFP'],
    members: 18600,
    followers: 12400,
    posts: 18600,
    joined: false,
    joinable: true,
    freshness: 94,
    hotness: 97
  },
  {
    id: 'fallback-travel',
    name: '旅行爱好者',
    description: '分享旅行故事，交换世界地图上的灵感，也欢迎晒晒回忆。',
    typeKey: 'topic',
    badge: '旅行',
    coverLabel: '远行计划',
    personalityCodes: ['ENFP', 'ISFP', 'ESTP'],
    members: 9800,
    followers: 6700,
    posts: 9800,
    joined: false,
    joinable: true,
    freshness: 78,
    hotness: 84
  },
  {
    id: 'fallback-hobby',
    name: '兴趣与爱好',
    description: '绘画、音乐、摄影、手工，聊喜欢的事本身就很开心。',
    typeKey: 'topic',
    badge: '兴趣',
    coverLabel: '手边热爱',
    personalityCodes: ['INFP', 'ISFP', 'ESFP'],
    members: 10300,
    followers: 7100,
    posts: 10300,
    joined: false,
    joinable: true,
    freshness: 76,
    hotness: 83
  }
]

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const activeTab = ref('all')
const typeFilter = ref('all')
const mbtiFilters = ref(['all'])
const heatFilter = ref('any')
const sortMode = ref('综合排序')
const onlyJoined = ref(false)
const joinableOnly = ref(false)
const showAllMbti = ref(false)
const isLoading = ref(false)
const loadError = ref('')
const communities = ref(buildFallbackCommunities())
const resultsAnchor = ref(null)

const sortOptions = ['综合排序', '按关注数', '按帖子数', '最新加入']
const heatOptions = [
  { key: 'any', label: '不限' },
  { key: 'hot', label: '最热' },
  { key: 'new', label: '最新' }
]

const typeOptions = computed(() => {
  const totals = countByType(communities.value)
  return [
    { key: 'all', label: '全部类型', count: totals.all },
    { key: 'mbti', label: 'MBTI 社区', count: totals.mbti },
    { key: 'pair', label: '组合社区', count: totals.pair },
    { key: 'topic', label: '话题社区', count: totals.topic }
  ]
})

const categoryTabs = computed(() =>
  typeOptions.value.map((item) => ({
    key: item.key,
    label: COMMUNITY_TYPE_LABELS[item.key] || item.label
  }))
)

const mbtiOptions = computed(() => {
  const summary = new Map()
  summary.set('all', { key: 'all', label: '全部人格', score: totalMembers.value })

  for (const community of communities.value) {
    for (const code of community.personalityCodes) {
      summary.set(code, {
        key: code,
        label: code,
        score: (summary.get(code)?.score || 0) + community.members
      })
    }
  }

  return Array.from(summary.values())
    .map((item) => ({
      ...item,
      count: item.key === 'all' ? communities.value.length : formatCompact(item.score)
    }))
    .sort((left, right) => {
      if (left.key === 'all') return -1
      if (right.key === 'all') return 1
      return right.score - left.score
    })
})

const visibleMbtiOptions = computed(() => (showAllMbti.value ? mbtiOptions.value : mbtiOptions.value.slice(0, 10)))
const totalMembers = computed(() => communities.value.reduce((sum, item) => sum + item.members, 0))
const hotThreshold = computed(() => {
  const scores = communities.value.map((item) => item.hotness).sort((a, b) => b - a)
  return scores[Math.min(scores.length - 1, 5)] || 0
})
const heroHint = computed(() => {
  if (auth.isLoggedIn) return `你已经加入了 ${communities.value.filter((item) => item.joined).length} 个社区。`
  return '先登录，再把喜欢的社区收藏起来。'
})

const filteredCommunities = computed(() => {
  let list = [...communities.value]

  if (activeTab.value !== 'all') {
    list = list.filter((item) => item.typeKey === activeTab.value)
  }

  if (typeFilter.value !== 'all') {
    list = list.filter((item) => item.typeKey === typeFilter.value)
  }

  if (!mbtiFilters.value.includes('all')) {
    list = list.filter((item) => item.personalityCodes.some((code) => mbtiFilters.value.includes(code)))
  }

  if (heatFilter.value === 'hot') {
    list = list.filter((item) => item.hotness >= hotThreshold.value)
  }

  if (heatFilter.value === 'new') {
    list = list.filter((item) => item.freshness >= 80)
  }

  if (onlyJoined.value) {
    list = list.filter((item) => item.joined)
  }

  if (joinableOnly.value) {
    list = list.filter((item) => item.joinable)
  }

  if (sortMode.value === '按关注数') {
    list.sort((left, right) => right.followers - left.followers)
  } else if (sortMode.value === '按帖子数') {
    list.sort((left, right) => right.posts - left.posts)
  } else if (sortMode.value === '最新加入') {
    list.sort((left, right) => right.freshness - left.freshness)
  } else {
    list.sort((left, right) => right.hotness - left.hotness)
  }

  return list
})

function buildFallbackCommunities() {
  return FALLBACK_COMMUNITIES.map((item, index) => normalizeCommunity(item, index, item))
}

function countByType(list) {
  return list.reduce(
    (totals, item) => {
      totals.all += 1
      totals[item.typeKey] += 1
      return totals
    },
    { all: 0, mbti: 0, pair: 0, topic: 0 }
  )
}

function getTheme(index) {
  return THEME_BANK[index % THEME_BANK.length]
}

function themeStyle(theme) {
  return {
    '--cover-bg': theme.cover,
    '--accent': theme.accent,
    '--chip-bg': theme.chip,
    '--stamp-bg': theme.stamp,
    '--card-shadow': theme.shadow
  }
}

function toNumber(value, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const normalized = value.replace(/[^\d.]/g, '')
    if (!normalized) return fallback
    const parsed = Number(normalized)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

function inferPersonalityCodes(source, fallbackCodes = []) {
  const values = Array.isArray(source) ? source : [source]
  const found = new Set()

  for (const entry of values) {
    const text = String(entry || '').toUpperCase()
    for (const code of MBTI_TYPES) {
      if (text.includes(code)) found.add(code)
    }
  }

  return found.size ? Array.from(found) : fallbackCodes
}

function inferTypeKey(rawType, codes, fallbackType) {
  const text = String(rawType || '').toLowerCase()
  if (text.includes('topic') || text.includes('话题')) return 'topic'
  if (text.includes('pair') || text.includes('组合') || text.includes('cp')) return 'pair'
  if (text.includes('mbti')) return 'mbti'
  if (codes.length >= 2) return 'pair'
  if (codes.length === 1) return 'mbti'
  return fallbackType || 'topic'
}

function normalizeCommunity(item, index, fallback) {
  const theme = getTheme(index)
  const rawTags = Array.isArray(item.tags) ? item.tags.map((tag) => tag?.name || tag) : []
  const codes = inferPersonalityCodes([item.name, item.description, item.summary, item.type, rawTags.join(' ')], fallback.personalityCodes)
  const typeKey = inferTypeKey(item.type || item.category, codes, fallback.typeKey)
  const followers = toNumber(item.followCount ?? item.followerCount ?? item.followers, fallback.followers)
  const posts = toNumber(item.postCount ?? item.topicCount ?? item.posts, fallback.posts)
  const members = toNumber(item.memberCount ?? item.userCount ?? item.members, fallback.members)
  const badge = fallback.badge || codes[0] || '社区'
  const hotness = Math.round(followers * 0.6 + posts * 0.4)
  const freshness = fallback.freshness + (item.updatedAt ? 6 : 0)

  return {
    key: item.id || fallback.id || `${fallback.name}-${index}`,
    id: item.id || null,
    name: item.name || fallback.name,
    description: item.description || item.summary || fallback.description,
    typeKey,
    typeLabel: COMMUNITY_TYPE_LABELS[typeKey],
    badge,
    coverLabel: fallback.coverLabel,
    personalityCodes: codes,
    members,
    followers,
    posts,
    joined: Boolean(item.joined ?? item.followed ?? fallback.joined),
    joinable: item.joinable ?? item.canJoin ?? fallback.joinable,
    followable: item.id != null,
    freshness,
    hotness,
    themeStyle: themeStyle(theme),
    link: item.id ? `/communities/${item.id}` : '/square'
  }
}

function formatCompact(value) {
  if (value >= 10000) {
    const compact = Math.round((value / 1000) * 10) / 10
    return `${compact}k`
  }
  return String(value)
}

function toggleMbtiFilter(code) {
  if (code === 'all') {
    mbtiFilters.value = ['all']
    return
  }

  const next = mbtiFilters.value.filter((item) => item !== 'all')
  if (next.includes(code)) {
    mbtiFilters.value = next.filter((item) => item !== code)
  } else {
    mbtiFilters.value = [...next, code]
  }

  if (!mbtiFilters.value.length) {
    mbtiFilters.value = ['all']
  }
}

function resetFilters() {
  activeTab.value = 'all'
  typeFilter.value = 'all'
  mbtiFilters.value = ['all']
  heatFilter.value = 'any'
  sortMode.value = '综合排序'
  onlyJoined.value = false
  joinableOnly.value = false
}

function scrollToResults() {
  resultsAnchor.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function goCreateCommunity() {
  if (!auth.isLoggedIn) {
    router.push({ path: '/login', query: { mode: 'register', redirect: route.fullPath } })
    return
  }

  if (auth.isAdmin) {
    router.push('/admin/communities')
    return
  }

  router.push('/create')
}

async function followCommunity(community) {
  if (community.joined) return

  if (!auth.isLoggedIn) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  community.joined = true
  if (!community.id) return

  try {
    await interactionApi.followCommunity(community.id)
  } catch {
    community.joined = false
  }
}

async function loadCommunities() {
  isLoading.value = true
  loadError.value = ''

  try {
    const data = await communityApi.list({ page: 1, size: 12 })
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.list)
        ? data.list
        : Array.isArray(data?.records)
          ? data.records
          : []

    if (list.length) {
      communities.value = list.slice(0, 12).map((item, index) => normalizeCommunity(item, index, FALLBACK_COMMUNITIES[index % FALLBACK_COMMUNITIES.length]))
    } else {
      communities.value = buildFallbackCommunities()
      loadError.value = '暂时没拉到线上社区，先用示例内容顶上了。'
    }
  } catch {
    communities.value = buildFallbackCommunities()
    loadError.value = '当前网络不太稳，先给你展示本地示例。'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadCommunities)
</script>

<style scoped>
.square-page {
  --square-ink: #13203a;
  --square-muted: #728096;
  --square-line: #e6ecf3;
  --square-soft: #f7fafe;
  --square-accent: #ff624f;
  width: min(100%, 1400px);
  margin: 0 auto;
  color: var(--square-ink);
  font-family: "Microsoft YaHei", "PingFang SC", "Segoe UI", sans-serif;
}

.square-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(420px, 600px);
  align-items: center;
  gap: 20px;
  margin-bottom: 22px;
}

.head-copy h1 {
  margin: 0;
  font-size: 52px;
  line-height: 1.02;
  letter-spacing: 0;
}

.head-copy p {
  margin: 14px 0 0;
  color: var(--square-muted);
  font-size: 18px;
}

.hero-banner {
  position: relative;
  min-height: 150px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 188px auto;
  align-items: center;
  gap: 18px;
  overflow: hidden;
  padding: 24px 24px 24px 28px;
  border: 1px solid rgba(226, 233, 242, .9);
  border-radius: 8px;
  background:
    radial-gradient(circle at 88% 18%, rgba(255, 133, 103, .12), transparent 28%),
    linear-gradient(135deg, rgba(240, 247, 255, .95), rgba(255, 248, 242, .96));
  box-shadow: 0 20px 46px rgba(53, 76, 110, .08);
}

.hero-copy {
  position: relative;
  z-index: 2;
}

.hero-copy span,
.hero-copy strong,
.hero-copy small {
  display: block;
}

.hero-copy span {
  color: var(--square-ink);
  font-size: 30px;
  line-height: 1.18;
  font-weight: 900;
}

.hero-copy strong {
  margin-top: 8px;
  color: #4f5e76;
  font-size: 18px;
  font-weight: 700;
}

.hero-copy small {
  margin-top: 12px;
  color: #8a96a9;
  font-size: 13px;
}

.hero-visual {
  position: relative;
  height: 118px;
}

.hero-cloud,
.hero-table,
.hero-person {
  position: absolute;
}

.hero-cloud {
  border-radius: 999px;
  background: rgba(255, 255, 255, .82);
}

.hero-cloud-a {
  top: 10px;
  left: 10px;
  width: 92px;
  height: 34px;
}

.hero-cloud-b {
  top: 32px;
  right: 18px;
  width: 64px;
  height: 26px;
}

.hero-table {
  left: 14px;
  right: 12px;
  bottom: 8px;
  height: 24px;
  border-radius: 999px;
  background: linear-gradient(180deg, #e8c2a7, #cf9f82);
}

.hero-person {
  bottom: 24px;
  width: 42px;
  height: 54px;
  border-radius: 20px 20px 14px 14px;
}

.hero-person::before {
  content: "";
  position: absolute;
  top: -18px;
  left: 10px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #f2c29c;
}

.hero-person-a {
  left: 26px;
  background: linear-gradient(135deg, #7fbbf4, #5587c7);
}

.hero-person-b {
  left: 74px;
  background: linear-gradient(135deg, #f3b0a1, #ee7c63);
}

.hero-person-c {
  right: 22px;
  background: linear-gradient(135deg, #93c889, #6ba86d);
}

.hero-action {
  min-width: 118px;
  min-height: 46px;
  align-self: center;
  border: 0;
  border-radius: 8px;
  color: #fff;
  background: linear-gradient(180deg, #ff7565, #ff5448);
  box-shadow: 0 14px 28px rgba(255, 96, 80, .22);
  font-weight: 900;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
}

.category-tabs button {
  min-height: 42px;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0 18px;
  color: #526078;
  background: rgba(255, 255, 255, .62);
  font-weight: 800;
}

.category-tabs button.active {
  color: var(--square-accent);
  border-color: #ffd7d1;
  background: #fff2ef;
}

.square-layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}

.filter-panel {
  position: sticky;
  top: 96px;
  border: 1px solid rgba(226, 233, 242, .94);
  border-radius: 8px;
  background: rgba(255, 255, 255, .94);
  box-shadow: 0 18px 42px rgba(47, 67, 102, .08);
}

.filter-title,
.filter-group,
.filter-actions {
  padding-left: 18px;
  padding-right: 18px;
}

.filter-title {
  min-height: 62px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--square-line);
}

.filter-title h2,
.filter-group h3 {
  margin: 0;
  font-size: 16px;
}

.filter-title svg {
  color: #93a0b4;
}

.filter-group {
  padding-top: 18px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--square-line);
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.filter-option {
  min-height: 36px;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  color: #526078;
  font-size: 14px;
  cursor: pointer;
}

.filter-option input,
.toolbar-check input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.filter-option small {
  color: #8d99ab;
  font-size: 13px;
  font-weight: 700;
}

.filter-option.active {
  color: var(--square-accent);
  font-weight: 800;
}

.filter-option.active small {
  color: var(--square-accent);
}

.option-mark,
.option-check,
.toolbar-check span {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  border: 1px solid #ccd4e0;
  background: #fff;
}

.option-mark {
  border-radius: 50%;
}

.radio-option.active .option-mark {
  border-color: #ff9a8f;
  box-shadow: inset 0 0 0 5px #ff9a8f;
}

.option-check,
.toolbar-check span {
  border-radius: 4px;
}

.check-option.active .option-check,
.toolbar-check input:checked + span {
  border-color: var(--square-accent);
  background:
    linear-gradient(180deg, rgba(255, 98, 79, 1), rgba(255, 98, 79, 1)),
    #fff;
  box-shadow: inset 0 0 0 3px #fff;
}

.mini-link {
  border: 0;
  padding: 0;
  color: #7f8ca1;
  background: transparent;
  font-size: 13px;
  font-weight: 700;
}

.filter-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding-top: 18px;
  padding-bottom: 18px;
}

.filter-reset,
.filter-apply {
  min-height: 40px;
  border-radius: 8px;
  font-weight: 800;
}

.filter-reset {
  border: 1px solid #d9e1ec;
  color: #49566f;
  background: #fff;
}

.filter-apply {
  border: 0;
  color: #fff;
  background: linear-gradient(180deg, #ff7565, #ff5448);
  box-shadow: 0 12px 24px rgba(255, 96, 80, .18);
}

.square-content {
  min-width: 0;
}

.square-toolbar {
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.toolbar-main {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}

.sort-select {
  position: relative;
  min-width: 132px;
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  padding: 0 34px 0 14px;
  border: 1px solid #dce3ee;
  border-radius: 8px;
  color: #4f5d74;
  background: rgba(255, 255, 255, .94);
  font-weight: 800;
}

.sort-select select {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.sort-select svg {
  position: absolute;
  right: 12px;
  color: #91a0b4;
}

.toolbar-check {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #55637b;
  font-size: 14px;
  font-weight: 700;
}

.square-toolbar p {
  margin: 0;
  color: #8e9aaa;
  font-size: 14px;
  font-weight: 700;
}

.community-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.community-card {
  overflow: hidden;
  border: 1px solid rgba(224, 231, 240, .92);
  border-radius: 8px;
  background: rgba(255, 255, 255, .95);
  box-shadow: 0 18px 40px var(--card-shadow);
  transition: transform .18s ease, box-shadow .18s ease;
}

.community-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 24px 48px var(--card-shadow);
}

.card-cover {
  position: relative;
  display: block;
  aspect-ratio: 16 / 8.8;
  overflow: hidden;
  background: var(--cover-bg);
}

.cover-noise,
.cover-orb,
.cover-wave {
  position: absolute;
}

.cover-noise {
  inset: 0;
  background:
    linear-gradient(130deg, rgba(255, 255, 255, .18) 0 24%, transparent 24% 42%, rgba(255, 255, 255, .16) 42% 56%, transparent 56% 100%);
}

.cover-orb {
  border-radius: 50%;
  background: rgba(255, 255, 255, .52);
}

.cover-orb-a {
  right: 18px;
  top: 18px;
  width: 34px;
  height: 34px;
}

.cover-orb-b {
  left: 28px;
  bottom: 22px;
  width: 52px;
  height: 52px;
}

.cover-wave {
  left: -8%;
  right: -8%;
  bottom: -14px;
  height: 42px;
  border-radius: 50% 50% 0 0;
  background: rgba(255, 255, 255, .52);
}

.cover-note {
  position: absolute;
  right: 16px;
  bottom: 16px;
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 999px;
  color: #2c3b56;
  background: rgba(255, 255, 255, .72);
  font-size: 12px;
  font-weight: 800;
}

.card-body {
  display: grid;
  gap: 14px;
  padding: 16px 16px 18px;
}

.card-head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: center;
}

.community-stamp {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 3px solid rgba(255, 255, 255, .9);
  border-radius: 12px;
  color: #fff;
  background: var(--stamp-bg);
  box-shadow: 0 10px 18px var(--card-shadow);
  font-size: 12px;
  font-weight: 900;
}

.card-title h3 {
  margin: 0;
  font-size: 20px;
  line-height: 1.2;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tag-strong,
.tag-soft {
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 800;
}

.tag-strong {
  color: var(--accent);
  background: var(--chip-bg);
}

.tag-soft {
  color: #7c8799;
  background: #f3f6fa;
}

.card-body p {
  margin: 0;
  color: #4c5970;
  line-height: 1.7;
}

.card-stats,
.card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-stats {
  color: #8a96a8;
  font-size: 13px;
  font-weight: 700;
}

.card-foot span {
  color: #5f6c82;
  font-size: 13px;
}

.follow-button {
  min-width: 72px;
  min-height: 34px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  background: linear-gradient(180deg, #ff7468 0%, #ff5d50 100%);
  font-weight: 800;
}

.follow-button.followed {
  color: #a0a9b8;
  background: #f4f6f9;
}

.status-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 28px;
}

.status-card {
  min-height: 208px;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 10px;
  padding: 24px;
  border: 1px solid rgba(226, 233, 242, .9);
  border-radius: 8px;
  background: rgba(255, 255, 255, .88);
  box-shadow: 0 18px 40px rgba(47, 67, 102, .06);
  text-align: center;
}

.status-card svg {
  color: #8db6f2;
}

.status-card strong {
  font-size: 20px;
}

.status-card p {
  margin: 0;
  color: #7b8798;
  line-height: 1.7;
}

.status-card button,
.status-card a {
  min-width: 126px;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 8px;
  color: #fff;
  background: linear-gradient(180deg, #ff7565, #ff5448);
  box-shadow: 0 12px 24px rgba(255, 96, 80, .18);
  font-weight: 800;
}

.spin {
  animation: spin .8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1280px) {
  .community-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1120px) {
  .square-head,
  .square-layout {
    grid-template-columns: 1fr;
  }

  .filter-panel {
    position: static;
  }

  .hero-banner {
    grid-template-columns: minmax(0, 1fr) 160px auto;
  }
}

@media (max-width: 860px) {
  .head-copy h1 {
    font-size: 40px;
  }

  .hero-banner {
    grid-template-columns: 1fr;
    padding: 22px;
  }

  .hero-visual {
    order: 3;
    height: 106px;
  }

  .hero-action {
    width: 100%;
  }

  .square-toolbar {
    display: grid;
    justify-content: stretch;
  }

  .square-toolbar p {
    text-align: left;
  }

  .community-grid,
  .status-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .square-page {
    width: 100%;
  }

  .head-copy h1 {
    font-size: 34px;
  }

  .head-copy p {
    font-size: 16px;
  }

  .category-tabs,
  .toolbar-main {
    gap: 10px;
  }

  .category-tabs button {
    flex: 1 1 calc(50% - 10px);
  }

  .filter-actions,
  .community-grid,
  .status-strip {
    grid-template-columns: 1fr;
  }

  .card-title h3 {
    font-size: 18px;
  }

  .card-stats,
  .card-foot {
    flex-direction: column;
    align-items: flex-start;
  }

  .follow-button {
    width: 100%;
  }
}
</style>
