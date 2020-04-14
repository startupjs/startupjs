import useLocalWithDefault from './useLocalWithDefault'
const PATH = '_session.Props.showSizes'

export default function useShowSizes () {
  return useLocalWithDefault(PATH, true)
}
