/* @asyncImports */
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook'
import FoundationRu from './foundation.ru.mdx'
import FoundationEn from './foundation.en.mdx'
import BasicsRu from './basics.ru.mdx'
import BasicsEn from './basics.en.mdx'
import ObserverRu from './observer.ru.mdx'
import ObserverEn from './observer.en.mdx'
import ShareDBRu from './sharedbHooks.ru.mdx'
import ShareDBEn from './sharedbHooks.en.mdx'
import RacerModelRu from './racerModel.ru.mdx'
import RacerModelEn from './racerModel.en.mdx'
import FileStructureRu from './fileStructure.ru.mdx'
import FileStructureEn from './fileStructure.en.mdx'
import PugRu from './pug.ru.mdx'
import PugEn from './pug.en.mdx'
import StylusRu from './stylus.ru.mdx'
import StylusEn from './stylus.en.mdx'
import TricksWithStylesRu from './tricksWithStyles.ru.mdx'
import TricksWithStylesEn from './tricksWithStyles.en.mdx'

export default {
  type: 'collapse',
  title: {
    en: 'Tutorial',
    ru: 'Туториал'
  },
  icon: faBook,
  items: {
    Quickstart: {
      type: 'mdx',
      title: {
        en: 'Quickstart',
        ru: 'Что такое StartupJS'
      },
      component: {
        en: FoundationEn,
        ru: FoundationRu
      }
    },
    Basics: {
      type: 'mdx',
      title: {
        en: 'To-Do app',
        ru: 'To-Do приложение'
      },
      component: {
        en: BasicsEn,
        ru: BasicsRu
      }
    },
    Observer: {
      type: 'mdx',
      title: {
        en: 'Observer pattern',
        ru: 'Паттерн наблюдатель'
      },
      component: {
        en: ObserverEn,
        ru: ObserverRu
      }
    },
    ShareDBHooks: {
      type: 'mdx',
      title: {
        en: 'ShareDB Hooks',
        ru: 'ShareDB хуки'
      },
      component: {
        en: ShareDBEn,
        ru: ShareDBRu
      }
    },
    RacerModel: {
      type: 'mdx',
      title: {
        en: 'Racer’s Model',
        ru: 'Racer’s Model'
      },
      component: {
        en: RacerModelEn,
        ru: RacerModelRu
      }
    },
    FileStructure: {
      type: 'mdx',
      title: {
        en: 'File structure',
        ru: 'Файловая структура'
      },
      component: {
        en: FileStructureEn,
        ru: FileStructureRu
      }
    },
    Pug: {
      type: 'mdx',
      title: {
        en: 'Pug',
        ru: 'Pug'
      },
      component: {
        en: PugEn,
        ru: PugRu
      }
    },
    Stylus: {
      type: 'mdx',
      title: {
        en: 'Stylus',
        ru: 'Stylus'
      },
      component: {
        en: StylusEn,
        ru: StylusRu
      }
    },
    TricksWithStyles: {
      type: 'mdx',
      title: {
        en: 'Tricks with styles',
        ru: 'Работа со стилями'
      },
      component: {
        en: TricksWithStylesEn,
        ru: TricksWithStylesRu
      }
    }
  }
}
