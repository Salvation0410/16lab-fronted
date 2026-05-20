<template>
  <el-container class="admin-shell">
    <el-aside width="248px" class="admin-sidebar">
      <RouterLink class="admin-brand" to="/">
        <span>16</span>
        <strong>后台管理</strong>
      </RouterLink>

      <el-menu class="admin-menu" router :default-active="activePath">
        <el-menu-item index="/admin">
          <el-icon><DataBoard /></el-icon>
          <span>总览</span>
        </el-menu-item>
        <el-menu-item v-for="item in menu" :key="item.path" :index="`/admin/${item.path}`">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-main class="admin-content">
      <RouterView />
    </el-main>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import {
  Bell,
  ChatDotRound,
  CollectionTag,
  DataBoard,
  Flag,
  Management,
  Memo,
  User
} from '@element-plus/icons-vue'

const route = useRoute()
const activePath = computed(() => route.path)
const menu = [
  { path: 'users', label: '用户管理', icon: User },
  { path: 'posts', label: '帖子管理', icon: Memo },
  { path: 'comments', label: '评论管理', icon: ChatDotRound },
  { path: 'reports', label: '举报管理', icon: Flag },
  { path: 'communities', label: '社区管理', icon: Management },
  { path: 'tags', label: '话题标签', icon: CollectionTag },
  { path: 'notifications', label: '系统通知', icon: Bell }
]
</script>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background: #f5f8fb;
}

.admin-sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  border-right: 1px solid #e3ebf4;
  background: #fff;
}

.admin-brand {
  height: 76px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
}

.admin-brand span {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: #fff;
  background: #2f80ed;
  font-weight: 900;
}

.admin-brand strong {
  color: #14213d;
  font-size: 18px;
}

.admin-menu {
  border-right: 0;
}

.admin-content {
  padding: 26px;
}

@media (max-width: 820px) {
  .admin-shell {
    display: block;
  }

  .admin-sidebar {
    position: static;
    width: 100% !important;
    height: auto;
  }
}
</style>
