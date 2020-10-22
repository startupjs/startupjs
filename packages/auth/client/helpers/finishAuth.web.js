export default function finishAuth (redirectUrl) {
  window.location.href = redirectUrl || '/'
}