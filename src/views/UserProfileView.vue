<template>
  <section v-if="profile">
    <div class="panel profile-head">
      <div class="avatar">{{ (profile.nickname || profile.username || '?').slice(0, 1) }}</div>
      <div>
        <h1 class="page-title">{{ profile.nickname || profile.username }}</h1>
        <p class="muted">{{ profile.bio || '这个用户还没有填写简介' }}</p>
        <div class="meta-row">
          <span v-if="profile.currentMbti" class="tag">{{ profile.currentMbti }}</span>
          <span>{{ profile.likeCount }} 获赞</span>
          <span>{{ profile.followerCount }} 粉丝</span>
          <span>{{ profile.followingCount }} 关注</span>
        </div>
      </div>
    </div>

    <div class="toolbar" style="margin:16px 0">
      <button :class="tab === 'posts' ? 'primary-button' : 'ghost-button'" @click="loadPosts">帖子</button>
      <button :class="tab === 'favorites' ? 'primary-button' : 'ghost-button'" @click="loadFavorites">收藏</button>
      <button :class="tab === 'history' ? 'primary-button' : 'ghost-button'" @click="loadHistory">MBTI记录</button>
    </div>

    <div v-if="tab !== 'history'" class="post-grid">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
    <div v-else class="panel list">
      <div v-for="item in histories" :key="`${item.mbti}-${item.startTime}`" class="list-item">
        {{ item.mbti }}{{ item.variant ? '-' + item.variant : '' }}
        <span class="muted">{{ item.startTime }} 至 {{ item.endTime || '现在' }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { userApi } from '../api'
import PostCard from '../components/PostCard.vue'

const route = useRoute()
const profile = ref(null)
const posts = ref([])
const histories = ref([])
const tab = ref('posts')

async function loadProfile() {
  profile.value = await userApi.home(route.params.id)
  await loadPosts()
}

async function loadPosts() {
  tab.value = 'posts'
  const data = await userApi.posts(route.params.id, { page: 1, size: 20 })
  posts.value = data.list
}

async function loadFavorites() {
  tab.value = 'favorites'
  const data = await userApi.favorites(route.params.id, { page: 1, size: 20 })
  posts.value = data.list
}

async function loadHistory() {
  tab.value = 'history'
  histories.value = await userApi.history(route.params.id)
}

onMounted(loadProfile)
watch(() => route.params.id, loadProfile)
</script>

<style scoped>
.profile-head {
  display: flex;
  gap: 18px;
  align-items: center;
}

.avatar {
  width: 80px;
  height: 80px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #111827;
  color: white;
  font-size: 30px;
  font-weight: 800;
}
</style>
