export function useBackPress (url: string | Function): void

export function useBind (props: {}): {}

export function useDidUpdate (fn: Function, inputs?: any[]): void

export function useForceUpdate (): Function

export function useIsMountedRef (): { current: boolean }

export function useOnce (condition: boolean, fn: Function): void

export function useSyncEffect (fn: Function, inputs: any[]): void

export function useError (data: {}): [
  err: {
    setValue: (key: string, value: any) => void,
    check: (
      formSchema: {},
      data: {},
      options?: {}
    ) => boolean
  },
  setErr: Function
]
