<template>
  <section class="login-view">
    <el-card class="login-card" shadow="never">
      <div class="login-art">
        <RouterLink to="/" class="brand">16Lab</RouterLink>
        <h1>先登录，再慢慢认识自己。</h1>
        <p>账号密码和邮箱两种方式都保留。现在是前端静态模式，提交后会写入本地模拟登录态。</p>
      </div>

      <div class="login-form">
        <div class="panel-head">
          <div>
            <h2>{{ isRegister ? '创建账号' : '欢迎回来' }}</h2>
            <p>{{ isRegister ? '给自己留一个固定入口。' : '继续你的 16Lab 旅程。' }}</p>
          </div>
          <el-button text type="primary" @click="toggleMode">{{ isRegister ? '去登录' : '去注册' }}</el-button>
        </div>

        <el-tabs v-model="method" stretch>
          <el-tab-pane label="账号密码" name="password" />
          <el-tab-pane label="邮箱验证" name="email" />
        </el-tabs>

        <el-form :model="form" label-position="top" size="large" @submit.prevent>
          <template v-if="method === 'password'">
            <el-form-item label="账号">
              <el-input v-model="form.account" placeholder="输入账号或邮箱" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="form.password" type="password" show-password placeholder="输入密码" />
            </el-form-item>
            <el-form-item v-if="isRegister" label="确认密码">
              <el-input v-model="form.confirmPassword" type="password" show-password placeholder="再输入一次密码" />
            </el-form-item>
          </template>

          <template v-else>
            <el-form-item label="邮箱">
              <el-input v-model="form.email" placeholder="hello@16lab.cn" />
            </el-form-item>
            <el-form-item label="验证码">
              <el-input v-model="form.code" placeholder="输入验证码">
                <template #append>
                  <el-button @click="notice = '验证码已发送，这是本地演示。'">发送</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="isRegister" label="密码">
              <el-input v-model="form.password" type="password" show-password placeholder="设置密码" />
            </el-form-item>
          </template>

          <el-alert v-if="notice" :title="notice" type="success" :closable="false" show-icon />
          <el-button type="primary" class="submit-button" size="large" @click="submit">
            {{ isRegister ? '完成注册' : '登录' }}
          </el-button>
        </el-form>
      </div>
    </el-card>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const method = ref('password')
const mode = ref(route.query.mode === 'register' ? 'register' : 'login')
const notice = ref('')
const form = reactive({ account: '', email: '', password: '', confirmPassword: '', code: '' })
const isRegister = computed(() => mode.value === 'register')

function toggleMode() {
  mode.value = isRegister.value ? 'login' : 'register'
}

async function submit() {
  if (method.value === 'email') await auth.emailLogin({ email: form.email })
  else await auth.login({ account: form.account })
  await router.push(route.query.redirect || '/')
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 28px;
  background: linear-gradient(135deg, #e8f5ff, #fff7f1);
}

.login-card {
  width: min(100%, 1040px);
}

.login-card :deep(.el-card__body) {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 28px;
  padding: 28px;
}

.login-art {
  min-height: 540px;
  display: grid;
  align-content: center;
  gap: 16px;
  border-radius: 8px;
  padding: 40px;
  background: linear-gradient(145deg, #dff0ff, #fff0e8);
}

.brand {
  color: var(--lab-blue);
  font-size: 30px;
  font-weight: 900;
}

.login-art h1 {
  max-width: 420px;
  margin: 0;
  font-size: 42px;
  line-height: 1.2;
}

.login-art p,
.login-form p {
  color: var(--lab-muted);
  line-height: 1.8;
}

.login-form {
  display: grid;
  align-content: center;
}

.login-form h2 {
  margin: 0;
  font-size: 28px;
}

.submit-button {
  width: 100%;
  margin-top: 14px;
}

@media (max-width: 860px) {
  .login-card :deep(.el-card__body) {
    grid-template-columns: 1fr;
  }

  .login-art {
    min-height: 240px;
  }
}
</style>
