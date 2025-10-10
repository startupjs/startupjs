import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { observer, styl, $ } from 'startupjs'
import { Portal, Button, Div, Span, Modal, Input, Select, Dropdown } from '@startupjs/ui'
import { Text } from '@/components/Themed'

export default observer(function TabFourScreen () {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Portal Component Test</Text>
      <PortalInsidePortal />
      <PortalInsideModal />
      <PortalInsideModalSignal />
      <PortalInsideModalSignalWithInput />
    </View>
  )
})

const PortalInsideModal = observer(() => {
  const [visible, setVisible] = useState(false)
  const [portalVisible, setPortalVisible] = useState(false)

  useEffect(() => {
    if (!visible) setPortalVisible(false)
  }, [visible])

  return (
    <>
      <Button styleName='root' onPress={() => { setVisible(true) }}>Open Modal</Button>

      {visible && (
        <Modal visible={visible} onBackdropPress={() => { setVisible(false) }}>
          <Div style={{
            padding: 20,
            backgroundColor: '#fff',
            borderRadius: 10,
            alignItems: 'center'
          }}>
            <Span style={{
              marginBottom: 20,
              fontSize: 18
            }}>Modal Content</Span>
            <Button
              variant='flat'
              onPress={() => { setPortalVisible(true) }}
              style={{ marginBottom: 10 }}
            >Open Portal</Button>
            <Button
              variant='flat'
              onPress={() => { setVisible(false) }}
            >Close Modal</Button>
            {portalVisible && (
              <Portal>
                <Div style={{
                  position: 'absolute',
                  top: 200,
                  left: 100,
                  width: 150,
                  height: 100,
                  backgroundColor: '#888',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Span style={{
                    color: '#fff',
                    marginBottom: 10,
                    fontSize: 14
                  }}>Portal in Modal</Span>
                  <Button
                    variant='flat'
                    onPress={() => { setPortalVisible(false) }}
                  >Close Portal</Button>
                </Div>
              </Portal>
            )}
          </Div>
        </Modal>
      )}
    </>
  )

  styl`
    .root
      margin-top 2u
  `
})

const PortalInsidePortal = observer(() => {
  const [visible, setVisible] = useState(false)
  const [nestedVisible, setNestedVisible] = useState(false)

  return (
    <>
      <Button styleName='root' onPress={() => { setVisible(true) }}>Open Portal</Button>
      {visible && (
        <Portal>
          <Div style={{
            position: 'absolute',
            top: 100,
            left: 50,
            width: 200,
            height: 150,
            backgroundColor: '#444',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Span style={{
              color: '#fff',
              marginBottom: 10,
              fontSize: 16
            }}>Content</Span>
            <Button
              variant='flat'
              onPress={() => { setNestedVisible(true) }}
              style={{ marginBottom: 10 }}
            >Open Nested Portal</Button>
            <Button
              variant='flat'
              onPress={() => { setVisible(false) }}
            >Close</Button>
            <Portal.Provider>
              {nestedVisible && (
                <Portal>
                  <Div style={{
                    position: 'absolute',
                    top: 166,
                    left: 0,
                    width: 150,
                    height: 100,
                    backgroundColor: '#666',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Span style={{
                      color: '#fff',
                      marginBottom: 10,
                      fontSize: 14
                    }}>Nested Content</Span>
                    <Button
                      variant='flat'
                      onPress={() => { setNestedVisible(false) }}
                    >Close Nested</Button>
                  </Div>
                </Portal>
              )}
            </Portal.Provider>
          </Div>
        </Portal>
      )}
    </>
  )
  styl`
    .root
      margin-top 2u
  `
})

const PortalInsideModalSignal = observer(() => {
  const $visible = $()
  const $portalVisible = $()

  useEffect(() => {
    if (!$visible.get()) $portalVisible.del()
  }, [$visible.get()])

  return (
    <>
      <Button styleName='root' onPress={() => { $visible.set(true) }}>Open Modal (signal)</Button>

      {$visible.get() && (
        <Modal visible={$visible.get()} onBackdropPress={() => $visible.del()}>
          <Div style={{
            padding: 20,
            backgroundColor: '#fff',
            borderRadius: 10,
            alignItems: 'center'
          }}>
            <Span style={{
              marginBottom: 20,
              fontSize: 18
            }}>Modal Content</Span>
            <Button
              variant='flat'
              onPress={() => { $portalVisible.set(true) }}
              style={{ marginBottom: 10 }}
            >Open Portal</Button>
            <Button
              variant='flat'
              onPress={() => { $visible.del() }}
            >Close Modal</Button>
            {$portalVisible.get() && (
              <Portal>
                <Div style={{
                  position: 'absolute',
                  top: 200,
                  left: 100,
                  width: 150,
                  height: 100,
                  backgroundColor: '#888',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Span style={{
                    color: '#fff',
                    marginBottom: 10,
                    fontSize: 14
                  }}>Portal in Modal</Span>
                  <Button
                    variant='flat'
                    onPress={() => { $portalVisible.del() }}
                  >Close Portal</Button>
                </Div>
              </Portal>
            )}
          </Div>
        </Modal>
      )}
    </>
  )

  styl`
    .root
      margin-top 2u
  `
})

const PortalInsideModalSignalWithInput = observer(() => {
  const $visible = $()
  const $portalVisible = $()

  useEffect(() => {
    let timerId: number
    if (!$visible.get()) $portalVisible.del()

    if ($visible.get()) {
      console.log('start timer')
      timerId = setTimeout(() => {
        $visible.del()
      }, 5000)
    }

    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [$visible.get()])

  return (
    <>
      <Button styleName='root' onPress={() => { $visible.set(true) }}>Open Modal (Date)</Button>

      {$visible.get() && (
        <Modal visible={$visible.get()} onBackdropPress={() => $visible.del()}>
          <Div style={{
            padding: 20,
            backgroundColor: '#fff',
            borderRadius: 10,
            alignItems: 'center'
          }}>
            <Span style={{
              marginBottom: 20,
              fontSize: 18
            }}>Modal Content</Span>
            <Button
              variant='flat'
              onPress={() => { $portalVisible.set(true) }}
              style={{ marginBottom: 10, marginTop: 16 }}
            >Open Portal</Button>
            <Button
              variant='flat'
              onPress={() => { $visible.del() }}
              style={{ marginTop: 16 }}
            >Close Modal</Button>
            <Input type='date' onFocus={() => { alert('hello') }} style={{ marginTop: 16 }}/>
            <Select
              style={{ marginTop: 16 }}
              options={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' }
              ]}
              value='option1'
              onChange={(value: any) => { console.log('Selected:', value) }}
            />
            <Div style={{ marginTop: 16 }}>
              <Dropdown value='item1' onChange={(value: any) => { console.log('Dropdown selected:', value) }}>
                <Dropdown.Caption placeholder='Choose an option' />
                <Dropdown.Item value='item1' label='Item 1' />
                <Dropdown.Item value='item2' label='Item 2' />
                <Dropdown.Item value='item3' label='Item 3' />
              </Dropdown>
            </Div>
            {$portalVisible.get() && (
              <Portal>
                <Div style={{
                  position: 'absolute',
                  top: 200,
                  left: 100,
                  width: 150,
                  height: 100,
                  backgroundColor: '#888',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Span style={{
                    color: '#fff',
                    marginBottom: 10,
                    fontSize: 14
                  }}>Portal in Modal</Span>
                  <Button
                    variant='flat'
                    onPress={() => { $portalVisible.del() }}
                  >Close Portal</Button>
                </Div>
              </Portal>
            )}

          </Div>
        </Modal>
      )}
    </>
  )

  styl`
    .root
      margin-top 2u
  `
})
