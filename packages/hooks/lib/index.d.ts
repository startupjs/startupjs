export function useBackPress (url: string): void
export function useBackPress (fn: Function): void

export function useBind (props: {}): {}

export function useDidUpdate (fn: Function, inputs: any[]): void

export function useForceUpdate (): Function

export function useIsMountedRef (): { current: boolean }

export function useOnce (condition: boolean, fn: Function): void

export function useSyncEffect (fn: Function, inputs: any[]): void

export function useError (
  formSchema: {},
  data: {},
  options?: {}
): [err: {}, setErr: Function]
