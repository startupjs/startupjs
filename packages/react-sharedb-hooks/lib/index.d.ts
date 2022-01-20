import React from 'react';

export type ResultHook<V = any> = [value: V, scope: any, initCount: number]

// destroyer
interface Destroyer {
  fns: Function[];
  add: (fn: Function) => void;
  run: () => void;
  getDestructor: () => Function;
  reset: () => void;
}

export const destroyer: Destroyer

// helpers
declare function emit (event: string): boolean
export { emit }
export function useEmit(): typeof emit

export function useModel (path: string): any;

type eventType = 'change' | 'insert' | 'remove' | 'move' | 'load' | 'unload' | 'all'
type scope = any

export function useOn (eventName: string, fn: Function): void;
export function useOn(eventType: eventType, fn: Function): Function;
export function useOn(
  eventType: eventType,
  path: string | scope,
  fn: Function
): Function;
export function useOn(
  eventType: eventType,
  path: string | scope,
  options: { useEventObjects: boolean },
  fn: Function
): Function;

export const useQueryIds: <V = any>(collection: string, ids: string[], options?: {}) => ResultHook<V>;
export const useBatchQueryIds: <V = any>(collection: string, ids: string[], options?: {}) => ResultHook<V>;
export const useAsyncQueryIds: <V = any>(collection: string, ids: string[], options?: {}) => ResultHook<V>;

export const useQueryDoc: <V = any>(collection: string, query: {}) => ResultHook<V>;
export const useBatchQueryDoc: <V = any>(collection: string, query: {}) => ResultHook<V>;
export const useAsyncQueryDoc: <V = any>(collection: string, query: {}) => ResultHook<V>;

export function useLocalDoc<V = any>(collection: string, docId: string): ResultHook<V>;
export function useSession<V = any>(path: string): ResultHook<V>;
export function usePage<V = any>(path: string): ResultHook<V>;

export function generateUseQueryDoc<V = any>({ batch, optional }?: {
  batch: boolean;
  optional: boolean;
}): (collection: string, query: {}) => ResultHook<V>;

export function generateUseQueryIds<V = any>({ batch, optional }?: {
  batch: boolean;
  optional: boolean;
}): (collection: string, ids: any[], options?: {}) => ResultHook<V>;

// meta
export const ComponentMetaContext: {};
export function useNow (): number;
export function useComponentId (): string;

// observer
export function observer(Component: React.FC<any>, options?: {
  forwardRef?: boolean,
  suspenseProps?: {
    fallback: React.ReactElement
  }
}): React.FC<any>;

// types
export const useDoc: <V = any>(collection: string, docId: string) => ResultHook<V>;
export const useBatchDoc: <V = any>(collection: string, docId: string)=> ResultHook<V>;
export const useAsyncDoc: <V = any>(collection: string, docId: string) => ResultHook<V>;

export const useQuery: <V = any>(collection: string, query: {}) => ResultHook<V>;
export const useBatchQuery: <V = any>(collection: string, query: {}) => ResultHook<V>;
export const useAsyncQuery: <V = any>(collection: string, query: {}) => ResultHook<V>;

export function useApi<V = any> (path: string, fn: Function, inputs?: any[], options?: {}): ResultHook<V>;
export function useApi<V = any> (fn: Function, inputs?: any[], options?: {}): ResultHook<V>;

export function useBatchApi<V = any> (path: string, fn: Function, inputs?: any[], options?: {}): ResultHook<V>;
export function useBatchApi<V = any> (fn: Function, inputs?: any[], options?: {}): ResultHook<V>;

export function useAsyncApi<V = any> (path: string, fn: Function, inputs?: any[], options?: {}): ResultHook<V>;
export function useAsyncApi<V = any> (fn: Function, inputs?: any[], options?: {}): ResultHook<V>;

export const useLocal: <V = any>(path: string) => ResultHook<V>;
export const useValue: <V = any>(value?: V) => ResultHook<V>;

export function useBatch (): void;
