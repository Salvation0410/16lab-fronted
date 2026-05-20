<template>
  <el-container class="app-shell">
    <el-header class="top-nav" height="74px">
      <RouterLink class="brand-lockup" to="/" aria-label="16Lab 首页">
        <span class="brand-mark">16</span>
        <span>
          <strong>16Lab</strong>
          <small>MBTI 社区</small>
        </span>
      </RouterLink>

      <el-menu
        class="nav-menu"
        mode="horizontal"
        :ellipsis="false"
        :default-active="activePath"
        router
      >
        <el-menu-item
          v-for="item in navItems"
          :key="item.to"
          :index="item.to"
        >
          {{ item.label }}
        </el-menu-item>
      </el-menu>

      <el-input
        v-model.trim="keyword"
        class="nav-search"
        placeholder="搜索人格 / 帖子 / 用户"
        clearable
        @keyup.enter="submitSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <div class="nav-actions">
        <el-button type="primary" :icon="EditPen" @click="router.push(publishTarget)">
          发布
        </el-button>
        <el-tooltip content="通知" placement="bottom">
          <el-button circle :icon="Bell" @click="goNotifications" />
        </el-tooltip>
        <el-dropdown trigger="click">
          <button class="avatar-button" type="button">
            <el-avatar :size="38">{{ avatarText }}</el-avatar>
            <el-icon><ArrowDown /></el-icon>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push(profileTarget)">个人主页</el-dropdown-item>
              <el-dropdown-item @click="router.push('/admin')">后台管理</el-dropdown-item>
              <el-dropdown-item divided @click="auth.logout()">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-main class="main-panel">
      <RouterView />
    </el-main>
  </el-container>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { ArrowDown, Bell, EditPen, Search } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const keyword = ref(String(route.query.q || ''))

const navItems = [
  { label: '首页', to: '/' },
  { label: '人格图鉴', to: '/personalities' },
  { label: '社区', to: '/square' },
  { label: '测试', to: '/mbti-test' },
  { label: 'AI 陪聊', to: '/ai' },
  { label: '文章', to: '/search' },
  { label: '活动', to: '/notifications' }
]

const activePath = computed(() => {
  if (route.path.startsWith('/personalities')) return '/personalities'
  if (route.path.startsWith('/communities')) return '/square'
  if (route.path.startsWith('/posts')) return '/square'
  return route.path || '/'
})
const publishTarget = computed(() => (auth.isLoggedIn ? '/create' : `/login?redirect=${encodeURIComponent(route.fullPath)}`))
const profileTarget = computed(() => `/users/${auth.user?.id || 16}`)
const avatarText = computed(() => String(auth.user?.nickname || '16').slice(0, 2).toUpperCase())

function submitSearch() {
  router.push({ path: '/search', query: keyword.value ? { q: keyword.value } : {} })
}

function goNotifications() {
  router.push('/notifications')
}

watch(
  () => route.query.q,
  (value) => {
    keyword.value = String(value || '')
  }
)
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.top-nav {
  position: sticky;
  top: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: auto minmax(460px, 1fr) minmax(220px, 320px) auto;
  gap: 20px;
  align-items: center;
  border-bottom: 1px solid rgba(218, 228, 240, .86);
  background: rgba(255, 255, 255, .92);
  backdrop-filter: blur(18px);
  box-shadow: 0 12px 30px rgba(40, 62, 95, .06);
}

.brand-lockup {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 130px;
}

.brand-mark {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(145deg, #2f80ed, #ff7b62);
  font-weight: 900;
}

.brand-lockup strong,
.brand-lockup small {
  display: block;
}

.brand-lockup strong {
  color: #101b33;
  font-size: 21px;
  line-height: 1;
}

.brand-lockup small {
  margin-top: 3px;
  color: #6f7f96;
  font-size: 12px;
  font-weight: 800;
}

.nav-menu {
  min-width: 0;
  border-bottom: 0;
  background: transparent;
}

.nav-menu :deep(.el-menu-item) {
  font-weight: 800;
}

.nav-search {
  min-width: 0;
}

.nav-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.avatar-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  padding: 0;
  color: #33445f;
  background: transparent;
}

.main-panel {
  padding: 22px 30px 44px;
}

@media (max-width: 1180px) {
  .top-nav {
    grid-template-columns: auto 1fr auto;
    height: auto;
    min-height: 74px;
    padding: 12px 18px;
  }

  .nav-menu {
    grid-column: 1 / -1;
    order: 4;
    overflow-x: auto;
  }

  .nav-search {
    display: none;
  }
}

@media (max-width: 720px) {
  .main-panel {
    padding: 14px;
  }

  .nav-actions .el-button:not(.is-circle) {
    display: none;
  }
}
</style>
