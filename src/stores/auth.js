import { defineStore } from 'pinia'
import { authApi } from '../api'

const savedUser = localStorage.getItem('lab16_user')

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('lab16_token') || '',
    user: savedUser ? JSON.parse(savedUser) : null
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token),
    isAdmin: (state) => state.user?.role === 'ADMIN'
  },
  actions: {
    setSession(data) {
      this.token = data.token
      this.user = data
      localStorage.setItem('lab16_token', data.token)
      localStorage.setItem('lab16_user', JSON.stringify(data))
    },
    async login(payload) {
      const data = await authApi.passwordLogin(payload)
      this.setSession(data)
      return data
    },
    async emailLogin(payload) {
      const data = await authApi.emailLogin(payload)
      this.setSession(data)
      return data
    },
    async registerByPassword(payload) {
      const data = await authApi.registerByPassword(payload)
      if (data?.token) this.setSession(data)
      return data
    },
    async registerByEmail(payload) {
      const data = await authApi.registerByEmail(payload)
      if (data?.token) this.setSession(data)
      return data
    },
    async refreshMe() {
      if (!this.token) return null
      const data = await authApi.me()
      this.user = { ...this.user, ...data }
      localStorage.setItem('lab16_user', JSON.stringify(this.user))
      return data
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('lab16_token')
      localStorage.removeItem('lab16_user')
    }
  }
})
