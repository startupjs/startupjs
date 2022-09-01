import React, { useState, useContext } from 'react'
import { Image, Platform, ScrollView } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { $root, observer, useValue } from 'startupjs'
import {
  Alert,
  Div,
  H2,
  H5,
  H6,
  Divider,
  Span,
  Br,
  Row,
  Link,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Collapse
} from '@startupjs/ui'
import { Anchor, scrollTo } from '@startupjs/scrollable-anchors'
import { faLink, faCode, faCopy } from '@fortawesome/free-solid-svg-icons'
import _kebabCase from 'lodash/kebabCase'
import _get from 'lodash/get'
import { BASE_URL } from '@env'
import './index.styl'
import Code from '../Code'

const ALPHABET = 'abcdefghigklmnopqrstuvwxyz'
const ListLevelContext = React.createContext()
const BlockquoteContext = React.createContext()

function getOrderedListMark (index, level) {
  switch (level) {
    case 1:
      return ALPHABET.charAt(index % ALPHABET.length) + ')'
    default:
      return '' + (index + 1) + '.'
  }
}

function P ({ style, children }) {
  return pug`
    Span.p(style=style)= children
  `
}

function getTextChildren (children) {
  const nestedChildren = _get(children, 'props.children')
  if (nestedChildren) {
    return getTextChildren(nestedChildren)
  }

  return children
}

function MDXAnchor ({
  children,
  style,
  anchor,
  size
}) {
  const [hover, setHover] = useState()
  const anchorKebab = _kebabCase(anchor)

  return pug`
    Anchor.anchor(
      style=style
      id=anchorKebab
      Component=Row
      vAlign='center'
      onMouseEnter=() => setHover(true)
      onMouseLeave=() => setHover()
    )
      = children
      Link.anchor-link(
        styleName={ hover }
        to='#' + anchorKebab
      )
        Icon(icon=faLink size=size)
  `
}

export default {
  wrapper: ({ children }) => pug`
    Div= children
  `,
  section: ({ children, ...props }) => {
    const Wrapper = props.noscroll
      ? ({ children }) => pug`
        Div.example.padding= children
      `
      : ({ children }) => pug`
        ScrollView.example(
          contentContainerStyleName=['exampleContent', 'padding']
          horizontal
        )= children
      `
    return pug`
      Wrapper= children
    `
  },
  h1: ({ children }) => pug`
    MDXAnchor(anchor=getTextChildren(children) size='xl')
      H2(bold)
        = children
  `,
  h2: ({ children }) => pug`
    MDXAnchor.h2(anchor=getTextChildren(children))
      H5.h2-text= children
    Div.divider
  `,
  h3: ({ children }) => pug`
    MDXAnchor.h6(anchor=getTextChildren(children) size='s')
      H6(bold)= children
  `,
  p: ({ children }) => {
    const inBlockquote = useContext(BlockquoteContext)
    // TODO: HACK: Image does not work as need in Text on Android and IOS.
    // Check after the release of react-native v0.64 with this commit
    // https://github.com/facebook/react-native/commit/a0268a7bfc8000b5297d2b50f81e000d1f479c76
    if (children?.props?.mdxType === 'img') return children
    if (inBlockquote) {
      return pug`
        Span.blockquoteP= children
      `
    }
    return pug`
      P= children
    `
  },
  strong: ({ children }) => pug`
    Span.p(bold)= children
  `,
  em: ({ children }) => pug`
    Span.p(italic)= children
  `,
  pre: ({ children }) => children,
  code: observer(({ children, className, example }) => {
    const language = (className || 'language-txt').replace(/language-/, '')
    const [open, setOpen] = useState(false)
    const [copyText, $copyText] = useValue('Copy code')

    function copyHandler () {
      Clipboard.setString(children)
      $copyText.set('Copied')
    }

    function onMouseEnter () {
      // we need to reutrn default text if it was copied
      $copyText.setDiff('Copy code')
    }

    return pug`
      Div.code(styleName={ 'code-example': example })
        if example
          Collapse.code-collapse(open=open variant='pure')
            Collapse.Header.code-collapse-header(icon=false onPress=null)
              Row.code-actions(align='right')
                Div.code-action(
                  tooltip=open ? 'Hide code' : 'Show code'
                  onPress=()=> setOpen(!open)
                )
                  Icon.code-action-collapse(icon=faCode color='error')
                Div.code-action(
                  tooltip=copyText
                  onPress=copyHandler
                  onMouseEnter=onMouseEnter
                )
                  Icon.code-action-copy(icon=faCopy)
            Collapse.Content.code-collapse-content
              Code(language=language)= children
        else
          Code(language=language)= children
    `
  }),
  inlineCode: ({ children }) => pug`
    Span.inlineCodeWrapper
      Span.inlineCodeSpacer &#160;
      Span.inlineCode(style={
        fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace'
      })= children
      Span.inlineCodeSpacer &#160;
  `,
  hr: ({ children }) => pug`
    Divider(size='l')
  `,
  // TODO: https://mdxjs.com/getting-started#table-of-components
  //       Mock everything as P for now.
  h4: P,
  h5: P,
  h6: P,
  center: ({ children }) => {
    return pug`
      P.center= children
    `
  },
  br: Br,
  thematicBreak: P,
  blockquote: ({ children }) => {
    return pug`
      BlockquoteContext.Provider(value=true)
        Alert.alert= children
    `
  },
  ul: ({ children }) => children,
  ol: ({ children }) => {
    const currentLevel = useContext(ListLevelContext)
    const nextLevel = currentLevel == null ? 0 : currentLevel + 1
    return pug`
      ListLevelContext.Provider(value=nextLevel)
        = React.Children.map(children, (child, index) => React.cloneElement(child, { index }))
    `
  },
  li: ({ children, index }) => {
    const level = useContext(ListLevelContext)
    let hasTextChild = false
    children = React.Children.map(children, child => {
      if (typeof child === 'string') {
        hasTextChild = true
      }
      return child
    })
    return pug`
      Row
        Span.listIndex= index == null ? '•' : getOrderedListMark(index, level)
        Div.listContent
          if hasTextChild
            P(size='l')= children
          else
            = children
    `
  },
  table: ({ children }) => {
    return pug`
      Table(style={ marginTop: 16 })= children
    `
  },
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  td: Td,
  th: Th,
  delete: P,
  a: ({ children, href }) => {
    function onPress (event) {
      const { url, hash } = $root.get('$render')
      const [_url, _hash] = href.split('#')
      if (url === _url && hash === `#${_hash}`) {
        event.preventDefault()
        scrollTo({ anchorId: _hash })
      }
    }

    return pug`
      Link.link(
        to=href
        size='l'
        color='primary'
        onPress=onPress
      )= children
    `
  },
  img: ({ src }) => {
    let _src = src
    const [style, setStyle] = useState({})

    const isUrl = /^(http|https):\/\//.test(_src)
    const isLocalUrl = /^\//.test(_src)

    if (isLocalUrl) {
      _src = BASE_URL + _src
    } else if (!isUrl) {
      console.warn('[@startupjs/mdx] Need to provide the url for the image')
      return null
    }

    function onLayout (e) {
      const maxWidth = e.nativeEvent.layout.width
      Image.getSize(_src, (width, height) => {
        const coefficient = maxWidth / width
        setStyle({
          width: Math.min(width, maxWidth),
          height: coefficient < 1 ? Math.ceil(height * coefficient) : height
        })
      },
      error => console.warn(`[@startupjs/mdx], ${error}`)
      )
    }

    return pug`
      Row.p(onLayout=onLayout)
        Image(style=style source={ uri: _src })
    `
  }
}
