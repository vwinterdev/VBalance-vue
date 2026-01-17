import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import MultiGuard from 'vue-router-multiguard';
import { Routes } from '@/router/routes'
import { tokenService } from '@/modules/common/services/tokenService'

// Middleware для защиты auth страниц от авторизованных пользователей
const guestOnlyGuard = (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: (to?: RouteLocationNormalized | string | { name: string, replace: boolean }) => void,) => {
  if (tokenService.hasToken()) {
    return next({ ...Routes.TRANSACTIONS, replace: true })
  }
  return next();
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          ...Routes.HOME,
          component: () => import('@/modules/home/views/HomePage.vue'),
        },
        {
          ...Routes.TRANSACTIONS,
          component: () => import('@/modules/transactions/views/TransactionsPage.vue'),
        },
        {
          ...Routes.CREATE_TRANSACTION,
          component: () => import('@/modules/transactions/views/CreateTransactionPage.vue'),
        },
        {
          ...Routes.CATEGORIES,
          component: () => import('@/modules/categories/views/CategoriesPage.vue'),
        },
      ],
    },
    {
      ...Routes.AUTH,
      beforeEnter: MultiGuard([
        guestOnlyGuard,
      ]),
      component: () => import('@/modules/auth/layouts/AuthLayout.vue'),
      children: [
        {
          ...Routes.LOGIN,
          component: () => import('@/modules/auth/views/LoginPage.vue'),
        },
        {
          ...Routes.REGISTER,
          component: () => import('@/modules/auth/views/RegisterPage.vue'),
        },
        {
          ...Routes.EMAIL_VERIFICATION,
          component: () => import('@/modules/auth/views/EmailVerificationPage.vue'),
        },
      ],
    },
    {
      ...Routes.PROFILE,
      component: () => import('@/modules/profile/layouts/ProfileLayout.vue'),
      children: [
        {
          ...Routes.CREATE_PROFILE,
          component: () => import('@/modules/profile/views/CreateProfilePage.vue'),
        },
      ],
    },
  ],
})

export default router
