<template>
  <section class="section-stack">
    <div class="panel-head">
      <div>
        <h1 class="page-title">{{ title }}</h1>
        <p class="page-subtitle">静态表格示例，后端接入前先看页面流程。</p>
      </div>
      <el-input v-model="keyword" placeholder="关键词" clearable style="max-width: 260px" />
    </div>

    <el-card shadow="never">
      <el-table :data="filteredRows" stripe>
        <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label" />
        <el-table-column label="操作" width="160">
          <template #default>
            <el-button size="small" type="primary" plain>查看</el-button>
            <el-button size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { adminRows } from '../../data/mockData'

const route = useRoute()
const keyword = ref('')
const resource = computed(() => route.params.resource || 'users')
const titleMap = {
  users: '用户管理',
  posts: '帖子管理',
  reports: '举报管理',
  communities: '社区管理',
  comments: '评论管理',
  tags: '话题标签',
  notifications: '系统通知'
}
const title = computed(() => titleMap[resource.value] || '数据管理')
const rows = computed(() => adminRows[resource.value] || adminRows.users)
const columns = computed(() => {
  const first = rows.value[0] || {}
  return Object.keys(first).map((key) => ({ prop: key, label: key }))
})
const filteredRows = computed(() => {
  const term = keyword.value.trim().toLowerCase()
  if (!term) return rows.value
  return rows.value.filter((row) => Object.values(row).join(' ').toLowerCase().includes(term))
})
</script>
