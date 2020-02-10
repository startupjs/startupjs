import useLocalWithDefault from './useLocalWithDefault'
const PATH = '_session.Props.darkTheme'

export default function useDarkTheme () {
  return useLocalWithDefault(PATH, false)
}
