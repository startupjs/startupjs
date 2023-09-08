import React, { useMemo, memo } from 'react'
import {
  MDXProvider as InternalMDXProvider,
  useMDXComponents
} from '@mdx-js/react'
import mdxComponents from '../mdxComponents'

export default memo(function MDXProvider ({
  components,
  ...props
}) {
  const _components = useMemo(() => {
    return {
      ...mdxComponents,
      ...components
    }
  }, [])

  return pug`
    InternalMDXProvider(
      ...props
      components=_components
    )
  `
})

export { useMDXComponents }
