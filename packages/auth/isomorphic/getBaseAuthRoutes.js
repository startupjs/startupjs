export default (components = {}) => [
  {
    path: '/auth/sign-in',
    exact: true,
    component: components.PSignIn
  },
  {
    path: '/auth/success-auth',
    exact: true,
    component: components.PSuccessAuth
  }
]
