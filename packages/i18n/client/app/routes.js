export default function (components = {}) {
  return [
    {
      path: '/i18n',
      exact: true,
      component: components.PI18n,
      filters: [i18nPageAccess]
    }
  ]
}

function i18nPageAccess (model, next, redirect) {
  return model.scope('i18nTranslations').i18nPageAccess(model, next, redirect)
}
