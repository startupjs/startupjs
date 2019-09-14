class Destroyer {
  constructor () {
    this.fns = []
  }

  add (fn) {
    this.fns.push(fn)
  }

  run () {
    this.fns.forEach(fn => fn())
    this.fns.length = 0
  }

  getDestructor () {
    let fns = [...this.fns]
    this.fns.length = 0
    return () => {
      fns.forEach(fn => fn())
      fns.length = 0 // force remove function refs
    }
  }

  reset () {
    this.fns.length = 0
  }
}

export default new Destroyer()
