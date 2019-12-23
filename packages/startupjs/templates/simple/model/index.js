import Counter from './CounterModel'

export default function (racer) {
  racer.orm('counters.*', Counter)
}
