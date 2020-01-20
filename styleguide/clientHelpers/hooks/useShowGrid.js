import useLocalWithDefault from './useLocalWithDefault'
const PATH = '_session.Props.showGrid'

export default function useShowGrid () {
  return useLocalWithDefault(PATH, false)
}
