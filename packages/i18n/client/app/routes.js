export default function (components = {}) {
  return [
    {
      path: '/internationalization/:tab?',
      exact: true,
      component: components.PInternationalization
    }
  ]
}
