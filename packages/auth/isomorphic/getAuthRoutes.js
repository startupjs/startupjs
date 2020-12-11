export default (components = {}) => [
  {
    path: '/auth/sign-in',
    exact: true,
    component: components.PSignIn
  },
  {
    path: '/auth/sign-up',
    exact: true,
    component: components.PSignUp
  },
  {
    path: '/auth/recover',
    exact: true,
    component: components.PRecover
  },
  {
    path: '/auth/reset-password',
    exact: true,
    component: components.PResetPassword
  }
]
