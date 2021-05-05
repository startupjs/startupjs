interface TypeFns {
  __subscriptionType: string,
  __subscriptionInvalid?: boolean,
  params: any
}

export function subLocal (localPath: string): TypeFns

export function subDoc (collection: string, docId: string): TypeFns

export function subQuery (collection: string, query: {}): TypeFns

export function subValue (value: any): TypeFns

export function subApi (path: string, fn: Function, inputs: any, options: {}): TypeFns

export function subscribe (fn: Function): TypeFns
