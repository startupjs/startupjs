import { useSessionUI, getSessionUI } from './../../helpers'

const PATH = 'toasts'

export function useToasts () {
  const [toasts = [], $toasts] = useSessionUI(PATH)
  return [toasts, $toasts]
}

export function getToastsModel () {
  return getSessionUI(PATH)
}
