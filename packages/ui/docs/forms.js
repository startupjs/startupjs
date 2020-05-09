export default {
  type: 'collapse',
  title: {
    en: 'Forms',
    ru: 'Формы'
  },
  items: {
    Checkbox: {
      type: 'mdx',
      title: 'Checkbox',
      component: require('../components/forms/Checkbox/Checkbox.en.mdx').default
    },
    Input: {
      type: 'mdx',
      title: 'Input',
      component: require('../components/forms/Input/Input.en.mdx').default
    },
    ObjectInput: {
      type: 'mdx',
      title: 'ObjectInput',
      component: require('../components/forms/ObjectInput/ObjectInput.en.mdx').default
    },
    Radio: {
      type: 'mdx',
      title: 'Radio',
      component: require('../components/forms/Radio/Radio.en.mdx').default
    },
    TextInput: {
      type: 'mdx',
      title: 'TextInput',
      component: require('../components/forms/TextInput/TextInput.en.mdx').default
    }
  }
}
