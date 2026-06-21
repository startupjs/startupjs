import type { ReactNode } from 'react'
import type { CssxProviderStyleInput } from 'cssxjs'

export interface StartupjsProviderProps {
  children?: ReactNode
  style?: CssxProviderStyleInput
  plugins?: any
  onlyPlugins?: any
  [key: string]: any
}

export default function StartupjsProvider (props: StartupjsProviderProps): ReactNode
