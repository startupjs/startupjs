import PropTypes from 'prop-types'
export * from 'react-native-web/dist/cjs'
// eslint-disable-next-line camelcase
export { default, unstable_createElement as createElement } from 'react-native-web/dist/cjs'

// Provide mock for libraries which are still using deprecated ViewPropTypes
export const ViewPropTypes = { style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]) }
