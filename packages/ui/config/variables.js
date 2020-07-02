// FIXME: Does not work on mobile devices
// const MEDIA = require('./../const/media')
// const media = {}
// for (const [resolution, value] of Object.entries(MEDIA)) {
//   media[resolution] = value + 'px'
// }

const media = {
  mobile: '480px', // DEPRECATED
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px'
}

const gutters = {
  xs: '0.5u',
  s: '1u',
  m: '2u',
  l: '3u',
  xl: '4u',
  xxl: '5u'
}

const fontFamily = 'Cochin'
const fontFamilies = {
  normal: fontFamily,
  heading: fontFamily
}

const fontSizes = {
  xs: '1.25u',
  s: '1.5u',
  m: '1.75u',
  l: '2u',
  xl: '2.5u',
  xxl: '3u',
  xxxl: '4.5u',
  xxxxl: '6u',
  xxxxxl: '9u'
}

const lineHeights = {
  xs: '1.75u',
  s: '2u',
  m: '2.5u',
  l: '3u',
  xl: '3.5u',
  xxl: '4u',
  xxxl: '6u',
  xxxxl: '8u',
  xxxxxl: '12u'
}

module.exports = { gutters, media, fontFamilies, fontSizes, lineHeights }
