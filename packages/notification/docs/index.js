import NotificationRu from './notification.ru.mdx'
import NotificationEn from './notification.ed.mdx'

export default {
  Notifications: {
    type: 'mdx',
    title: 'Notifications',
    component: {
      en: NotificationRu,
      ru: NotificationEn
    }
  }
}
