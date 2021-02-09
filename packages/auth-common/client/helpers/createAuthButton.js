import React from 'react'
import { AuthButton } from '../components'

export default function createAuthButton (props) {
  return ({ baseUrl, redirectUrl }) => (
    <AuthButton
      baseUrl={baseUrl}
      redirectUrl={redirectUrl}
      {...props}
    />
  )
}
