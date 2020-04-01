// https://github.com/derbyjs/racer/blob/master/lib/util.js#L3
process.title = 'browser'

// Polyfill process.nextTick
process.nextTick = process.nextTick || setImmediate

export default () => {}
