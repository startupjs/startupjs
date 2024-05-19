import { createElement as el, Fragment } from 'react'
import { describe, it, afterEach, expect, beforeAll as before } from '@jest/globals'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { $, sub, observer } from '../index.js'
import connect from '../connect/test.js'

before(connect)
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
    await wait()
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
    await wait()
    expect(renders).toBe(2)
  })
})

describe('use$() hook for creating values', () => {
  it('creates a value signal with a default value and reuses it on next render', async () => {
    let renders = 0
    const Component = observer(() => {
      renders++
      const $name = $('John')
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
    await wait()
    expect(renders).toBe(2)
  })
})

describe('use$() hook for creating reactions', () => {
  it('create reaction from global signals and update dependent values', async () => {
    let renders = 0
    const { $name, $surname, $age, $hasAge } = $.session.reactionTest1
    const Component = observer(() => {
      renders++
      const $fullName = $(() => `${$name.get() || 'Anon'} ${$surname.get() || 'Anonymous'}${$hasAge.get() ? (' ' + $age.get()) : ''}`)
      return fr(
        el('span', {}, $fullName.get() || 'Anon Anonymous'),
        el('button', { id: 'fullName', onClick: () => { $name.set('John'); $surname.set('Smith') } }),
        el('button', { id: 'age', onClick: () => $age.set(($age.get() || 20) + 1) }),
        el('button', { id: 'hasAge', onClick: () => $hasAge.set(!$hasAge.get()) })
      )
    })
    const { container } = render(el(Component))
    expect(container.textContent).toBe('Anon Anonymous')
    expect(renders).toBe(1)
    fireEvent.click(container.querySelector('#fullName'))
    expect(container.textContent).toBe('John Smith')
    expect(renders).toBe(2)
    await wait()
    expect(renders).toBe(2)
    // check that .set() on its own doesn\'t trigger rerender
    // and that since $age.get() is not initially accessed in the reaction,
    // it doesn\'t trigger rerender either
    fireEvent.click(container.querySelector('#age'))
    expect(container.textContent).toBe('John Smith')
    expect(renders).toBe(2)
    await wait()
    expect(renders).toBe(2)
    // after $hasAge has change to true, the $age.get() is accessed in the reaction
    // and should be tracked afterwards
    fireEvent.click(container.querySelector('#hasAge'))
    expect(container.textContent).toBe('John Smith 21')
    expect(renders).toBe(3)
    // changing $age should trigger rerender now since it's accessed in the reaction
    fireEvent.click(container.querySelector('#age'))
    expect(container.textContent).toBe('John Smith 22')
    expect(renders).toBe(4)
    await wait()
    expect(renders).toBe(4)
    // changing $hasAge to false should stop tracking $age
    fireEvent.click(container.querySelector('#hasAge'))
    expect(container.textContent).toBe('John Smith')
    expect(renders).toBe(5)
    // changing $age should not trigger rerenders anymore
    fireEvent.click(container.querySelector('#age'))
    expect(container.textContent).toBe('John Smith')
    expect(renders).toBe(5)
    await wait()
    expect(renders).toBe(5)
  })

  it('create reaction from local use$() signals and update dependent values', async () => {
    // same as the previous test, but with local signals (created in the component itself)
    let renders = 0
    const Component = observer(() => {
      renders++
      const { $name, $surname, $age, $hasAge } = $()
      const $fullName = $(() => `${$name.get() || 'Anon'} ${$surname.get() || 'Anonymous'}${$hasAge.get() ? (' ' + $age.get()) : ''}`)
      return fr(
        el('span', {}, $fullName.get() || 'Anon Anonymous'),
        el('button', { id: 'fullName', onClick: () => { $name.set('John'); $surname.set('Smith') } }),
        el('button', { id: 'age', onClick: () => $age.set(($age.get() || 20) + 1) }),
        el('button', { id: 'hasAge', onClick: () => $hasAge.set(!$hasAge.get()) })
      )
    })
    const { container } = render(el(Component))
    expect(container.textContent).toBe('Anon Anonymous')
    expect(renders).toBe(1)
    fireEvent.click(container.querySelector('#fullName'))
    expect(container.textContent).toBe('John Smith')
    expect(renders).toBe(2)
    await wait()
    expect(renders).toBe(2)
    // check that .set() on its own doesn\'t trigger rerender
    // and that since $age.get() is not initially accessed in the reaction,
    // it doesn\'t trigger rerender either
    fireEvent.click(container.querySelector('#age'))
    expect(container.textContent).toBe('John Smith')
    expect(renders).toBe(2)
    await wait()
    expect(renders).toBe(2)
    // after $hasAge has change to true, the $age.get() is accessed in the reaction
    // and should be tracked afterwards
    fireEvent.click(container.querySelector('#hasAge'))
    expect(container.textContent).toBe('John Smith 21')
    expect(renders).toBe(3)
    // changing $age should trigger rerender now since it's accessed in the reaction
    fireEvent.click(container.querySelector('#age'))
    expect(container.textContent).toBe('John Smith 22')
    expect(renders).toBe(4)
    await wait()
    expect(renders).toBe(4)
    // changing $hasAge to false should stop tracking $age
    fireEvent.click(container.querySelector('#hasAge'))
    expect(container.textContent).toBe('John Smith')
    expect(renders).toBe(5)
    // changing $age should not trigger rerenders anymore
    fireEvent.click(container.querySelector('#age'))
    expect(container.textContent).toBe('John Smith')
    expect(renders).toBe(5)
    await wait()
    expect(renders).toBe(5)
  })
})

describe('useSub() for subscribing to documents', () => {
  it('subscribes to a document and rerenders on changes', async () => {
    let renders = 0
    const Component = observer(() => {
      renders++
      const $user = sub($.users._1)
      return fr(
        el('span', {}, $user.name.get() || 'anonymous'),
        el('button', { id: 'doc', onClick: () => $user.set({ name: 'John' }) }),
        el('button', { id: 'name', onClick: () => $user.name.set('Jane') })
      )
    })
    const { container } = render(el(Component))
    expect(renders).toBe(1)
    expect(container.textContent).toBe('')
    await wait()
    expect(renders).toBe(2)
    expect(container.textContent).toBe('anonymous')
    fireEvent.click(container.querySelector('#doc'))
    expect(renders).toBe(3)
    expect(container.textContent).toBe('John')
    fireEvent.click(container.querySelector('#name'))
    expect(renders).toBe(4)
    expect(container.textContent).toBe('Jane')
    await wait()
    expect(renders).toBe(4)
    act(() => {
      $.users._1.name.set('Alice')
    })
    expect(renders).toBe(5)
    expect(container.textContent).toBe('Alice')
    await wait()
    expect(renders).toBe(5)
  })
})

function fr (...children) {
  return el(Fragment, {}, ...children)
}

async function wait (ms = 30) {
  return await act(async () => {
    await new Promise(resolve => setTimeout(resolve, ms))
  })
}
