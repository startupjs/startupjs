/* @asyncImports */
import { faSpellCheck } from '@fortawesome/free-solid-svg-icons/faSpellCheck'
import ArrayInputEn from '../components/forms/ArrayInput/ArrayInput.en.mdx'
import ArrayInputRu from '../components/forms/ArrayInput/ArrayInput.ru.mdx'
import CheckboxEn from '../components/forms/Checkbox/Checkbox.en.mdx'
import CheckboxRu from '../components/forms/Checkbox/Checkbox.ru.mdx'
import ColorPickerEn from '../components/forms/ColorPicker/ColorPicker.en.mdx'
import ColorPickerRu from '../components/forms/ColorPicker/ColorPicker.ru.mdx'
import DateTimePickerEn from '../components/forms/DateTimePicker/docs/DateTimePicker.en.mdx'
import DateTimePickerRu from '../components/forms/DateTimePicker/docs/DateTimePicker.ru.mdx'
import FormEn from '../components/forms/Form/Form.en.mdx'
import FormRu from '../components/forms/Form/Form.ru.mdx'
import InputEn from '../components/forms/Input/Input.en.mdx'
import InputRu from '../components/forms/Input/Input.ru.mdx'
import MultiselectEn from '../components/forms/Multiselect/Multiselect.en.mdx'
import MultiselectRu from '../components/forms/Multiselect/Multiselect.ru.mdx'
import NumberInputEn from '../components/forms/NumberInput/NumberInput.en.mdx'
import NumberInputRu from '../components/forms/NumberInput/NumberInput.ru.mdx'
import ObjectInputEn from '../components/forms/ObjectInput/ObjectInput.en.mdx'
import ObjectInputRu from '../components/forms/ObjectInput/ObjectInput.ru.mdx'
import PasswordInputEn from '../components/forms/PasswordInput/PasswordInput.en.mdx'
import PasswordInputRu from '../components/forms/PasswordInput/PasswordInput.ru.mdx'
import RadioEn from '../components/forms/Radio/Radio.en.mdx'
import RadioRu from '../components/forms/Radio/Radio.ru.mdx'
import RangeInputEn from '../components/forms/RangeInput/RangeInput.en.mdx'
import RangeInputRu from '../components/forms/RangeInput/RangeInput.ru.mdx'
import SelectEn from '../components/forms/Select/Select.en.mdx'
import SelectRu from '../components/forms/Select/Select.ru.mdx'
import TextInputEn from '../components/forms/TextInput/TextInput.en.mdx'
import TextInputRu from '../components/forms/TextInput/TextInput.ru.mdx'
import RankEn from '../components/forms/Rank/Rank.en.mdx'
import RankRu from '../components/forms/Rank/Rank.ru.mdx'

export default {
  type: 'collapse',
  title: {
    en: 'Forms',
    ru: 'Формы'
  },
  icon: faSpellCheck,
  items: {
    Input: {
      type: 'mdx',
      title: 'Input',
      component: {
        en: InputEn,
        ru: InputRu
      }
    },
    Form: {
      type: 'mdx',
      title: 'Form',
      component: {
        en: FormEn,
        ru: FormRu
      }
    },
    ObjectInput: {
      type: 'mdx',
      title: 'ObjectInput',
      component: {
        en: ObjectInputEn,
        ru: ObjectInputRu
      }
    },
    Array: {
      type: 'mdx',
      title: 'ArrayInput',
      component: {
        en: ArrayInputEn,
        ru: ArrayInputRu
      }
    },
    Checkbox: {
      type: 'mdx',
      title: 'Checkbox',
      component: {
        en: CheckboxEn,
        ru: CheckboxRu
      }
    },
    ColorPicker: {
      type: 'mdx',
      title: 'ColorPicker',
      component: {
        en: ColorPickerEn,
        ru: ColorPickerRu
      }
    },
    DateTimePicker: {
      type: 'mdx',
      title: 'DateTimePicker',
      component: {
        en: DateTimePickerEn,
        ru: DateTimePickerRu
      }
    },
    Multiselect: {
      type: 'mdx',
      title: 'Multiselect',
      component: {
        en: MultiselectEn,
        ru: MultiselectRu
      }
    },
    NumberInput: {
      type: 'mdx',
      title: 'NumberInput',
      component: {
        en: NumberInputEn,
        ru: NumberInputRu
      }
    },
    PasswordInput: {
      type: 'mdx',
      title: 'PasswordInput',
      component: {
        en: PasswordInputEn,
        ru: PasswordInputRu
      }
    },
    Rank: {
      type: 'mdx',
      title: 'Rank',
      component: {
        en: RankEn,
        ru: RankRu
      }
    },
    Radio: {
      type: 'mdx',
      title: 'Radio',
      component: {
        en: RadioEn,
        ru: RadioRu
      }
    },
    Select: {
      type: 'mdx',
      title: 'Select',
      component: {
        en: SelectEn,
        ru: SelectRu
      }
    },
    TextInput: {
      type: 'mdx',
      title: 'TextInput',
      component: {
        en: TextInputEn,
        ru: TextInputRu
      }
    },
    RangeInput: {
      type: 'mdx',
      title: 'RangeInput',
      component: {
        en: RangeInputEn,
        ru: RangeInputRu
      }
    }
  }
}
