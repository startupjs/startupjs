import filters from './filters'

export default (components = {}) => [
  {
    path: '/auth/sign-in',
    exact: true,
    component: components.PSignIn,
    filters: [filters.isNotLoggedIn()]
  },
  {
    path: '/auth/sign-up',
    exact: true,
    component: components.PSignUp,
    filters: [filters.isNotLoggedIn()]
  },
  {
    path: '/auth/recover',
    exact: true,
    component: components.PRecover,
    filters: [filters.isNotLoggedIn()]
  },
  {
    path: '/auth/reset-password',
    exact: true,
    component: components.PResetPassword,
    filters: [filters.isNotLoggedIn()]
  }
]
