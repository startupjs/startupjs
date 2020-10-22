import React, { useState, useEffect } from 'react'
import AuthHelper from './AuthHelper'

function useAuthHelper () {
  const [authHelper, setAuthHelper] = useState()
  useEffect(() => {
    setAuthHelper(new AuthHelper())
  }, [])
  return authHelper
}

export default useAuthHelper