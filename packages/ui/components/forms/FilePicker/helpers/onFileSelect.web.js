export default function onFileSelect ({
  accept,
  multiple,
  onSelectFiles
}) {
  const input = document.createElement('input')
  input.style = 'display: none;'
  input.type = 'file'
  input.accept = accept
  input.multiple = multiple

  document.documentElement.append(input)
  document.body.addEventListener('focus', clearInput)

  input.addEventListener('change', event => onChangeFile(event, { onSelectFiles }))
  input.click()

  function clearInput () {
    input.remove()
    document.body.removeEventListener('focus', clearInput)
  }
}

async function onChangeFile (event, { onSelectFiles }) {
  const files = event.target.files
  onSelectFiles && onSelectFiles(files)
}
