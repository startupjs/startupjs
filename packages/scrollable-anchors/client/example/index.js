import React, { useState } from 'react'
import { observer } from 'startupjs'
import { Span, Br, Div, H1, H3, H4, Divider, Row, Button } from '@startupjs/ui'
import { useHistory } from '@startupjs/app'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { ScrollableArea, Anchor } from '../components'
import { scrollTo } from '../helpers'
import './index.styl'

const ANCHORS = ['Top', '1', '2', '3', '4', '5', 'Bottom']
const NESTED_ANCHORS = ['Sec 1', 'Sec 2', 'Sec 3']
const ANOTHER_NESTED_ANCHORS = ['One', 'Two', 'Three', 'Four', 'Five']

const SCROLLABLE_AREA_ID = 'area-1'
const ANOTHER_AREA_ID = 'area-2'

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper risus in hendrerit gravida. Tortor posuere ac ut consequat semper viverra nam libero justo. Eget nullam non nisi est sit amet facilisis. Donec ultrices tincidunt arcu non sodales neque. Odio ut sem nulla pharetra diam sit amet nisl. Tellus molestie nunc non blandit massa enim nec dui nunc. Sed risus ultricies tristique nulla aliquet enim tortor at auctor. Est lorem ipsum dolor sit amet consectetur adipiscing. Sagittis nisl rhoncus mattis rhoncus urna. Massa placerat duis ultricies lacus sed turpis tincidunt id aliquet. Molestie at elementum eu facilisis. Arcu cursus euismod quis viverra nibh cras pulvinar mattis nunc.'

function Example () {
  const [extraContentVisibility, setExtraContentVisibility] = useState(false)
  const history = useHistory()

  function scrollToAnchor ({ anchorId, areaId, offset }) {
    scrollTo({ anchorId, areaId, offset })
  }

  return pug`
    Div.wrapper
      Button.backButton(
        icon=faArrowLeft
        size='m'
        variant='text'
        onPress=() => history.goBack()
      ) 
    Div.anchors
      Button.extraButton(
        onPress=()=> setExtraContentVisibility(!extraContentVisibility)
      )= extraContentVisibility ? 'Hide extra content' : 'Render extra content'
      Row
        each anchorId in ANCHORS
          Button.anchorBtn(
            key=anchorId
            size='s'
            variant='flat'
            onPress=()=> scrollToAnchor({ anchorId })
          )= anchorId

    Div.root
      Anchor(id=ANCHORS[0] Component=H1 bold)= ANCHORS[0]
      Span= LOREM
      Br
      Span(bold)= LOREM
      Br
      Br
      Anchor(id=ANCHORS[1])
        H3= ANCHORS[1]
      Br
      Divider
      Br
      Span= LOREM
      Br
      Br
      Div.myAnchors
        each anchorId in ANOTHER_NESTED_ANCHORS
          Button.anchorBtn(
            key=anchorId
            size='s'
            variant='flat'
            onPress=() => scrollToAnchor({ anchorId, areaId: ANOTHER_AREA_ID })
          )= anchorId
      Row
        Div.flex
          Span= LOREM
        Divider(variant='vertical')
        Div.flex
          ScrollableArea.anotherNestedArea(id=ANOTHER_AREA_ID)
            Anchor(id=ANOTHER_NESTED_ANCHORS[0])
              H4= ANOTHER_NESTED_ANCHORS[0]
              Span= LOREM.repeat(2)
            Br
            Anchor(id=ANOTHER_NESTED_ANCHORS[1])
              H4= ANOTHER_NESTED_ANCHORS[1]
              Span= LOREM
            Br
            Anchor(id=ANOTHER_NESTED_ANCHORS[2])
              H4= ANOTHER_NESTED_ANCHORS[2]
              Span= LOREM.repeat(4)
            Br
            Anchor(id=ANOTHER_NESTED_ANCHORS[3])
              H4= ANOTHER_NESTED_ANCHORS[3]
              Span= LOREM.repeat(2)
            Br
            Anchor(id=ANOTHER_NESTED_ANCHORS[4])
              H4= ANOTHER_NESTED_ANCHORS[4]
              Span= LOREM
      Br
      Br
      Anchor(id=ANCHORS[2])
        Div
          H3= ANCHORS[2]
          Span= LOREM
          Br
          Span= LOREM
      Br
      if extraContentVisibility
        H1 Extra content
        Span= LOREM
        Span= LOREM
        Span= LOREM
        Span= LOREM
        Span= LOREM
        Span= LOREM
        Span= LOREM
        Span= LOREM
      H3 Another scrollable area
      Div.myAnchors
        each anchorId in NESTED_ANCHORS
          Button.anchorBtn(
            key=anchorId
            size='s'
            variant='flat'
            onPress=() => scrollToAnchor({ anchorId, areaId: SCROLLABLE_AREA_ID, offset: 0 })
          )= anchorId
      ScrollableArea.myScrollableArea(id=SCROLLABLE_AREA_ID)
        Anchor(id=NESTED_ANCHORS[0])
          H4= NESTED_ANCHORS[0]
          Div
            Span= LOREM
            Divider
            Span= LOREM.repeat(2)
        Anchor(id=NESTED_ANCHORS[1])
          H4= NESTED_ANCHORS[1]
          Div
            Span= LOREM.repeat(3)
            Divider
            Span= LOREM
        Anchor(id=NESTED_ANCHORS[2])
          H4= NESTED_ANCHORS[2]
          Div
            Span= LOREM
            Divider
            Span= LOREM.repeat(4)
      Br
      Anchor(id=ANCHORS[3])
        H3= ANCHORS[3]
        Row
          Span= LOREM
          Divider(variant='vertical')
          Span= LOREM
      Br
      Br
      Anchor(id=ANCHORS[4])
        H3= ANCHORS[4]
        Div
          Span= LOREM.repeat(3)
      Br
      Br
      Anchor(id=ANCHORS[5])
        H3= ANCHORS[5]
        Div
          Span= LOREM.repeat(6)
          Br
          Divider
          Br
          Span= LOREM.repeat(2)
      Anchor(id=ANCHORS[6] Component=H1 bold)= ANCHORS[6]
  `
}

export default observer(Example)
