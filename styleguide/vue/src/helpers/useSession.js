import { ref } from 'vue'
const session = ref(null)

export default function useSession () {
  return session
}
