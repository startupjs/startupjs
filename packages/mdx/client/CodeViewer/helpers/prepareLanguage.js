const VALID_NAMES_LANGUAGES = {
  pug: 'jade',
  styl: 'stylus',
  stylus: 'stylus',
  js: 'javascript',
  jsx: 'javascript',
  javascript: 'javascript',
  '': 'text'
}

export default function prepareLanguage (lang) {
  return VALID_NAMES_LANGUAGES[lang]
}
