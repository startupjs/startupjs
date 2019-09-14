import richText from 'rich-text'

export default ShareDB => {
  // Register rich-text type in ShareDB
  ShareDB.types.register(richText.type)
}
