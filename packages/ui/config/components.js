import Button from './../components/Button/config.cjs'
import Div from './../components/Div/config.cjs'
import Divider from './../components/Divider/config.cjs'
import Layout from './../components/Layout/config.cjs'
import Progress from './../components/Progress/config.cjs'
import Span from './../components/typography/Span/config.cjs'
import TextInput from './../components/forms/TextInput/config.cjs'

export default function (config) {
  return {
    Button: Button(config),
    Div: Div(config),
    Divider: Divider(config),
    Layout: Layout(config),
    Progress: Progress(config),
    Span: Span(config),
    TextInput: TextInput(config)
  }
}
