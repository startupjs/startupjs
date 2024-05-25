import useLocalWithDefault from './useLocalWithDefault'
const PATH = '_session.Props.validateWidth'

export default function useValidateWidth () {
  return useLocalWithDefault(PATH, false)
}
