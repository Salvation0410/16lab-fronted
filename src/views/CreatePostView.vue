<template>
  <section class="page-wrap create-view">
    <el-card shadow="never">
      <template #header>
        <div>
          <h1 class="page-title">发布帖子</h1>
          <p class="page-subtitle">不用写得很完美。把问题说清楚，就已经很好了。</p>
        </div>
      </template>

      <el-form :model="form" label-position="top" size="large">
        <el-form-item label="发布到">
          <el-select v-model="form.communityId" placeholder="选择社区">
            <el-option v-for="item in communities" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title" maxlength="80" show-word-limit placeholder="一句话说清楚你想聊什么" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" :rows="8" placeholder="写下你的想法、背景或想问的问题" />
        </el-form-item>
        <el-form-item label="话题标签">
          <el-select v-model="form.tags" multiple filterable allow-create default-first-option placeholder="输入后回车添加">
            <el-option label="INTJ" value="INTJ" />
            <el-option label="职业选择" value="职业选择" />
            <el-option label="情绪管理" value="情绪管理" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Promotion" @click="submit">提交审核</el-button>
          <el-button @click="$router.push('/square')">返回广场</el-button>
        </el-form-item>
      </el-form>

      <el-alert v-if="message" :title="message" type="success" show-icon :closable="false" />
    </el-card>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { Promotion } from '@element-plus/icons-vue'
import { communities } from '../data/mockData'

const message = ref('')
const form = reactive({
  communityId: communities[0]?.id,
  title: '',
  content: '',
  tags: []
})

function submit() {
  message.value = form.title ? '已生成一条本地示例帖子，后端接入后这里会提交到审核队列。' : '先写个标题，再发布会更清楚。'
}
</script>

<style scoped>
.create-view {
  max-width: 860px;
}
</style>
