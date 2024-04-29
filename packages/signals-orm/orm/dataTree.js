import { observable } from '@nx-js/observer-util'

export const dataTreeRaw = {}
const dataTree = observable(dataTreeRaw)

export function get (segments) {
  let dataNode = dataTree
  for (const segment of segments) {
    if (dataNode == null) return dataNode
    dataNode = dataNode[segment]
  }
  return dataNode
}

export function set (segments, value) {
  let dataNode = dataTree
  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i]
    if (dataNode[segment] == null) {
      // if next segment is a number, it means that we are in the array
      if (typeof segments[i + 1] === 'number') dataNode[segment] = []
      else dataNode[segment] = {}
    }
    dataNode = dataNode[segment]
  }
  dataNode[segments[segments.length - 1]] = value
}

export function del (segments) {
  let dataNode = dataTree
  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i]
    if (dataNode[segment] == null) return
    dataNode = dataNode[segment]
  }
  delete dataNode[segments[segments.length - 1]]
}

export default dataTree
