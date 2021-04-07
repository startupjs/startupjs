export default function (components = {}) {
  return [
    {
      path: '/internalization/:tab?',
      exact: true,
      component: components.PInternalization
    }
  ]
}
