<template>
  <RouterLink class="post-card" :to="`/posts/${post.id}`">
    <div class="post-cover">
      <img v-if="post.coverUrl" :src="post.coverUrl" alt="" />
      <span v-else>16Lab</span>
    </div>
    <div class="post-card-body">
      <h3 class="post-title">{{ post.title || '未命名帖子' }}</h3>
      <div class="meta-row">
        <span><Heart :size="14" /> {{ post.likeCount || 0 }}</span>
        <span><MessageCircle :size="14" /> {{ post.commentCount || 0 }}</span>
        <span><Eye :size="14" /> {{ post.viewCount || 0 }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { Eye, Heart, MessageCircle } from 'lucide-vue-next'

defineProps({
  post: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meta-row span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
