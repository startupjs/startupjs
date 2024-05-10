import { createElement as el, Fragment } from 'react'
import { describe, it, afterEach, expect } from '@jest/globals'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { $, observer, use$ } from '../index.js'

function fr (...children) {
  return el(Fragment, {}, ...children)
}

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
    await new Promise(resolve => setTimeout(resolve, 30))
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
})

describe('use$() hook for creating values', () => {
  it('creates a value and reuses it on next render', async () => {
    let renders = 0
    const Component = observer(() => {
      renders++
      const $name = use$('John')
      return (
        fr(
          el('span', {}, $name.get() || 'anonymous'),
          el('button', { onClick: () => $name.set('Jane') })
        )
      )
    })
    const { container } = render(el(Component))
    expect(container.textContent).toBe('John')
    expect(renders).toBe(1)
    fireEvent.click(container.querySelector('button'))
    expect(container.textContent).toBe('Jane')
    expect(renders).toBe(2)
    await new Promise(resolve => setTimeout(resolve, 30))
    expect(renders).toBe(2)
  })
})
