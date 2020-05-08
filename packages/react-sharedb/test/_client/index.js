// Make it behave like a browser to trick Racer
// https://github.com/derbyjs/racer/blob/master/lib/util.js#L3
process.title = 'browser'
require('./setupJsDom')
require('./setupRacerHighway')
const ws = require('ws')

global.WebSocket = ws
window.WebSocket = ws
