<template>
  <section class="page-wrap page-grid">
    <main class="section-stack">
      <el-card shadow="never">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/square' }">社区</el-breadcrumb-item>
          <el-breadcrumb-item>{{ post.communityName }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="detail-title">{{ post.title }}</h1>
        <div class="author-row">
          <el-avatar>{{ post.author.slice(0, 1) }}</el-avatar>
          <div>
            <strong>{{ post.author }}</strong>
            <span>{{ post.authorMbti }} · {{ post.time }}</span>
          </div>
        </div>
        <p class="post-content">{{ post.content }}</p>
        <div class="tag-row">
          <el-tag v-for="tag in post.tags" :key="tag" effect="plain">#{{ tag }}</el-tag>
        </div>
        <el-divider />
        <el-button-group>
          <el-button :icon="Pointer" @click="post.likes += 1">{{ post.likes }}</el-button>
          <el-button :icon="Star">收藏</el-button>
          <el-button :icon="Warning">举报</el-button>
        </el-button-group>
      </el-card>

      <el-card shadow="never">
        <template #header>评论</template>
        <el-input v-model="commentText" type="textarea" :rows="4" placeholder="写下你的想法" />
        <el-button type="primary" class="comment-button" @click="sendComment">发布评论</el-button>
        <div class="comment-list">
          <el-card v-for="comment in comments" :key="comment.id" shadow="never">
            <strong>{{ comment.author }}</strong>
            <p>{{ comment.content }}</p>
          </el-card>
        </div>
      </el-card>
    </main>

    <aside class="section-stack">
      <el-card shadow="never">
        <template #header>帖子数据</template>
        <el-statistic title="浏览" :value="Number(String(post.views).replace(/\\D/g, '')) || 3100" />
        <el-divider />
        <el-statistic title="评论" :value="post.comments" />
      </el-card>
      <el-card shadow="never">
        <template #header>相关讨论</template>
        <RouterLink v-for="item in related" :key="item.id" :to="`/posts/${item.id}`" class="related-link">
          {{ item.title }}
        </RouterLink>
      </el-card>
    </aside>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Pointer, Star, Warning } from '@element-plus/icons-vue'
import { findPost, posts } from '../data/mockData'

const route = useRoute()
const post = reactive({ ...findPost(route.params.id) })
const commentText = ref('')
const comments = ref([
  { id: 1, author: '海边便利店', content: '这段很真实，尤其是“先小范围验证”这一点。' },
  { id: 2, author: '林间计划', content: '我也在转行阶段，感觉被说中了。' }
])
const related = computed(() => posts.filter((item) => item.id !== post.id).slice(0, 3))

function sendComment() {
  if (!commentText.value.trim()) return
  comments.value.unshift({
    id: Date.now(),
    author: '小海盐',
    content: commentText.value.trim()
  })
  commentText.value = ''
}
</script>

<style scoped>
.detail-title {
  margin: 18px 0;
  font-size: 34px;
  line-height: 1.25;
}

.author-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-row strong,
.author-row span {
  display: block;
}

.author-row span {
  margin-top: 4px;
  color: var(--lab-muted);
}

.post-content {
  margin: 24px 0;
  color: #31425f;
  font-size: 16px;
  line-height: 1.95;
}

.comment-button {
  margin-top: 12px;
}

.comment-list {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.related-link {
  display: block;
  padding: 10px 0;
  border-bottom: 1px solid var(--lab-line);
  color: #25344f;
  font-weight: 800;
  line-height: 1.5;
}
</style>
