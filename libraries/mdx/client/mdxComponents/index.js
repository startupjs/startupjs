import React, { useState, useContext } from 'react'
import { Image, ScrollView, Platform } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { pug, $root, observer, useValue } from 'startupjs'
import {
  Alert,
  Div,
  H2,
  H5,
  H6,
  Divider,
  Span,
  Br,
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
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import _kebabCase from 'lodash/kebabCase'
import _get from 'lodash/get'
import { BASE_URL } from '@env'
import './index.styl'
import Code from '../Code'

const RowComponent = props => pug`Div(...props row)`
const ALPHABET = 'abcdefghigklmnopqrstuvwxyz'
const ListLevelContext = React.createContext()
const BlockquoteContext = React.createContext()
const PreContext = React.createContext()

function getOrderedListMark (index, level) {
  switch (level) {
    case 1:
      return ALPHABET.charAt(index % ALPHABET.length) + ')'
    default:
      return '' + (index + 1) + '.'
  }
}

function P (props) {
  return pug`
    Span.p(style=props.style ...props)
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
      Component=RowComponent
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
    MDXAnchor.h3(anchor=getTextChildren(children) size='s')
      H6.h3-text(bold)= children
  `,
  h4: P,
  h5: P,
  h6: P,
  p: ({ children }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const inBlockquote = useContext(BlockquoteContext)

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
    P(bold)= children
  `,
  em: ({ children }) => pug`
    P(italic)= children
  `,
  hr: ({ children }) => pug`
    Divider(size='l')
  `,
  center: ({ children }) => {
    return pug`
      P.center= children
    `
  },
  br: Br,
  thematicBreak: P,
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
  ul: ({ children }) => children,
  ol: ({ children }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const currentLevel = useContext(ListLevelContext)
    const nextLevel = currentLevel == null ? 0 : currentLevel + 1
    const filteredChildren = React.Children
      .toArray(children)
      .filter(child => child !== '\n')
      .map((child, index) => React.cloneElement(child, { index }))
    return pug`
      ListLevelContext.Provider(value=nextLevel)
        Div
          = filteredChildren
    `
  },
  li: ({ children, index }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const level = useContext(ListLevelContext)
    const listIndex = index == null ? '•' : getOrderedListMark(index, level)
    let hasTextChild = false
    children = React.Children
      .toArray(children)
      .filter(child => child !== '\n')
      .map(child => {
        if (typeof child === 'string') {
          hasTextChild = true
        }
        return child
      })
    return pug`
      Div(row)
        Span.listIndex= listIndex
        Div.listContent
          if hasTextChild
            P(size='l')= children
          else
            = children
    `
  },
  blockquote: ({ children }) => {
    const filteredChildren = React.Children
      .toArray(children)
      .filter(child => child !== '\n')

    return pug`
      BlockquoteContext.Provider(value=true)
        Alert.alert= filteredChildren
    `
  },
  img: ({ src }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [style, setStyle] = useState({})
    const isUrl = /^(http|https):\/\//.test(src)
    const isLocalUrl = /^\//.test(src)

    if (isLocalUrl) {
      src = BASE_URL + src
    } else if (!isUrl) {
      console.warn('[@startupjs/mdx] Need to provide the url for the image')
      return null
    }

    function onLayout (e) {
      const maxWidth = e.nativeEvent.layout.width
      Image.getSize(src, (width, height) => {
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
      Div.img(onLayout=onLayout)
        Image(style=style source={ uri: src })
    `
  },
  section: ({ children, noscroll }) => {
    const Wrapper = noscroll
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
  pre: ({ children }) => {
    return pug`
      PreContext.Provider(value=true)
        = children
    `
  },
  code: observer(({ children, className, ...props }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isBlockCode = useContext(PreContext)

    if (!isBlockCode) {
      return pug`
        Span.inlineCodeWrapper
          Span.inlineCodeSpacer &#160;
          Span.inlineCode(style={
            fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace'
          })= children
          Span.inlineCodeSpacer &#160;
      `
    }

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

    let example

    if (typeof children === 'string' && children.includes('[HACK EXAMPLE CODE]')) {
      children = children.replace('[HACK EXAMPLE CODE]', '')
      example = true
    }

    return pug`
      Div.code(styleName={ 'code-example': example })
        if example
          Collapse.code-collapse(open=open variant='pure')
            Collapse.Header.code-collapse-header(icon=false onPress=null)
              Div.code-actions(align='right' row)
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
  })
}
