import NotificationRu from './notification.ru.mdx'
import NotificationEn from './notification.en.mdx'

export default {
  Notifications: {
    type: 'mdx',
    title: {
      en: 'Notifications',
      ru: 'Нотификации'
    },
    component: {
      en: NotificationEn,
      ru: NotificationRu
    }
  }
}
