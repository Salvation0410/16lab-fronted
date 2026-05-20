<template>
  <section class="section-stack">
    <div>
      <h1 class="page-title">后台总览</h1>
      <p class="page-subtitle">这是静态管理台示例，方便先验证页面和路由。</p>
    </div>

    <el-row :gutter="16">
      <el-col v-for="item in adminStats" :key="item.label" :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <el-statistic :title="item.label" :value="item.value" />
          <el-tag type="success" effect="plain">{{ item.trend }}</el-tag>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script setup>
import { adminStats } from '../../data/mockData'
</script>
