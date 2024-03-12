import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import KakaoCallbakcView from '../views/KakaoCallbackView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    { path: '/login', name: 'login', component: AuthView, meta: { requiresAuth: true } },
    {
      path: '/kakao/callback',
      name: 'kakao',
      component: KakaoCallbakcView,
      meta: { requiresAuth: true }
    }
  ]
})

export default router
