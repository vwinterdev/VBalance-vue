import { createRouter, createWebHistory } from 'vue-router';

import { Routes } from '@/router/routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    {
      ...Routes.AUTH,
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
});



export default router;

