import type { ReactNode } from 'react'
import type { CssxProviderProps, CssxProviderStyleInput } from 'cssxjs'

export interface StartupjsProviderProps {
  children?: ReactNode
  style?: CssxProviderStyleInput
  theme?: CssxProviderProps['theme']
  plugins?: any
  onlyPlugins?: any
  [key: string]: any
}

export default function StartupjsProvider (props: StartupjsProviderProps): ReactNode
