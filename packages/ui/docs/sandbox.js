export default {
  type: 'collapse',
  title: {
    en: 'Sandbox',
    ru: 'Песочница'
  },
  items: {
    Alert: {
      type: 'sandbox',
      title: 'Alert',
      component: require('./../components/Alert').default
    },
    Avatar: {
      type: 'sandbox',
      title: 'Avatar',
      component: require('./../components/Avatar').default
    },
    Br: {
      type: 'sandbox',
      title: 'Br',
      component: require('./../components/Br').default
    },
    Breadcrumbs: {
      type: 'sandbox',
      title: 'Breadcrumbs',
      component: require('./../components/Breadcrumbs').default
    },
    Button: {
      type: 'sandbox',
      title: 'Button',
      component: require('./../components/Button').default
    },
    Card: {
      type: 'sandbox',
      title: 'Card',
      component: require('./../components/Card').default
    },
    Collapse: {
      type: 'collapse',
      title: 'Collapse',
      component: require('./../components/Collapse').default,
      items: {
        CollapseHeader: {
          type: 'sandbox',
          title: 'Header',
          component: require('./../components/Collapse/CollapseHeader').default
        },
        CollapseContent: {
          type: 'sandbox',
          title: 'Content',
          component: require('./../components/Collapse/CollapseContent').default
        }
      }
    },
    Content: {
      type: 'sandbox',
      title: 'Content',
      component: require('./../components/Content').default
    },
    Div: {
      type: 'sandbox',
      title: 'Div',
      component: require('./../components/Div').default
    },
    DrawerSidebar: {
      type: 'sandbox',
      title: 'Drawer Sidebar',
      component: require('./../components/DrawerSidebar').default
    },
    Forms: {
      type: 'collapse',
      title: 'Forms',
      items: {
        Checkbox: {
          type: 'sandbox',
          title: 'Checkbox',
          component: require('./../components/forms/Checkbox').default
        },
        Input: {
          type: 'sandbox',
          title: 'Input',
          component: require('./../components/forms/Input').default
        },
        ObjectInput: {
          type: 'sandbox',
          title: 'ObjectInput',
          component: require('./../components/forms/ObjectInput').default
        },
        Radio: {
          type: 'sandbox',
          title: 'Radio',
          component: require('./../components/forms/Radio').default
        },
        TextInput: {
          type: 'sandbox',
          title: 'TextInput',
          component: require('./../components/forms/TextInput').default
        }
      }
    },
    Hr: {
      type: 'sandbox',
      title: 'Hr',
      component: require('./../components/Hr').default
    },
    Icon: {
      type: 'sandbox',
      title: 'Icon',
      component: require('./../components/Icon').default
    },
    Layout: {
      type: 'sandbox',
      title: 'Layout',
      component: require('./../components/Layout').default
    },
    LineSeparator: {
      type: 'sandbox',
      title: 'Line Separator',
      component: require('./../components/LineSeparator').default
    },
    Link: {
      type: 'sandbox',
      title: 'Link',
      component: require('./../components/Link').default
    },
    Loader: {
      type: 'sandbox',
      title: 'Loader',
      component: require('./../components/Loader').default
    },
    Menu: {
      type: 'collapse',
      title: 'Menu',
      component: require('./../components/Menu').default,
      items: {
        MenuItem: {
          type: 'sandbox',
          title: 'Item',
          component: require('./../components/Menu/MenuItem').default
        }
      }
    },
    Modal: {
      type: 'collapse',
      title: 'Modal',
      component: require('./../components/Modal').default,
      items: {
        ModalHeader: {
          type: 'sandbox',
          title: 'Header',
          component: require('./../components/Modal/ModalHeader').default
        },
        ModalContent: {
          type: 'sandbox',
          title: 'Content',
          component: require('./../components/Modal/ModalContent').default
        },
        ModalActions: {
          type: 'sandbox',
          title: 'Actions',
          component: require('./../components/Modal/ModalActions').default
        }
      }
    },
    Pagination: {
      type: 'sandbox',
      title: 'Pagination',
      component: require('./../components/Pagination').default
    },
    Progress: {
      type: 'sandbox',
      title: 'Progress',
      component: require('./../components/Progress').default
    },
    Rating: {
      type: 'sandbox',
      title: 'Rating',
      component: require('./../components/Rating').default
    },
    Row: {
      type: 'sandbox',
      title: 'Row',
      component: require('./../components/Row').default
    },
    Sidebar: {
      type: 'sandbox',
      title: 'Sidebar',
      component: require('./../components/Sidebar').default
    },
    SmartSidebar: {
      type: 'sandbox',
      title: 'Smart Sidebar',
      component: require('./../components/SmartSidebar').default
    },
    StatusBar: {
      type: 'sandbox',
      title: 'Status Bar',
      component: require('./../components/StatusBar').default
    },
    Tag: {
      type: 'sandbox',
      title: 'Tag',
      component: require('./../components/Tag').default
    },
    Typography: {
      type: 'sandbox',
      title: 'Typography',
      component: require('./../components/Typography').default
    },
    ThemeProvider: {
      type: 'sandbox',
      title: 'ThemeProvider',
      component: require('./../config/themed').default
    }
  }
}
