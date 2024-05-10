import { createElement as el, Fragment } from 'react'
import { describe, it, afterEach, expect } from '@jest/globals'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { $, observer, use$, useSub$ } from '../index.js'

afterEach(cleanup)

describe('observer', () => {
  it('can use signal from the outside and react to it', async () => {
    const { $name } = $.session._1
    let renders = 0
    const Component = observer(() => {
      renders++
      return el('span', {}, $name.get() || 'anonymous')
    })
    const { container } = render(el(Component))
    expect(container.textContent).toBe('anonymous')
    expect(renders).toBe(1)
    act(() => {
      $name.set('John')
    })
    expect(container.textContent).toBe('John')
    expect(renders).toBe(2)
    await wait(30)
    expect(renders).toBe(2)
  })

  it('if not wrapped in observer, does not react to signal changes', () => {
    const { $name } = $.session._2
    let renders = 0
    const Component = () => {
      renders++
      return el('span', {}, $name.get() || 'anonymous')
    }
    const { container } = render(el(Component))
    expect(container.textContent).toBe('anonymous')
    expect(renders).toBe(1)
    act(() => {
      $name.set('John')
    })
    expect(container.textContent).toBe('anonymous')
    expect(renders).toBe(1)
  })

  it('batches multiple updates into one render', async () => {
    const { $name, $surname } = $.session._3
    let renders = 0
    const Component = observer(() => {
      renders++
      return fr(
        el('span', {}, $name.get() || 'Anon'),
        ' ',
        el('span', {}, $surname.get() || 'Anonymous')
      )
    })
    const { container } = render(el(Component))
    expect(container.textContent).toBe('Anon Anonymous')
    expect(renders).toBe(1)
    act(() => {
      $name.set('John')
      $surname.set('Smith')
    })
    expect(container.textContent).toBe('John Smith')
    expect(renders).toBe(2)
    await wait(30)
    expect(renders).toBe(2)
  })
})

describe('use$() hook for creating values', () => {
  it('creates a value signal with a default value and reuses it on next render', async () => {
    let renders = 0
    const Component = observer(() => {
      renders++
      const $name = use$('John')
      return fr(
        el('span', {}, $name.get() || 'anonymous'),
        el('button', { onClick: () => $name.set('Jane') })
      )
    })
    const { container } = render(el(Component))
    expect(container.textContent).toBe('John')
    expect(renders).toBe(1)
    fireEvent.click(container.querySelector('button'))
    expect(container.textContent).toBe('Jane')
    expect(renders).toBe(2)
    await wait(30)
    expect(renders).toBe(2)
  })
})

describe.skip('use$() hook for creating reactions', () => {

})

describe('useSub$() for subscribing to documents', () => {
  it('subscribes to a document and rerenders on changes', async () => {
    let renders = 0
    const Component = observer(() => {
      renders++
      const $user = useSub$($.users._1)
      return fr(
        el('span', {}, $user.name.get() || 'anonymous'),
        el('button', { id: 'doc', onClick: () => $user.set({ name: 'John' }) }),
        el('button', { id: 'name', onClick: () => $user.name.set('Jane') })
      )
    })
    const { container } = render(el(Component))
    expect(renders).toBe(1)
    expect(container.textContent).toBe('')
    await wait(30)
    expect(renders).toBe(2)
    expect(container.textContent).toBe('anonymous')
    fireEvent.click(container.querySelector('#doc'))
    expect(renders).toBe(3)
    expect(container.textContent).toBe('John')
    fireEvent.click(container.querySelector('#name'))
    expect(renders).toBe(4)
    expect(container.textContent).toBe('Jane')
    await wait(30)
    expect(renders).toBe(4)
    act(() => {
      $.users._1.name.set('Alice')
    })
    expect(renders).toBe(5)
    expect(container.textContent).toBe('Alice')
    await wait(30)
    expect(renders).toBe(5)
  })
})

function fr (...children) {
  return el(Fragment, {}, ...children)
}

async function wait (ms) {
  return await act(async () => {
    await new Promise(resolve => setTimeout(resolve, ms))
  })
}
