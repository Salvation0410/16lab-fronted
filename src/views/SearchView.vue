<template>
  <section class="page-wrap page-grid">
    <main class="section-stack">
      <el-card shadow="never">
        <el-input v-model="keyword" size="large" placeholder="搜索人格、帖子或用户" clearable @keyup.enter="commitSearch">
          <template #append>
            <el-button :icon="Search" @click="commitSearch">搜索</el-button>
          </template>
        </el-input>
      </el-card>

      <el-card shadow="never">
        <template #header>
          <div class="panel-head">
            <span>搜索结果</span>
            <el-segmented v-model="type" :options="['全部', '帖子', '社区', '用户']" />
          </div>
        </template>

        <div class="result-list">
          <RouterLink v-for="post in filteredPosts" :key="post.id" :to="`/posts/${post.id}`" class="result-item">
            <strong>{{ post.title }}</strong>
            <p>{{ post.content }}</p>
            <span>{{ post.author }} · {{ post.communityName }}</span>
          </RouterLink>
        </div>
      </el-card>
    </main>

    <aside class="section-stack">
      <el-card shadow="never">
        <template #header>相关社区</template>
        <RouterLink v-for="item in communities.slice(0, 4)" :key="item.id" :to="`/communities/${item.id}`" class="side-link">
          {{ item.name }}
        </RouterLink>
      </el-card>
    </aside>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { communities, posts } from '../data/mockData'

const route = useRoute()
const keyword = ref(String(route.query.q || ''))
const committed = ref(keyword.value)
const type = ref('全部')

const filteredPosts = computed(() => {
  const term = committed.value.trim().toLowerCase()
  if (!term) return posts
  return posts.filter((post) => [post.title, post.content, post.author, post.communityName, ...post.tags].join(' ').toLowerCase().includes(term))
})

function commitSearch() {
  committed.value = keyword.value
}
</script>

<style scoped>
.result-list {
  display: grid;
  gap: 14px;
}

.result-item {
  display: grid;
  gap: 8px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--lab-line);
}

.result-item strong {
  color: #16213d;
  font-size: 18px;
}

.result-item p {
  margin: 0;
  color: var(--lab-muted);
  line-height: 1.7;
}

.result-item span,
.side-link {
  color: var(--lab-muted);
}

.side-link {
  display: block;
  padding: 10px 0;
}
</style>
