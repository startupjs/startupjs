import NotificationRu from './push-notifications.ru.mdx'
import NotificationEn from './push-notifications.en.mdx'

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
