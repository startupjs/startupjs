import AuthLayout from './Layout'
import * as pages from './pages'

export default [
  {
    path: '/sing-in',
    component: AuthLayout,
    children: [{ path: '', name: 'sign-in', component: pages.SignIn }]
  },
  {
    path: '/sing-out',
    component: AuthLayout,
    children: [{ path: '', name: 'sign-out', component: pages.SignOut }]
  }
]
