// import React, { useState } from 'react'
// import { observer } from 'startupjs'
// import { faAngleDown, faAngleUp, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
// import Button from '../../Button'
// import Div from '../../Div'
// import themed from '../../../theming/themed'
// import './index.styl'
//
// function NumberInputWrapper ({
//   style,
//   buttonStyle,
//   children,
//   size,
//   disabled
// }) {
//   const [active, setActive] = useState()
//
//   const increaseValue = () => {
//     const currentValue = stringValue || 0
//     const num = ((currentValue * coefficient + validStep * coefficient) / coefficient).toFixed(stepCount)
//     const validNum = Math.min(num, validMax)
//     setStringValue(validNum.toString())
//     onChangeNumber && onChangeNumber(validNum)
//   }
//
//   const decreaseValue = () => {
//     const currentValue = stringValue || 0
//     const num = ((currentValue * coefficient - validStep * coefficient) / coefficient).toFixed(stepCount)
//     const validNum = Math.max(num, validMin)
//     setStringValue(validNum.toString())
//     onChangeNumber && onChangeNumber(validNum)
//   }
//
//   return pug`
//     Div(style=style)
//       = children
//       if buttons !== 'none' && !readonly
//         Button.input-button.up(
//           styleName=[...styleNames]
//           style=buttonStyle
//           accessible=false
//           color= active === 'up' ? 'primary' : 'darkLight'
//           disabled=disabled
//           icon= buttons === 'horizontal' ? faPlus : faAngleUp
//           size=size
//           variant='outlined'
//           onPress=increaseValue
//           onPressIn= () => setActive('up')
//           onPressOut= () => setActive()
//           onMouseEnter= () => setActive('up')
//           onMouseLeave= () => setActive()
//         )
//         Button.input-button.down(
//           styleName=[...styleNames]
//           style=buttonStyle
//           accessible=false
//           color= active === 'down' ? 'primary' : 'darkLight'
//           disabled=disabled
//           icon= buttons === 'horizontal' ? faMinus : faAngleDown
//           size=size
//           variant='outlined'
//           onPress=decreaseValue
//           onPressIn= () => setActive('down')
//           onPressOut= () => setActive()
//           onMouseEnter= () => setActive('down')
//           onMouseLeave= () => setActive()
//         )
//   `
// }
//
// export default observer(themed('NumberInput', NumberInputWrapper))
