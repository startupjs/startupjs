export default (components = {}) => [
  {
    path: '/',
    exact: true,
    redirect: '/auth/sign-in'
  },
  {
    path: '/profile',
    exact: true,
    component: components.PProfile
  }
]
