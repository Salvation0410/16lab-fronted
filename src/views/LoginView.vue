<template>
  <section class="auth-page">
    <div class="auth-shell">
      <section class="brand-stage" aria-label="16Lab">
        <RouterLink class="brand-lockup" to="/">
          <span class="brand-name">16Lab</span>
          <span class="brand-subtitle">MBTI 社区</span>
        </RouterLink>

        <div class="hero-copy">
          <p class="hero-kicker">16Lab</p>
          <h1>认识自我，理解他人<br />遇见同频的你</h1>
          <p>在轻松的交流里聊性格、观点和日常。先登录，再慢慢认识彼此。</p>
        </div>

        <div class="coast-scene" aria-hidden="true">
          <div class="sun"></div>
          <div class="cloud cloud-one"></div>
          <div class="cloud cloud-two"></div>
          <div class="bird bird-one"></div>
          <div class="bird bird-two"></div>
          <div class="sea"></div>
          <div class="cafe-sign">16Lab</div>
          <div class="table"></div>
          <div class="person person-left"></div>
          <div class="person person-mid"></div>
          <div class="person person-right"></div>
          <div class="chair chair-left"></div>
          <div class="chair chair-right"></div>
        </div>

        <div class="value-strip">
          <div class="value-item">
            <UsersRound :size="22" />
            <span>
              <strong>真实交流</strong>
              <small>多元观点，自由表达</small>
            </span>
          </div>
          <div class="value-item">
            <MessageCircle :size="22" />
            <span>
              <strong>温暖社区</strong>
              <small>友善氛围，互相理解</small>
            </span>
          </div>
          <div class="value-item">
            <Compass :size="22" />
            <span>
              <strong>探索自我</strong>
              <small>认识性格，发现可能</small>
            </span>
          </div>
        </div>

        <footer class="auth-footer">
          <span>© 2026 16Lab 社区</span>
          <span>关于我们</span>
          <span>帮助中心</span>
          <span>隐私政策</span>
        </footer>
      </section>

      <section class="auth-card" aria-label="登录注册表单">
        <div class="mobile-brand">
          <RouterLink to="/">
            <strong>16Lab</strong>
            <span>MBTI 社区</span>
          </RouterLink>
        </div>

        <div class="card-heading">
          <div>
            <p class="card-kicker">{{ mode === 'login' ? '欢迎回来' : '加入 16Lab' }}</p>
            <h2>{{ mode === 'login' ? '登录账号' : '创建账号' }}</h2>
          </div>
          <button class="link-button" type="button" @click="toggleMode">
            {{ mode === 'login' ? '新用户注册' : '已有账号登录' }}
          </button>
        </div>

        <div class="method-tabs" role="tablist" aria-label="登录注册方式">
          <button
            type="button"
            :class="{ active: method === 'password' }"
            role="tab"
            :aria-selected="method === 'password'"
            @click="method = 'password'"
          >
            账号密码
          </button>
          <button
            type="button"
            :class="{ active: method === 'email' }"
            role="tab"
            :aria-selected="method === 'email'"
            @click="method = 'email'"
          >
            邮箱验证
          </button>
        </div>

        <form class="auth-form" @submit.prevent="submit">
          <template v-if="method === 'password'">
            <label class="field">
              <span>{{ mode === 'login' ? '账号或邮箱' : '账号名' }}</span>
              <div class="field-control">
                <UserRound :size="18" />
                <input
                  v-model.trim="passwordForm.account"
                  :placeholder="mode === 'login' ? '请输入账号或邮箱' : '设置你的账号名'"
                  autocomplete="username"
                />
              </div>
            </label>

            <label class="field">
              <span>密码</span>
              <div class="field-control">
                <Lock :size="18" />
                <input
                  v-model="passwordForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请输入密码"
                  :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
                />
                <button class="icon-ghost" type="button" @click="showPassword = !showPassword">
                  <EyeOff v-if="showPassword" :size="18" />
                  <Eye v-else :size="18" />
                </button>
              </div>
            </label>

            <label v-if="mode === 'register'" class="field">
              <span>确认密码</span>
              <div class="field-control">
                <Lock :size="18" />
                <input
                  v-model="passwordForm.confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="再次输入密码"
                  autocomplete="new-password"
                />
              </div>
            </label>

            <div class="captcha-row">
              <label class="field">
                <span>图形验证码</span>
                <div class="field-control">
                  <CircleCheck :size="18" />
                  <input
                    v-model.trim="passwordForm.captchaCode"
                    placeholder="请输入图形验证码"
                    autocomplete="off"
                  />
                </div>
              </label>
              <button class="captcha-image" type="button" @click="loadCaptcha">
                <img v-if="captchaSrc" :src="captchaSrc" alt="验证码" />
                <span v-else>7G2K</span>
                <RefreshCw :size="16" />
              </button>
            </div>
          </template>

          <template v-else>
            <label class="field">
              <span>邮箱</span>
              <div class="field-control">
                <Mail :size="18" />
                <input
                  v-model.trim="emailForm.email"
                  placeholder="hello@16lab.cn"
                  autocomplete="email"
                />
              </div>
            </label>

            <div class="email-code-row">
              <label class="field">
                <span>邮箱验证码</span>
                <div class="field-control">
                  <CircleCheck :size="18" />
                  <input v-model.trim="emailForm.code" placeholder="请输入验证码" autocomplete="one-time-code" />
                </div>
              </label>
              <button class="send-code" type="button" :disabled="sendingCode || countdown > 0" @click="sendEmailCode">
                <LoaderCircle v-if="sendingCode" :size="16" class="spin" />
                <Send v-else :size="16" />
                {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
              </button>
            </div>

            <label v-if="mode === 'register'" class="field">
              <span>密码</span>
              <div class="field-control">
                <Lock :size="18" />
                <input
                  v-model="emailForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="设置登录密码"
                  autocomplete="new-password"
                />
                <button class="icon-ghost" type="button" @click="showPassword = !showPassword">
                  <EyeOff v-if="showPassword" :size="18" />
                  <Eye v-else :size="18" />
                </button>
              </div>
            </label>

            <label v-if="mode === 'register'" class="field">
              <span>确认密码</span>
              <div class="field-control">
                <Lock :size="18" />
                <input
                  v-model="emailForm.confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="再次输入密码"
                  autocomplete="new-password"
                />
              </div>
            </label>
          </template>

          <div v-if="mode === 'login'" class="form-options">
            <label class="remember">
              <input v-model="rememberMe" type="checkbox" />
              <span>记住我</span>
            </label>
            <button class="text-button" type="button">忘记密码？</button>
          </div>

          <p v-if="error" class="feedback error">
            <CircleAlert :size="17" />
            {{ error }}
          </p>
          <p v-else-if="notice" class="feedback success">
            <CircleCheck :size="17" />
            {{ notice }}
          </p>

          <button class="submit-button" type="submit" :disabled="submitting">
            <LoaderCircle v-if="submitting" :size="18" class="spin" />
            <span>{{ submitLabel }}</span>
          </button>
        </form>

        <div class="redirect-row">
          <span>登录后将跳转到：</span>
          <strong>{{ redirectLabel }}</strong>
          <ChevronDown :size="15" />
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Compass,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  MessageCircle,
  RefreshCw,
  Send,
  UserRound,
  UsersRound
} from 'lucide-vue-next'
import { authApi } from '../api'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const mode = ref(route.query.mode === 'register' ? 'register' : 'login')
const method = ref('password')
const showPassword = ref(false)
const rememberMe = ref(true)
const submitting = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)
const captcha = ref(null)
const error = ref('')
const notice = ref('')
let countdownTimer = null

const passwordForm = reactive({
  account: '',
  password: '',
  confirmPassword: '',
  captchaUuid: '',
  captchaCode: ''
})

const emailForm = reactive({
  email: '',
  code: '',
  password: '',
  confirmPassword: ''
})

const captchaSrc = computed(() => captcha.value?.imageBase64 || '')
const submitLabel = computed(() => {
  if (mode.value === 'login') return '登录'
  return method.value === 'password' ? '注册账号' : '邮箱注册'
})
const redirectLabel = computed(() => (route.query.redirect ? '上次访问页' : '首页'))

function resetState() {
  error.value = ''
  notice.value = ''
}

function syncModeQuery(nextMode) {
  const query = { ...route.query }
  if (nextMode === 'register') query.mode = 'register'
  else delete query.mode
  router.replace({ query })
}

function setMode(nextMode) {
  if (mode.value === nextMode) return
  mode.value = nextMode
  syncModeQuery(nextMode)
}

function toggleMode() {
  setMode(mode.value === 'login' ? 'register' : 'login')
}

function assertPasswordMatch(primary, confirm) {
  if (primary !== confirm) {
    throw new Error('两次输入的密码不一致')
  }
}

function startCountdown() {
  countdown.value = 50
  if (countdownTimer) window.clearInterval(countdownTimer)
  countdownTimer = window.setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      window.clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

async function loadCaptcha() {
  try {
    captcha.value = await authApi.captcha()
    passwordForm.captchaUuid = captcha.value.uuid
  } catch {
    captcha.value = null
    passwordForm.captchaUuid = ''
  }
}

async function sendEmailCode() {
  resetState()
  if (!emailForm.email) {
    error.value = '请先输入邮箱'
    return
  }
  sendingCode.value = true
  try {
    await authApi.sendEmailCode({
      email: emailForm.email,
      scene: mode.value
    })
    notice.value = `验证码已发送至 ${emailForm.email}`
    startCountdown()
  } catch (event) {
    error.value = event.message || '验证码发送失败，请稍后再试'
  } finally {
    sendingCode.value = false
  }
}

async function finishAuth(data) {
  if (data?.token) {
    auth.setSession(data)
    await router.push(route.query.redirect || '/')
    return
  }
  if (mode.value === 'register') {
    setMode('login')
    await nextTick()
    notice.value = '注册成功，现在可以登录了'
  }
}

async function submitPassword() {
  if (!passwordForm.account || !passwordForm.password) {
    throw new Error('请填写账号和密码')
  }
  const payload = {
    account: passwordForm.account,
    username: passwordForm.account,
    password: passwordForm.password,
    captchaUuid: passwordForm.captchaUuid,
    captchaCode: passwordForm.captchaCode
  }

  if (mode.value === 'login') {
    await auth.login(payload)
    await router.push(route.query.redirect || '/')
    return
  }

  assertPasswordMatch(passwordForm.password, passwordForm.confirmPassword)
  const data = await auth.registerByPassword({
    ...payload,
    confirmPassword: passwordForm.confirmPassword
  })
  await finishAuth(data)
}

async function submitEmail() {
  if (!emailForm.email || !emailForm.code) {
    throw new Error('请填写邮箱和验证码')
  }
  const payload = {
    email: emailForm.email,
    code: emailForm.code,
    emailCode: emailForm.code
  }

  if (mode.value === 'login') {
    await auth.emailLogin(payload)
    await router.push(route.query.redirect || '/')
    return
  }

  if (!emailForm.password) {
    throw new Error('请设置登录密码')
  }
  assertPasswordMatch(emailForm.password, emailForm.confirmPassword)
  const data = await auth.registerByEmail({
    ...payload,
    password: emailForm.password,
    confirmPassword: emailForm.confirmPassword
  })
  await finishAuth(data)
}

async function submit() {
  resetState()
  submitting.value = true
  try {
    if (method.value === 'password') {
      await submitPassword()
    } else {
      await submitEmail()
    }
  } catch (event) {
    error.value = event.message || '操作失败，请稍后再试'
    if (method.value === 'password') await loadCaptcha()
  } finally {
    submitting.value = false
  }
}

watch([mode, method], () => {
  resetState()
  showPassword.value = false
  if (method.value === 'password') loadCaptcha()
})

watch(
  () => route.query.mode,
  (value) => {
    const nextMode = value === 'register' ? 'register' : 'login'
    if (mode.value !== nextMode) mode.value = nextMode
  }
)

onMounted(loadCaptcha)

onBeforeUnmount(() => {
  if (countdownTimer) window.clearInterval(countdownTimer)
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  padding: 26px;
  color: #101936;
  background:
    radial-gradient(circle at 12% 18%, rgba(255, 255, 255, .96) 0 80px, transparent 82px),
    linear-gradient(145deg, #eaf7ff 0%, #f8fbff 48%, #eef4f8 100%);
  font-family: "Microsoft YaHei", "PingFang SC", "Segoe UI", sans-serif;
  overflow-x: hidden;
}

.auth-shell {
  min-height: calc(100vh - 52px);
  display: grid;
  grid-template-columns: minmax(520px, 1fr) minmax(420px, 520px);
  gap: 16px;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.brand-stage,
.auth-card {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid rgba(210, 224, 235, .86);
  border-radius: 14px;
  box-shadow: 0 24px 70px rgba(23, 39, 60, .12);
}

.brand-stage {
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  min-height: 720px;
  padding: 34px 36px 18px;
  background:
    linear-gradient(180deg, rgba(205, 237, 255, .78), rgba(247, 252, 255, .92) 72%),
    #d8f0ff;
}

.brand-lockup,
.mobile-brand a {
  display: inline-grid;
  gap: 2px;
  width: max-content;
}

.brand-name,
.mobile-brand strong {
  font-size: 31px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: 0;
  color: #111936;
}

.brand-subtitle,
.mobile-brand span {
  font-size: 14px;
  color: #56627a;
}

.hero-copy {
  align-self: center;
  max-width: 520px;
  z-index: 2;
}

.hero-kicker,
.card-kicker {
  margin: 0 0 12px;
  color: #ff5c4e;
  font-weight: 800;
}

.hero-copy h1 {
  margin: 0;
  font-size: clamp(34px, 4vw, 52px);
  line-height: 1.34;
  letter-spacing: 0;
}

.hero-copy p:last-child {
  max-width: 360px;
  margin: 22px 0 0;
  color: #6a7489;
  font-size: 16px;
  line-height: 1.75;
}

.coast-scene {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 86px;
  height: 330px;
  background:
    linear-gradient(180deg, transparent 0 45%, rgba(255, 255, 255, .54) 46% 48%, transparent 49%),
    linear-gradient(180deg, transparent 0 58%, rgba(255, 255, 255, .78) 58% 100%);
}

.sun {
  position: absolute;
  right: 24%;
  top: 34px;
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: rgba(255, 232, 171, .88);
  box-shadow: 0 0 80px rgba(255, 220, 142, .72);
}

.cloud,
.cloud::before,
.cloud::after {
  position: absolute;
  height: 34px;
  border-radius: 999px;
  background: rgba(255, 255, 255, .9);
}

.cloud {
  width: 112px;
}

.cloud::before,
.cloud::after {
  content: "";
  top: -18px;
}

.cloud::before {
  left: 18px;
  width: 48px;
}

.cloud::after {
  right: 12px;
  width: 62px;
}

.cloud-one {
  left: 6%;
  top: 24px;
}

.cloud-two {
  right: 9%;
  top: 118px;
  transform: scale(.78);
}

.bird {
  position: absolute;
  width: 24px;
  height: 12px;
  border-top: 2px solid rgba(64, 83, 108, .42);
  border-radius: 50%;
}

.bird::after {
  content: "";
  position: absolute;
  left: 12px;
  top: -2px;
  width: 24px;
  height: 12px;
  border-top: 2px solid rgba(64, 83, 108, .42);
  border-radius: 50%;
}

.bird-one {
  left: 48%;
  top: 36px;
}

.bird-two {
  left: 44%;
  top: 64px;
  transform: scale(.74);
}

.sea {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 92px;
  height: 116px;
  background:
    repeating-linear-gradient(175deg, rgba(255, 255, 255, .45) 0 2px, transparent 2px 34px),
    linear-gradient(180deg, rgba(116, 196, 224, .42), rgba(89, 169, 207, .35));
}

.cafe-sign {
  position: absolute;
  left: 32px;
  bottom: 134px;
  width: 92px;
  height: 54px;
  display: grid;
  place-items: center;
  border: 3px solid rgba(131, 101, 71, .4);
  border-radius: 8px;
  color: #60728e;
  background: rgba(255, 255, 255, .7);
  font-size: 22px;
  font-weight: 900;
  transform: rotate(-2deg);
}

.table {
  position: absolute;
  left: 18%;
  right: 16%;
  bottom: 58px;
  height: 54px;
  border-radius: 50% 50% 16px 16px;
  background: linear-gradient(180deg, #f6d5ba, #d79a78);
  box-shadow: 0 16px 0 rgba(115, 94, 80, .16);
}

.person {
  position: absolute;
  bottom: 93px;
  width: 82px;
  height: 118px;
  border-radius: 42px 42px 20px 20px;
}

.person::before {
  content: "";
  position: absolute;
  top: -34px;
  left: 23px;
  width: 36px;
  height: 40px;
  border-radius: 50%;
  background: #f1bb92;
  box-shadow: inset 0 8px 0 rgba(70, 47, 34, .34);
}

.person-left {
  left: 20%;
  background: linear-gradient(160deg, #68a5d8, #2e6d9d);
  transform: rotate(-5deg);
}

.person-mid {
  left: 40%;
  background: linear-gradient(160deg, #ffb38d, #ec7c63);
}

.person-right {
  left: 60%;
  background: linear-gradient(160deg, #8cab75, #4f7958);
  transform: rotate(5deg);
}

.chair {
  position: absolute;
  bottom: 36px;
  width: 74px;
  height: 92px;
  border: 5px solid rgba(134, 99, 75, .38);
  border-radius: 16px;
}

.chair-left {
  left: 13%;
  transform: rotate(-8deg);
}

.chair-right {
  right: 14%;
  transform: rotate(8deg);
}

.value-strip {
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  padding: 18px 8px 16px;
  border-top: 1px solid rgba(202, 214, 224, .65);
  background: rgba(255, 255, 255, .42);
  backdrop-filter: blur(8px);
}

.value-item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  color: #5e6b82;
}

.value-item svg {
  flex: 0 0 auto;
  color: #647796;
}

.value-item strong,
.value-item small {
  display: block;
}

.value-item strong {
  color: #26324d;
  font-size: 15px;
}

.value-item small {
  margin-top: 4px;
  font-size: 12px;
}

.auth-footer {
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 14px 2px 0;
  border-top: 1px solid rgba(210, 218, 228, .72);
  color: #8090a5;
  font-size: 12px;
}

.auth-card {
  align-self: stretch;
  width: 100%;
  box-sizing: border-box;
  max-width: 520px;
  margin: 0 auto;
  padding: 34px 46px;
  background: rgba(255, 255, 255, .92);
  backdrop-filter: blur(16px);
}

.mobile-brand {
  display: none;
}

.card-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 20px;
  margin-bottom: 26px;
}

.card-heading h2 {
  margin: 0;
  color: #111936;
  font-size: 26px;
  line-height: 1.2;
}

.link-button,
.text-button {
  border: 0;
  padding: 0;
  color: #ff5b4d;
  background: transparent;
  font-weight: 700;
  white-space: nowrap;
}

.method-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
  margin-bottom: 24px;
  border-bottom: 1px solid #e6ebf2;
}

.method-tabs button {
  min-height: 42px;
  border: 0;
  border-bottom: 2px solid transparent;
  color: #758097;
  background: transparent;
  font-weight: 800;
}

.method-tabs button.active {
  color: #141d38;
  border-color: #ff5b4d;
}

.auth-form {
  display: grid;
  gap: 16px;
}

.field {
  display: grid;
  gap: 8px;
}

.field > span {
  color: #5d677b;
  font-size: 13px;
}

.field-control {
  width: 100%;
  min-width: 0;
  min-height: 50px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 13px;
  border: 1px solid #d9e0ea;
  border-radius: 7px;
  color: #8a96aa;
  background: #fff;
  transition: border-color .18s ease, box-shadow .18s ease;
}

.field-control:focus-within {
  border-color: #ff8a7f;
  box-shadow: 0 0 0 4px rgba(255, 91, 77, .1);
}

.field-control input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: #15203a;
  background: transparent;
}

.field-control input::placeholder {
  color: #a4adbd;
}

.icon-ghost {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border: 0;
  border-radius: 50%;
  color: #8894a8;
  background: transparent;
}

.icon-ghost:hover {
  background: #f2f5f8;
}

.captcha-row,
.email-code-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 150px;
  gap: 10px;
  align-items: end;
}

.captcha-image,
.send-code {
  min-height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #d9e0ea;
  border-radius: 7px;
  background: #fff;
}

.captcha-image {
  align-self: end;
  overflow: hidden;
  color: #ff6e48;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 8px;
}

.captcha-image img {
  width: 98px;
  height: 48px;
  object-fit: cover;
}

.captcha-image svg {
  color: #8290a4;
}

.send-code {
  color: #fff;
  border: 0;
  background: linear-gradient(180deg, #ff7568, #ff5548);
  font-weight: 800;
}

.send-code:disabled,
.submit-button:disabled {
  cursor: wait;
  opacity: .72;
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #7a8497;
  font-size: 13px;
}

.remember {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.remember input {
  width: 15px;
  height: 15px;
  accent-color: #ff5b4d;
}

.feedback {
  min-height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 9px 11px;
  border-radius: 7px;
  font-size: 13px;
}

.feedback.error {
  color: #dd3e32;
  background: #fff0ee;
}

.feedback.success {
  color: #28745a;
  background: #edf8f3;
}

.submit-button {
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-radius: 7px;
  color: #fff;
  background: linear-gradient(180deg, #ff7466, #ff5548);
  box-shadow: 0 12px 24px rgba(255, 86, 72, .22);
  font-size: 16px;
  font-weight: 900;
}

.redirect-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid #edf0f4;
  color: #7c8799;
  font-size: 13px;
}

.redirect-row strong {
  color: #ff5b4d;
}

.spin {
  animation: spin .8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1080px) {
  .auth-shell {
    grid-template-columns: minmax(0, 1fr);
  }

  .auth-card {
    order: 1;
  }

  .brand-stage {
    order: 2;
    min-height: 420px;
  }

  .hero-copy {
    display: none;
  }

  .coast-scene {
    bottom: 92px;
  }
}

@media (max-width: 720px) {
  .auth-page {
    padding: 0;
    background: #f5f9fc;
  }

  .auth-shell {
    min-height: 100vh;
    gap: 0;
    width: 100%;
    max-width: 100%;
  }

  .auth-card,
  .brand-stage {
    width: 100%;
    min-width: 0;
    max-width: none;
    margin: 0;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }

  .auth-card {
    display: grid;
    justify-items: start;
    padding: 28px 24px 26px;
  }

  .mobile-brand,
  .card-heading,
  .method-tabs,
  .auth-form,
  .redirect-row {
    width: min(100%, 342px);
    max-width: calc(100vw - 48px);
  }

  .mobile-brand {
    display: block;
    margin-bottom: 26px;
  }

  .card-heading {
    margin-bottom: 20px;
  }

  .card-heading h2 {
    font-size: 22px;
  }

  .captcha-row,
  .email-code-row {
    grid-template-columns: 1fr;
  }

  .captcha-image,
  .send-code {
    width: 100%;
  }

  .brand-stage {
    min-height: 260px;
    padding: 0 24px 18px;
  }

  .brand-lockup,
  .value-strip,
  .auth-footer {
    display: none;
  }

  .coast-scene {
    bottom: 0;
    height: 250px;
  }

  .person {
    transform: scale(.82);
  }
}
</style>
