<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <RouterLink class="brand" to="/">
        <span class="brand-mark">16</span>
        <span>后台管理</span>
      </RouterLink>
      <nav>
        <RouterLink to="/admin"><LayoutDashboard :size="18" />总览</RouterLink>
        <RouterLink v-for="item in menu" :key="item.path" :to="`/admin/${item.path}`">
          <component :is="item.icon" :size="18" />{{ item.label }}
        </RouterLink>
      </nav>
    </aside>
    <section class="admin-content">
      <RouterView />
    </section>
  </div>
</template>

<script setup>
import {
  Bell,
  Flag,
  Hash,
  LayoutDashboard,
  MessageSquare,
  Bot,
  ScrollText,
  ShieldAlert,
  UsersRound,
  Waypoints
} from 'lucide-vue-next'

const menu = [
  { path: 'users', label: '用户管理', icon: UsersRound },
  { path: 'posts', label: '帖子管理', icon: ScrollText },
  { path: 'comments', label: '评论管理', icon: MessageSquare },
  { path: 'reports', label: '举报管理', icon: Flag },
  { path: 'communities', label: '社区管理', icon: Waypoints },
  { path: 'tags', label: '话题标签', icon: Hash },
  { path: 'sensitive-words', label: '敏感词', icon: ShieldAlert },
  { path: 'notifications', label: '系统通知', icon: Bell }
  , { path: 'ai', label: 'AI记录', icon: Bot }
]
</script>
