<template>
  <section>
    <div class="page-header">
      <div>
        <h1 class="page-title">十六型人格百科</h1>
        <p class="muted">查看人格介绍，并进一步了解 A/T 细分差异</p>
      </div>
    </div>
    <div class="personality-grid">
      <article v-for="item in personalities" :key="item.code" class="panel personality-card" @click="open(item)">
        <div class="personality-code">{{ item.code }}</div>
        <h2>{{ item.nameCn }}</h2>
        <p>{{ item.summary }}</p>
        <span class="tag">{{ item.groupName }}</span>
      </article>
    </div>

    <div v-if="selected" class="panel detail-panel">
      <div class="page-header">
        <div>
          <h2>{{ detail.code }} {{ detail.nameCn }}</h2>
          <p class="muted">{{ detail.summary }}</p>
        </div>
        <button class="plain-button" @click="selected = null">关闭</button>
      </div>
      <p>{{ detail.description || detail.summary }}</p>
      <div class="list">
        <div v-for="variant in variants" :key="variant.code" class="list-item">
          <strong>{{ variant.code }}</strong>
          <p>{{ variant.summary }}</p>
          <p class="muted">{{ variant.growthAdvice }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { personalityApi } from '../api'

const personalities = ref([])
const selected = ref(null)
const detail = ref({})
const variants = ref([])

async function open(item) {
  selected.value = item.code
  detail.value = await personalityApi.detail(item.code)
  variants.value = await personalityApi.variants(item.code)
}

onMounted(async () => {
  personalities.value = await personalityApi.list()
})
</script>

<style scoped>
.personality-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 16px;
}

.personality-card {
  cursor: pointer;
}

.personality-code {
  font-size: 26px;
  font-weight: 900;
  color: #ef4f6d;
}

.detail-panel {
  margin-top: 18px;
}
</style>
