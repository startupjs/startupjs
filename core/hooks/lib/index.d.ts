export function useBind (props: object): object

export function useForceUpdate (): Function

export function useIsMountedRef (): { current: boolean }

export function useIsomorphicLayoutEffect (fn: Function, inputs: any[]): void

export function useError (data: object): [
  err: {
    setValue: (key: string, value: any) => void,
    check: (
      formSchema: object,
      data: object,
      options?: object
    ) => boolean
  },
  setErr: Function
]
