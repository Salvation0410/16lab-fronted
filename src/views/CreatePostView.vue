<template>
  <section class="panel create-panel">
    <h1 class="page-title">发布帖子</h1>
    <form class="form-stack" @submit.prevent="submit">
      <select v-model="form.communityId" class="form-control">
        <option value="">选择社区</option>
        <option v-for="item in communities" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select>
      <input v-model="form.title" class="form-control" placeholder="标题" maxlength="100" />
      <textarea v-model="form.content" class="form-control" placeholder="分享你的想法"></textarea>
      <input v-model="tagInput" class="form-control" placeholder="话题标签，用逗号分隔" />
      <input v-model="imageInput" class="form-control" placeholder="图片 URL，最多9张，用逗号分隔" />
      <button class="primary-button" type="submit">提交审核</button>
      <p v-if="message" class="muted">{{ message }}</p>
    </form>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { communityApi, postApi } from '../api'

const router = useRouter()
const communities = ref([])
const tagInput = ref('')
const imageInput = ref('')
const message = ref('')
const form = reactive({
  communityId: '',
  title: '',
  content: ''
})

async function submit() {
  const result = await postApi.create({
    ...form,
    communityId: Number(form.communityId),
    tags: tagInput.value.split(/[，,]/).map((item) => item.trim()).filter(Boolean),
    imageUrls: imageInput.value.split(/[，,]/).map((item) => item.trim()).filter(Boolean).slice(0, 9)
  })
  message.value = '提交成功，等待后台审核后展示'
  setTimeout(() => router.push(`/posts/${result.postId}`), 600)
}

onMounted(async () => {
  communities.value = await communityApi.list({ type: 'MBTI' })
})
</script>

<style scoped>
.create-panel {
  max-width: 720px;
  margin: 0 auto;
}
</style>
