export default function generateGoBackScript (goBackCount, delay = 3000) {
  if (typeof goBackCount !== 'number') {
    throw new Error('pagesCount must be a number')
  }
  if (typeof delay !== 'number') {
    throw new Error('delay must be a number')
  }
  return `<script>setTimeout(function(){window.history.go(-${parseInt(goBackCount)})}, ${parseInt(delay)})</script>`
}
