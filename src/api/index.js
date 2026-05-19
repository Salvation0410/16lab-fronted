import http from './http'

export const authApi = {
  captcha: () => http.get('/auth/captcha'),
  passwordLogin: (data) => http.post('/auth/login/password', data),
  emailLogin: (data) => http.post('/auth/login/email', data),
  sendEmailCode: (data) => http.post('/auth/email-code', data),
  registerByPassword: (data) => http.post('/auth/register/password', data),
  registerByEmail: (data) => http.post('/auth/register/email', data),
  me: () => http.get('/auth/me'),
  setPassword: (data) => http.post('/auth/set-password', data)
}

export const communityApi = {
  list: (params) => http.get('/communities', { params }),
  detail: (id) => http.get(`/communities/${id}`),
  posts: (id, params) => http.get(`/communities/${id}/posts`, { params })
}

export const postApi = {
  hot: (params) => http.get('/posts/hot', { params }),
  following: (params) => http.get('/posts/following', { params }),
  byTag: (params) => http.get('/posts/by-tag', { params }),
  detail: (id) => http.get(`/posts/${id}`),
  create: (data) => http.post('/posts', data),
  update: (id, data) => http.put(`/posts/${id}`, data),
  view: (id) => http.post(`/posts/${id}/view`),
  remove: (id) => http.delete(`/posts/${id}`)
}

export const interactionApi = {
  likePost: (id) => http.post(`/posts/${id}/like`),
  likeComment: (id) => http.post(`/comments/${id}/like`),
  favorite: (id) => http.post(`/posts/${id}/favorite`),
  followUser: (id) => http.post(`/users/${id}/follow`),
  followCommunity: (id) => http.post(`/communities/${id}/follow`)
}

export const commentApi = {
  list: (postId, params) => http.get(`/posts/${postId}/comments`, { params }),
  create: (postId, data) => http.post(`/posts/${postId}/comments`, data),
  reply: (id, data) => http.post(`/comments/${id}/reply`, data),
  remove: (id) => http.delete(`/comments/${id}`)
}

export const userApi = {
  home: (id) => http.get(`/users/${id}`),
  history: (id) => http.get(`/users/${id}/mbti-history`),
  posts: (id, params) => http.get(`/users/${id}/posts`, { params }),
  favorites: (id, params) => http.get(`/users/${id}/favorites`, { params }),
  updateProfile: (data) => http.put('/profile', data),
  updateMbti: (data) => http.put('/profile/mbti', data)
}

export const mbtiApi = {
  questions: () => http.get('/mbti/questions'),
  submit: (data) => http.post('/mbti/submit', data),
  record: (id) => http.get(`/mbti/records/${id}`),
  save: (id) => http.post(`/mbti/records/${id}/save-to-profile`)
}

export const personalityApi = {
  list: () => http.get('/personalities'),
  detail: (code) => http.get(`/personalities/${code}`),
  variants: (code) => http.get(`/personalities/${code}/variants`),
  variant: (code, variant) => http.get(`/personalities/${code}/${variant}`)
}

export const searchApi = {
  all: (keyword) => http.get('/search', { params: { keyword } })
}

export const reportApi = {
  reasons: () => http.get('/reports/reasons'),
  create: (data) => http.post('/reports', data)
}

export const notificationApi = {
  list: (params) => http.get('/notifications', { params }),
  unreadCount: () => http.get('/notifications/unread-count'),
  read: (id) => http.put(`/notifications/${id}/read`),
  readAll: () => http.put('/notifications/read-all')
}

export const aiApi = {
  conversations: () => http.get('/ai/conversations'),
  createConversation: (data) => http.post('/ai/conversations', data),
  messages: (id) => http.get(`/ai/conversations/${id}/messages`),
  chat: (id, data) => http.post(`/ai/conversations/${id}/chat`, data)
}

export const adminApi = {
  users: (params) => http.get('/admin/users', { params }),
  banUser: (id) => http.put(`/admin/users/${id}/ban`),
  unbanUser: (id) => http.put(`/admin/users/${id}/unban`),
  posts: (params) => http.get('/admin/posts', { params }),
  versions: (id, params) => http.get(`/admin/posts/${id}/versions`, { params }),
  hidePost: (id) => http.put(`/admin/posts/${id}/hide`),
  restorePost: (id) => http.put(`/admin/posts/${id}/restore`),
  deletePost: (id) => http.delete(`/admin/posts/${id}`),
  pendingVersions: (params) => http.get('/admin/post-versions/pending', { params }),
  approveVersion: (id) => http.put(`/admin/post-versions/${id}/approve`),
  rejectVersion: (id, data) => http.put(`/admin/post-versions/${id}/reject`, data),
  comments: (params) => http.get('/admin/comments', { params }),
  deleteComment: (id) => http.delete(`/admin/comments/${id}`),
  reports: (params) => http.get('/admin/reports', { params }),
  processReport: (id, data) => http.put(`/admin/reports/${id}/process`, data),
  communities: (params) => http.get('/admin/communities', { params }),
  createCommunity: (data) => http.post('/admin/communities', data),
  updateCommunity: (id, data) => http.put(`/admin/communities/${id}`, data),
  tags: (params) => http.get('/admin/tags', { params }),
  createTag: (data) => http.post('/admin/tags', data),
  sensitiveWords: (params) => http.get('/admin/sensitive-words', { params }),
  createSensitiveWord: (data) => http.post('/admin/sensitive-words', data),
  notifications: (params) => http.get('/admin/notifications', { params }),
  sendNotification: (data) => http.post('/admin/notifications', data),
  broadcastNotification: (data) => http.post('/admin/notifications/broadcast', data),
  aiConversations: (params) => http.get('/admin/ai/conversations', { params }),
  statistics: () => http.get('/admin/dashboard/statistics')
}
