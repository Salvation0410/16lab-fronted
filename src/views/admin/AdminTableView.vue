<template>
  <section>
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ config.title }}</h1>
        <p class="muted">{{ config.description }}</p>
      </div>
      <div class="toolbar">
        <input v-model="keyword" class="search-box" placeholder="关键词" @keyup.enter="load" />
        <button class="icon-button" title="刷新" @click="load"><RefreshCcw :size="18" /></button>
      </div>
    </div>

    <div v-if="resource === 'notifications'" class="panel form-inline">
      <input v-model="notice.userId" class="form-control" placeholder="用户ID" />
      <input v-model="notice.title" class="form-control" placeholder="标题" />
      <input v-model="notice.content" class="form-control" placeholder="内容" />
      <button class="primary-button" @click="sendNotice">发送</button>
    </div>

    <table class="admin-table">
      <thead>
        <tr>
          <th v-for="column in config.columns" :key="column.key">{{ column.label }}</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td v-for="column in config.columns" :key="column.key">{{ display(row, column.key) }}</td>
          <td>
            <div class="toolbar">
              <button v-for="action in actionsFor(row)" :key="action.label" class="plain-button" @click="action.run(row)">
                {{ action.label }}
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { RefreshCcw } from 'lucide-vue-next'
import { adminApi } from '../../api'

const route = useRoute()
const rows = ref([])
const keyword = ref('')
const notice = reactive({ userId: '', title: '', content: '' })
const resource = computed(() => route.params.resource || 'users')

const configs = {
  users: {
    title: '用户管理',
    description: '查看账号状态，封禁或解封用户',
    fetch: (params) => adminApi.users(params),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'username', label: '账号' },
      { key: 'nickname', label: '昵称' },
      { key: 'role', label: '角色' },
      { key: 'status', label: '状态' }
    ]
  },
  posts: {
    title: '帖子管理',
    description: '筛选帖子并处理隐藏、恢复和删除',
    fetch: (params) => adminApi.posts(params),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: '标题' },
      { key: 'authorNickname', label: '作者' },
      { key: 'status', label: '状态' },
      { key: 'likeCount', label: '点赞' }
    ]
  },
  comments: {
    title: '评论管理',
    description: '查看评论并删除违规内容',
    fetch: (params) => adminApi.comments(params),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'postTitle', label: '帖子' },
      { key: 'userNickname', label: '用户' },
      { key: 'content', label: '内容' },
      { key: 'status', label: '状态' }
    ]
  },
  reports: {
    title: '举报管理',
    description: '处理用户提交的举报',
    fetch: (params) => adminApi.reports(params),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'targetType', label: '对象' },
      { key: 'reasonLabel', label: '原因' },
      { key: 'status', label: '状态' },
      { key: 'targetSummary', label: '摘要' }
    ]
  },
  communities: {
    title: '社区管理',
    description: '维护 MBTI 社区和扩展社区',
    fetch: (params) => adminApi.communities(params),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: '名称' },
      { key: 'code', label: '编码' },
      { key: 'type', label: '类型' },
      { key: 'status', label: '状态' }
    ]
  },
  tags: {
    title: '话题标签',
    description: '管理社区话题标签',
    fetch: (params) => adminApi.tags(params),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: '名称' },
      { key: 'useCount', label: '使用次数' },
      { key: 'status', label: '状态' }
    ]
  },
  'sensitive-words': {
    title: '敏感词',
    description: '维护评论和 AI 输入过滤词',
    fetch: (params) => adminApi.sensitiveWords(params),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'word', label: '词语' },
      { key: 'level', label: '等级' },
      { key: 'status', label: '状态' }
    ]
  },
  notifications: {
    title: '系统通知',
    description: '查询通知并向指定用户发送系统消息',
    fetch: (params) => adminApi.notifications(params),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'userNickname', label: '用户' },
      { key: 'type', label: '类型' },
      { key: 'title', label: '标题' },
      { key: 'isRead', label: '已读' }
    ]
  },
  ai: {
    title: 'AI记录',
    description: '查看用户 AI 会话记录',
    fetch: (params) => adminApi.aiConversations(params),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'userId', label: '用户ID' },
      { key: 'title', label: '标题' },
      { key: 'mbtiUsed', label: 'MBTI' },
      { key: 'status', label: '状态' }
    ]
  }
}

const config = computed(() => configs[resource.value] || configs.users)

async function load() {
  const data = await config.value.fetch({ keyword: keyword.value, page: 1, size: 30 })
  rows.value = data.list
}

function display(row, key) {
  const value = row[key]
  if (value == null) return '-'
  if (Array.isArray(value)) return value.join('、')
  return String(value).length > 60 ? `${String(value).slice(0, 60)}...` : value
}

function actionsFor(row) {
  if (resource.value === 'users') {
    return row.status === 'BANNED'
      ? [{ label: '解封', run: async () => { await adminApi.unbanUser(row.id); await load() } }]
      : [{ label: '封禁', run: async () => { await adminApi.banUser(row.id); await load() } }]
  }
  if (resource.value === 'posts') {
    return [
      { label: '隐藏', run: async () => { await adminApi.hidePost(row.id); await load() } },
      { label: '恢复', run: async () => { await adminApi.restorePost(row.id); await load() } }
    ]
  }
  if (resource.value === 'comments') {
    return [{ label: '删除', run: async () => { await adminApi.deleteComment(row.id); await load() } }]
  }
  if (resource.value === 'reports') {
    return [{ label: '处理', run: async () => { await adminApi.processReport(row.id, { status: 'PROCESSED', handleResult: '已处理' }); await load() } }]
  }
  return []
}

async function sendNotice() {
  await adminApi.sendNotification({
    userId: Number(notice.userId),
    title: notice.title,
    content: notice.content
  })
  notice.userId = ''
  notice.title = ''
  notice.content = ''
  await load()
}

onMounted(load)
watch(resource, load)
</script>

<style scoped>
.form-inline {
  display: grid;
  grid-template-columns: 120px minmax(160px, 1fr) minmax(220px, 2fr) 100px;
  gap: 10px;
  margin-bottom: 16px;
}

@media (max-width: 760px) {
  .form-inline {
    grid-template-columns: 1fr;
  }
}
</style>
