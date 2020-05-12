import useMeta from './useMeta'

export default function useNow () {
  return useMeta().createdAt
}
