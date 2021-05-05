class Destroyer {
  fns: Function[]

  constructor () {
    this.fns = []
  }

  add (fn: Function): void {
    this.fns.push(fn)
  }

  run (): void {
    this.fns.forEach(fn => fn())
    this.fns.length = 0
  }

  getDestructor (): Function {
    const fns = [...this.fns]
    this.fns.length = 0
    return () => {
      fns.forEach(fn => fn())
      fns.length = 0 // force remove function refs
    }
  }

  reset (): void {
    this.fns.length = 0
  }
}

export default new Destroyer()
