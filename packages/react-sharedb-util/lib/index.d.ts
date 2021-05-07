interface Batching {
  active: boolean;
  queue: Set<any>;
  flushActive: boolean;

  batch: (fn: Function) => void | Function;
  flush: () => void;
  add: (fn: Function) => void | Function;
}

export const batching: Batching

export const batch: any

export const batchModel: any

export const _semaphore: {
  allowComponentSetter: boolean,
  ignoreCollectionObservableWarning: boolean
}

export function initLocalCollection (collection: string): void

export function clone (data: any): any

export function _observablePath (path: string): void

export function _isExtraQuery (queryParams: any): any
