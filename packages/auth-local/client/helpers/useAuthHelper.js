import { useState } from 'react'
import AuthHelper from './AuthHelper'

function useAuthHelper () {
  const [authHelper] = useState(new AuthHelper())
  return authHelper
}

export default useAuthHelper
