<template>
  <section class="panel test-panel">
    <div class="page-header">
      <div>
        <h1 class="page-title">18题 MBTI 简测</h1>
        <p class="muted">四个维度快速分析，结果可保存到个人主页</p>
      </div>
      <span class="tag">{{ answeredCount }}/{{ questions.length }}</span>
    </div>

    <form v-if="!result" class="form-stack" @submit.prevent="submit">
      <div v-for="question in questions" :key="question.id" class="question-block">
        <strong>{{ question.sortOrder }}. {{ question.title }}</strong>
        <div class="option-grid">
          <label v-for="option in question.options" :key="option.id" class="option-item">
            <input v-model="answers[question.id]" type="radio" :value="option.id" />
            <span>{{ option.content }}</span>
          </label>
        </div>
      </div>
      <button class="primary-button" type="submit">提交测试</button>
    </form>

    <div v-else class="result-panel">
      <h2>你的结果：{{ result.resultMbti }}</h2>
      <div class="dimension-grid">
        <div v-for="(value, key) in result.dimensions" :key="key" class="dimension-item">
          <span>{{ key }}</span>
          <div><i :style="{ width: `${value}%` }"></i></div>
          <strong>{{ value }}%</strong>
        </div>
      </div>
      <button class="primary-button" @click="saveResult">保存到个人主页</button>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mbtiApi } from '../api'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const questions = ref([])
const answers = reactive({})
const result = ref(null)
const answeredCount = computed(() => Object.keys(answers).length)

async function submit() {
  result.value = await mbtiApi.submit({
    answers: questions.value.map((question) => ({
      questionId: question.id,
      optionId: answers[question.id]
    }))
  })
}

async function saveResult() {
  if (!auth.isLoggedIn) return router.push('/login')
  await mbtiApi.save(result.value.recordId)
  router.push(`/users/${auth.user.userId}`)
}

onMounted(async () => {
  questions.value = await mbtiApi.questions()
})
</script>

<style scoped>
.test-panel {
  max-width: 900px;
  margin: 0 auto;
}

.question-block {
  padding: 16px;
  border: 1px solid #e6e9f0;
  border-radius: 8px;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.option-item {
  display: flex;
  gap: 8px;
  padding: 12px;
  border: 1px solid #d9dde6;
  border-radius: 8px;
}

.dimension-grid {
  display: grid;
  gap: 12px;
  margin: 18px 0;
}

.dimension-item {
  display: grid;
  grid-template-columns: 30px 1fr 52px;
  align-items: center;
  gap: 10px;
}

.dimension-item div {
  height: 10px;
  background: #eef1f6;
  border-radius: 999px;
  overflow: hidden;
}

.dimension-item i {
  display: block;
  height: 100%;
  background: #ef4f6d;
}

@media (max-width: 620px) {
  .option-grid {
    grid-template-columns: 1fr;
  }
}
</style>
