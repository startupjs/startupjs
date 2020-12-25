export default function generateGoBackScript (pagesCount, delay = 3000) {
  if (typeof pagesCount !== 'number') {
    throw new Error('pagesCount must be a number')
  }
  if (typeof delay !== 'number') {
    throw new Error('delay must be a number')
  }
  return `<script>setTimeout(function(){window.history.go(-${parseInt(pagesCount)})}, ${parseInt(delay)})</script>`
}
