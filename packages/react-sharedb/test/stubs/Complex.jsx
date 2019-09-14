import React from 'react'
import _ from 'lodash'

const ITEMS_AMOUNT = 4
const STORE = process.env.DEPRECATED ? 'scope' : 'store'

export default () =>
  class Complex extends React.Component {
    constructor (props) {
      super(props)
      this.renderCount = 0
    }

    render () {
      this.renderCount++
      if (typeof DEBUG !== 'undefined') {
        console.log(`RENDER ${this.renderCount}:`)
      }
      let itemEls = []
      for (let i = 0; i < ITEMS_AMOUNT; i++) {
        let items = this.props[STORE][`items${i}`]
        items = items || []
        if (!_.isArray(items)) items = [items]
        let names = items.map(i => i.name).join(',')
        if (typeof DEBUG !== 'undefined') console.log(`  ${i}: ${names}`)
        itemEls.push(
          <div className={`items${i}`} key={i}>
            {names}
          </div>
        )
      }
      return (
        <div className={`Complex RENDER-${this.renderCount}`}>{itemEls}</div>
      )
    }
  }
