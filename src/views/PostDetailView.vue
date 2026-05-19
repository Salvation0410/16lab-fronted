<template>
  <article v-if="post" class="content-grid">
    <section class="panel">
      <h1 class="page-title">{{ post.title }}</h1>
      <div class="meta-row" style="margin:12px 0">
        <RouterLink :to="`/users/${post.userId}`">{{ post.author?.nickname || `用户 ${post.userId}` }}</RouterLink>
        <span>{{ post.community?.name }}</span>
        <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
      </div>
      <div v-if="post.imageUrls?.length" class="image-grid">
        <img v-for="url in post.imageUrls" :key="url" :src="url" alt="" />
      </div>
      <p class="post-content">{{ post.content }}</p>
      <div class="toolbar">
        <button class="ghost-button" @click="needLogin(like)"><Heart :size="18" /> {{ post.likeCount }}</button>
        <button class="ghost-button" @click="needLogin(favorite)"><Bookmark :size="18" /> {{ post.favoriteCount }}</button>
        <button class="ghost-button" @click="reportPost"><Flag :size="18" />举报</button>
      </div>
    </section>

    <aside class="right-rail">
      <div class="panel">
        <h2>评论</h2>
        <form class="form-stack" @submit.prevent="needLogin(sendComment)">
          <textarea v-model="commentText" class="form-control" placeholder="写下你的评论"></textarea>
          <button class="primary-button" type="submit">发送</button>
        </form>
        <div class="list" style="margin-top:14px">
          <div v-for="comment in comments" :key="comment.id" class="list-item">
            <div>{{ comment.content }}</div>
            <div class="meta-row" style="margin-top:8px">
              <span>{{ comment.likeCount || 0 }} 赞</span>
              <button class="plain-button" @click="replyTo(comment.id)">回复</button>
            </div>
            <div v-for="reply in comment.replies || []" :key="reply.id" class="list-item reply">{{ reply.content }}</div>
          </div>
        </div>
      </div>
    </aside>
  </article>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bookmark, Flag, Heart } from 'lucide-vue-next'
import { commentApi, interactionApi, postApi, reportApi } from '../api'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const post = ref(null)
const comments = ref([])
const commentText = ref('')

function needLogin(fn) {
  if (!auth.isLoggedIn) return router.push('/login')
  return fn()
}

async function load() {
  post.value = await postApi.detail(route.params.id)
  const data = await commentApi.list(route.params.id, { page: 1, size: 30 })
  comments.value = data.list
  await postApi.view(route.params.id)
}

async function like() {
  await interactionApi.likePost(route.params.id)
  await load()
}

async function favorite() {
  await interactionApi.favorite(route.params.id)
  await load()
}

async function sendComment() {
  if (!commentText.value.trim()) return
  await commentApi.create(route.params.id, { content: commentText.value })
  commentText.value = ''
  await load()
}

async function replyTo(id) {
  const content = window.prompt('回复内容')
  if (!content) return
  await commentApi.reply(id, { content })
  await load()
}

async function reportPost() {
  if (!auth.isLoggedIn) return router.push('/login')
  await reportApi.create({ targetType: 'POST', targetId: Number(route.params.id), reasonType: 'OTHER', reasonDetail: '用户举报' })
  window.alert('举报已提交')
}

onMounted(load)
</script>

<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
  margin: 16px 0;
}

.image-grid img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
}

.post-content {
  line-height: 1.8;
  white-space: pre-wrap;
}

.reply {
  margin-top: 8px;
  background: white;
}
</style>
