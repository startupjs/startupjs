import MainLayout from './Layout'
import * as pages from './pages'

export default [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'games',
        component: pages.Games,
        meta: { isAuth: true }
      },
      {
        path: 'games/create',
        name: 'games-create',
        component: pages.GamesCreate,
        meta: { isAuth: true }
      },
      {
        path: 'game/:id',
        name: 'game',
        component: pages.Game,
        meta: { isAuth: true }
      }
    ]
  }
]
