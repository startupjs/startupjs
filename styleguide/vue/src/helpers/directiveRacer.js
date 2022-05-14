export default {
  beforeMount: function (el, binding, vnode) {
    const model = binding.value
    if (!model) return

    el.value = model.get()

    function handler (e) {
      model.set(e.target.value)
    }

    el.addEventListener('input', handler)
  },

  beforeUpdate: function (el, binding) {
    const model = binding.value
    el.value = model.get()
  }
}
