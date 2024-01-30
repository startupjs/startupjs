import React from 'react'
import { pug, useValue } from 'startupjs'

/*
  DragDropContext = {
    dropHoverId: string,
    dragHoverIndex: number,

    activeData: {
      type: string,
      dropId: string,
      dragId: string,
      dragStyle: {},
      startPosition: { x, y }
    },

    drops: {
      'e3657ce8-e716-4e2b-ab34-c8f7530ef159': {
        ref,
        items: ['8d736687-7c33-40d4-b361-0a890f8303e3'],
      },
      '04a44429-d819-4e5e-bb42-57e678c4b207': {
        ref,
        items: []
      },
    },

    drags: {
      '8d736687-7c33-40d4-b361-0a890f8303e3': {
        ref,
        style: {}
      }
    }
  }
*/

export const DragDropContext = React.createContext({})

export default function DragDropProvider ({ children }) {
  const [context, $context] = useValue({
    dropHoverId: '',
    dragHoverIndex: null,
    activeData: {},
    drops: {},
    drags: {}
  })

  return pug`
    DragDropContext.Provider(value=[context, $context])
      = children
  `
}
