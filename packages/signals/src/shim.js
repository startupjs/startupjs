if (
  typeof globalThis.WeakRef === 'undefined' ||
  typeof globalThis.FinalizationRegistry === 'undefined'
) {
  ;(function (WeakMap, defineProperties) {
    const wr = new WeakMap()
    function WeakRef (value) {
      wr.set(this, value)
    }
    defineProperties(
      WeakRef.prototype,
      {
        deref: {
          value: function deref () {
            return wr.get(this)
          }
        }
      }
    )

    const fg = new WeakMap()
    function FinalizationRegistry (fn) {
      fg.set(this, [])
    }
    defineProperties(
      FinalizationRegistry.prototype,
      {
        register: {
          value: function register (value, name) {
            const names = fg.get(this)
            if (names.indexOf(name) < 0) names.push(name)
          }
        },
        unregister: {
          value: function unregister (value, name) {
            const names = fg.get(this)
            const i = names.indexOf(name)
            if (i > -1) names.splice(i, 1)
            return i > -1
          }
        },
        cleanupSome: {
          value: function cleanupSome (fn) {
            fn(fg.get(this))
          }
        }
      }
    )

    globalThis.WeakRef = WeakRef
    globalThis.FinalizationRegistry = FinalizationRegistry
  }(WeakMap, Object.defineProperties))
}

export const { WeakRef, FinalizationRegistry } = globalThis
