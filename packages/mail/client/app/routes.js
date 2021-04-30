export default function (components = {}) {
  return [
    {
      path: '/mail/unsubscribe/:userId',
      exact: true,
      component: components.PUnsubscribe
    }
  ]
}
