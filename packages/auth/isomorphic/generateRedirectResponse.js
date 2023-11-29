import generateGoBackScript from './generateGoBackScript.js'

export default function generateRedirectResponse (text, delay, goBackCount) {
  if (typeof goBackCount !== 'number') {
    throw new Error('pagesCount must be a number')
  }
  if (typeof delay !== 'number') {
    throw new Error('delay must be a number')
  }
  return `
    <style>
      * {
        font-family: sans-serif;
      }
      body {
        text-align: center;
        padding-top: 100px;
      }
    </style>
    <p>${text}</p>
    <p>You will be redirected back in ${Math.floor(delay / 1000)} seconds.</p>
    ${generateGoBackScript(goBackCount)}
  `
}
