class HooksCounter {
  constructor () {
    this.value = 0
  }

  get () {
    return this.value
  }

  increment () {
    const value = this.value
    this.value += 1
    return value
  }

  reset () {
    this.value = 0
  }
}

export default new HooksCounter()
