import { defineStore } from 'pinia'
import { currentUser } from '../data/mockData'

const savedUser = localStorage.getItem('lab16_user')

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('lab16_token') || 'mock-token',
    user: savedUser ? JSON.parse(savedUser) : currentUser
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token),
    isAdmin: (state) => state.user?.role === 'ADMIN'
  },
  actions: {
    setSession(data = {}) {
      this.token = data.token || 'mock-token'
      this.user = { ...currentUser, ...data }
      localStorage.setItem('lab16_token', this.token)
      localStorage.setItem('lab16_user', JSON.stringify(this.user))
    },
    async login(payload = {}) {
      this.setSession({
        username: payload.account || payload.email || currentUser.username,
        nickname: payload.account || '小海盐'
      })
      return this.user
    },
    async emailLogin(payload = {}) {
      this.setSession({
        username: payload.email || currentUser.username,
        nickname: '邮箱用户'
      })
      return this.user
    },
    async registerByPassword(payload = {}) {
      this.setSession({
        username: payload.account || currentUser.username,
        nickname: payload.nickname || '新朋友'
      })
      return this.user
    },
    async registerByEmail(payload = {}) {
      this.setSession({
        username: payload.email || currentUser.username,
        nickname: payload.nickname || '新朋友'
      })
      return this.user
    },
    async refreshMe() {
      return this.user
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('lab16_token')
      localStorage.removeItem('lab16_user')
    },
    useMockAdmin() {
      this.setSession({
        ...currentUser,
        role: 'ADMIN',
        nickname: '内容管理员'
      })
    }
  }
})
