<template>
  <section class="page-wrap page-grid">
    <main class="section-stack">
      <el-card shadow="never">
        <template #header>
          <div class="panel-head">
            <div>
              <h1 class="page-title">MBTI 测试</h1>
              <p class="page-subtitle">别急着追求标准答案，选更像现在的你。</p>
            </div>
            <el-progress type="circle" :width="72" :percentage="progress" />
          </div>
        </template>

        <template v-if="!result">
          <h2>{{ activeQuestion.title }}</h2>
          <el-radio-group v-model="answers[activeQuestion.id]" class="answer-list">
            <el-radio-button v-for="option in activeQuestion.options" :key="option.id" :label="option.id">
              {{ option.label }}. {{ option.content }}
            </el-radio-button>
          </el-radio-group>
          <div class="test-actions">
            <el-button :disabled="index === 0" @click="index -= 1">上一题</el-button>
            <el-button type="primary" @click="next">{{ isLast ? '查看结果' : '下一题' }}</el-button>
          </div>
        </template>

        <template v-else>
          <el-result icon="success" title="INTJ-A" sub-title="你更像一个偏长期规划、独立判断的人。">
            <template #extra>
              <el-button type="primary" @click="$router.push('/personalities/INTJ')">查看详情</el-button>
              <el-button @click="restart">重新测试</el-button>
            </template>
          </el-result>
        </template>
      </el-card>
    </main>

    <aside class="section-stack">
      <el-card shadow="never">
        <template #header>答题卡</template>
        <div class="sheet-grid">
          <el-button
            v-for="(question, questionIndex) in mbtiQuestions"
            :key="question.id"
            :type="answers[question.id] ? 'primary' : 'default'"
            @click="index = questionIndex"
          >
            {{ questionIndex + 1 }}
          </el-button>
        </div>
      </el-card>
    </aside>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { mbtiQuestions } from '../data/mockData'

const index = ref(0)
const result = ref(false)
const answers = reactive({})
const activeQuestion = computed(() => mbtiQuestions[index.value])
const isLast = computed(() => index.value === mbtiQuestions.length - 1)
const progress = computed(() => Math.round((Object.keys(answers).length / mbtiQuestions.length) * 100))

function next() {
  if (!isLast.value) index.value += 1
  else result.value = true
}

function restart() {
  Object.keys(answers).forEach((key) => delete answers[key])
  index.value = 0
  result.value = false
}
</script>

<style scoped>
.answer-list {
  display: grid;
  gap: 12px;
  margin: 22px 0;
}

.answer-list :deep(.el-radio-button__inner) {
  width: 100%;
  justify-content: flex-start;
  border-left: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 14px 16px;
  white-space: normal;
  text-align: left;
}

.test-actions {
  display: flex;
  justify-content: space-between;
}

.sheet-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
</style>
