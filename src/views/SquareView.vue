<template>
  <section class="page-wrap section-stack">
    <div class="panel-head">
      <div>
        <h1 class="page-title">社区广场</h1>
        <p class="page-subtitle">先挑一个你愿意停留的地方。聊人格，也聊生活。</p>
      </div>
      <el-button type="primary" :icon="Plus" @click="$router.push('/create')">发布帖子</el-button>
    </div>

    <el-card shadow="never">
      <el-tabs v-model="activeType">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="MBTI" name="MBTI" />
        <el-tab-pane label="成长" name="成长" />
        <el-tab-pane label="关系" name="关系" />
        <el-tab-pane label="职业" name="职业" />
      </el-tabs>

      <el-row :gutter="18">
        <el-col v-for="item in filteredCommunities" :key="item.id" :xs="24" :sm="12" :lg="8">
          <el-card class="community-card" shadow="hover">
            <div class="community-cover" :class="item.tone">
              <span>{{ item.short }}</span>
            </div>
            <h2>{{ item.name }}</h2>
            <p>{{ item.description }}</p>
            <div class="community-meta">
              <el-tag effect="plain">{{ item.type }}</el-tag>
              <span>{{ item.members }} 成员</span>
              <span>{{ item.posts }} 帖子</span>
            </div>
            <div class="community-actions">
              <el-button type="primary" plain @click="$router.push(`/communities/${item.id}`)">进入社区</el-button>
              <el-button :type="item.joined ? 'success' : 'default'" @click="item.joined = !item.joined">
                {{ item.joined ? '已关注' : '关注' }}
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { communities } from '../data/mockData'

const activeType = ref('all')
const filteredCommunities = computed(() => {
  if (activeType.value === 'all') return communities
  return communities.filter((item) => item.type === activeType.value)
})
</script>

<style scoped>
.community-card {
  margin-bottom: 18px;
}

.community-cover {
  min-height: 126px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: #fff;
  background: linear-gradient(145deg, #7fb7f4, #2f80ed);
  font-size: 34px;
  font-weight: 900;
}

.community-cover.green,
.community-cover.mint {
  background: linear-gradient(145deg, #77d3a0, #36a66a);
}

.community-cover.rose {
  background: linear-gradient(145deg, #f5a0bb, #df6b8f);
}

.community-cover.gold {
  background: linear-gradient(145deg, #f0c66f, #d79b2b);
}

.community-cover.lavender {
  background: linear-gradient(145deg, #9b91f2, #7067d6);
}

.community-card h2 {
  margin: 16px 0 8px;
  font-size: 20px;
}

.community-card p {
  min-height: 52px;
  margin: 0;
  color: var(--lab-muted);
  line-height: 1.7;
}

.community-meta,
.community-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.community-meta span {
  color: var(--lab-muted);
  font-size: 13px;
}
</style>
