import EventEmitter from 'eventemitter3'

EventEmitter.prototype.setMaxListeners = EventEmitter.prototype.setMaxListeners || function () {}

export default EventEmitter
export { EventEmitter }
