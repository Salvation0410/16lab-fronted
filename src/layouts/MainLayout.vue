<template>
  <el-container class="app-shell">
    <el-header class="top-nav" height="74px">
      <RouterLink class="brand-lockup" to="/" aria-label="16Lab 首页">
        <strong>16Lab</strong>
        <small>MBTI 社区</small>
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
        placeholder="搜索帖子、用户、社区或话题"
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
        <el-tooltip content="私信" placement="bottom">
          <el-button circle :icon="Message" @click="router.push('/notifications')" />
        </el-tooltip>
        <el-dropdown trigger="click">
          <button class="avatar-button" type="button">
            <el-avatar :size="38" :src="avatarUrl">{{ avatarText }}</el-avatar>
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
import { ArrowDown, Bell, EditPen, Message, Search } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const keyword = ref(String(route.query.q || ''))

const navItems = [
  { label: '首页', to: '/' },
  { label: '发现', to: '/personalities' },
  { label: '社区', to: '/square' },
  { label: '测试', to: '/mbti-test' },
  { label: 'AI 陪聊', to: '/ai' }
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
const avatarUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'

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
  grid-template-columns: auto minmax(380px, 1fr) minmax(260px, 360px) auto;
  gap: 22px;
  align-items: center;
  border-bottom: 1px solid rgba(218, 228, 240, .86);
  background: rgba(255, 255, 255, .92);
  backdrop-filter: blur(18px);
  box-shadow: 0 14px 32px rgba(40, 62, 95, .05);
}

.brand-lockup {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 168px;
}

.brand-lockup strong {
  color: #101b33;
  font-size: 28px;
  line-height: 1;
  letter-spacing: -1px;
}

.brand-lockup small {
  color: #6f7f96;
  font-size: 14px;
  font-weight: 800;
}

.nav-menu {
  min-width: 0;
  border-bottom: 0;
  background: transparent;
}

.nav-menu :deep(.el-menu-item) {
  height: 74px;
  color: #18243d;
  font-weight: 800;
  border-bottom: 0;
}

.nav-menu :deep(.el-menu-item.is-active) {
  color: #ff5f50;
}

.nav-menu :deep(.el-menu-item.is-active::after) {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 9px;
  width: 28px;
  height: 2px;
  border-radius: 999px;
  background: #ff5f50;
  transform: translateX(-50%);
}

.nav-search {
  min-width: 0;
}

.nav-search :deep(.el-input__wrapper) {
  min-height: 42px;
  border-radius: 18px;
  background: #f5f8fc;
  box-shadow: inset 0 0 0 1px rgba(223, 231, 242, .85);
}

.nav-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.nav-actions > .el-button--primary {
  min-width: 104px;
  --el-button-bg-color: #ff6657;
  --el-button-border-color: #ff6657;
  --el-button-hover-bg-color: #f25546;
  --el-button-hover-border-color: #f25546;
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
