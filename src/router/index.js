import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import MainLayout from '../layouts/MainLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import HomeView from '../views/HomeView.vue'
import SquareView from '../views/SquareView.vue'
import CommunityView from '../views/CommunityView.vue'
import PostDetailView from '../views/PostDetailView.vue'
import CreatePostView from '../views/CreatePostView.vue'
import LoginView from '../views/LoginView.vue'
import UserProfileView from '../views/UserProfileView.vue'
import MbtiTestView from '../views/MbtiTestView.vue'
import PersonalitiesView from '../views/PersonalitiesView.vue'
import SearchView from '../views/SearchView.vue'
import NotificationsView from '../views/NotificationsView.vue'
import AiChatView from '../views/AiChatView.vue'
import AdminDashboardView from '../views/admin/AdminDashboardView.vue'
import AdminTableView from '../views/admin/AdminTableView.vue'

const routes = [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/search', name: 'search', component: SearchView },
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'square', name: 'community-square', component: SquareView },
      { path: 'communities/:id', name: 'community', component: CommunityView },
      { path: 'posts/:id', name: 'post-detail', component: PostDetailView },
      { path: 'create', name: 'create-post', component: CreatePostView, meta: { auth: true } },
      { path: 'users/:id', name: 'user-profile', component: UserProfileView },
      { path: 'mbti-test', name: 'mbti-test', component: MbtiTestView },
      { path: 'personalities', name: 'personalities', component: PersonalitiesView },
      { path: 'ai', name: 'ai-chat', component: AiChatView, meta: { auth: true } },
      { path: 'notifications', name: 'notifications', component: NotificationsView, meta: { auth: true } }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { auth: true, admin: true },
    children: [
      { path: '', name: 'admin-dashboard', component: AdminDashboardView },
      { path: ':resource', name: 'admin-table', component: AdminTableView }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.auth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.admin && !auth.isAdmin) {
    return { name: 'home' }
  }
  return true
})

export default router
