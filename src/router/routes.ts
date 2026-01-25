export const Routes = {
  HOME: {
    name: 'home',
    path: '/',
  },
  TRANSACTIONS: {
    name: 'transactions',
    path: '/transactions',
  },
  CREATE_TRANSACTION: {
    name: 'create-transaction',
    path: '/transactions/create',
  },
  AUTH: {
    path: '/auth',
  },
  LOGIN: {
    name: 'login',
    path: 'login',
  },
  REGISTER: {
    name: 'register',
    path: 'register',
  },
  EMAIL_VERIFICATION: {
    name: 'email-verification',
    path: 'email-verification',
  },
  PROFILE: {
    path: '/profile',
  },
  CREATE_PROFILE: {
    name: 'create-profile',
    path: 'create',
  },
  CATEGORIES: {
    name: 'categories',
    path: '/categories',
  },
  WALLET_DETAIL: {
    name: 'wallet-detail',
    path: '/wallet/:id',
  },
}
