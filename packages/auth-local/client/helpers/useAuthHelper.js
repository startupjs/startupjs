import { useState } from 'react'
import { BASE_URL } from '@env'
import AuthHelper from './AuthHelper'

function useAuthHelper (baseUrl = BASE_URL) {
  const [authHelper] = useState(new AuthHelper(baseUrl))
  return authHelper
}

export default useAuthHelper
