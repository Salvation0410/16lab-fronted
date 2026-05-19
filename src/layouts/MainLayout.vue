<template>
  <div class="app-shell">
    <header class="top-nav">
      <RouterLink class="top-brand" to="/" aria-label="16Lab 首页">
        <span class="top-brand-name">16Lab</span>
        <span class="top-brand-sub">MBTI 社区</span>
      </RouterLink>

      <nav class="top-links" aria-label="主导航">
        <RouterLink
          v-for="item in navItems"
          :key="item.label"
          class="top-link"
          :class="{ active: isNavActive(item) }"
          :to="item.to"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <form class="nav-search" role="search" @submit.prevent="submitSearch">
        <Search :size="18" />
        <input v-model.trim="keyword" placeholder="搜索帖子、用户、社区或话题" />
      </form>

      <div class="nav-actions">
        <template v-if="auth.isLoggedIn">
          <RouterLink class="publish-button" :to="publishTarget">
            <Plus :size="18" />
            <span>发布</span>
          </RouterLink>

          <button class="nav-icon" type="button" title="通知" @click="goNotifications">
            <Bell :size="20" />
          </button>
          <button class="nav-icon" type="button" title="私信" @click="goNotifications">
            <Mail :size="20" />
          </button>

          <RouterLink class="nav-avatar" :to="profileTarget" aria-label="个人主页">
            <img v-if="auth.user?.avatarUrl" :src="auth.user.avatarUrl" alt="" />
            <span v-else>{{ avatarText }}</span>
            <ChevronDown :size="16" />
          </RouterLink>
        </template>

        <template v-else>
          <RouterLink class="nav-auth-link" :to="loginTarget">登录</RouterLink>
          <RouterLink class="nav-auth-primary" :to="registerTarget">注册</RouterLink>
        </template>
      </div>
    </header>

    <main class="main-panel">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Bell, ChevronDown, Mail, Plus, Search } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const keyword = ref(String(route.query.q || ''))

const navItems = [
  { label: '首页', to: '/' },
  { label: '发现', to: '/search' },
  { label: '社区', to: '/square' },
  { label: '测试', to: '/mbti-test' },
  { label: 'AI 陪聊', to: '/ai' }
]

const publishTarget = computed(() => (auth.isLoggedIn ? '/create' : `/login?redirect=${encodeURIComponent(route.fullPath)}`))
const loginTarget = computed(() => `/login?redirect=${encodeURIComponent(route.fullPath)}`)
const registerTarget = computed(() => `/login?mode=register&redirect=${encodeURIComponent(route.fullPath)}`)
const profileTarget = computed(() => {
  if (!auth.isLoggedIn) return '/login'
  const userId = auth.user?.userId || auth.user?.id
  return userId ? `/users/${userId}` : '/login'
})
const avatarText = computed(() => {
  const name = auth.user?.nickname || auth.user?.username || '16'
  return String(name).slice(0, 2).toUpperCase()
})

function submitSearch() {
  const nextKeyword = keyword.value.trim()
  if (nextKeyword) {
    router.push({ path: '/search', query: { q: nextKeyword } })
    return
  }

  if (route.path === '/search') {
    router.push('/square')
  }
}

function goNotifications() {
  if (!auth.isLoggedIn) {
    router.push(`/login?redirect=${encodeURIComponent('/notifications')}`)
    return
  }
  router.push('/notifications')
}

function isNavActive(item) {
  if (item.label === '首页') return route.path === '/'
  if (item.label === '发现') return route.path === '/search'
  if (item.label === '社区') return route.path === '/square' || route.path.startsWith('/communities/')
  if (item.label === '测试') return route.path === '/mbti-test'
  if (item.label === 'AI 陪聊') return route.path === '/ai'
  return false
}

watch(
  () => route.query.q,
  (value) => {
    keyword.value = String(value || '')
  }
)
</script>
