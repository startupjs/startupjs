// isForwardRef from 'react-is' does not correctly detect memo(forwardRef)
// and even forwardRef itself in some cases.
// This implementation follows the same logic as the original type checking
// from react-is, but accounts for more cases of detecting specifically
// whether the forwardRef was used.
// It also does not depend on the 'react-is' matching the 'react' version
// used in the project
import { forwardRef } from 'react'

const forwardRefType = forwardRef(() => null).$$typeof // eslint-disable-line react/display-name

export default function isForwardRef (Component) {
  if (!forwardRefType) {
    console.error(`
      ERROR!!! [Input] isForwardRef check is no longer working with the current version of React.
      Please update startupjs to the latest version to use it with latest React.

      Inputs will NOT work correctly!
    `)
    return false
  }
  if (Component.$$typeof === forwardRefType) return true
  if (Component.type?.$$typeof === forwardRefType) return true
  return false
}
