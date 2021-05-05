import React from 'react';

interface EnumResultHook {
  value: any
  scope: any
  initCount: number
}
export interface ResultHook extends Array<EnumResultHook>{}

// destroyer
interface Destroyer {
  fns: Function[];
  add: (fn: Function) => void;
  run: () => void;
  getDestructor?: () => Function;
  reset: () => void;
}

export const destroyer: Destroyer

// helpers
export const emit: any;
export function useModel (path: string): any;

export function useOn (eventName: string, cb: Function): void;
export function useOn (
  eventType: 'change'|'insert'|'remove'|'move'|'load'|'unload'|'all',
  scope: any,
  cb: Function
): void;
export function useOn (...args: any[]): void;
export function useEmit (): any;

export const useQueryIds: (collection: string, ids: string[], options?: {}) => ResultHook;
export const useBatchQueryIds: (collection: string, ids: string[], options?: {}) => ResultHook;
export const useAsyncQueryIds: (collection: string, ids: string[], options?: {}) => ResultHook;

export const useQueryDoc: (collection: string, query: {}) => ResultHook;
export const useBatchQueryDoc: (collection: string, query: {}) => ResultHook;
export const useAsyncQueryDoc: (collection: string, query: {}) => ResultHook;

export function useLocalDoc(collection: string, docId: string): ResultHook;
export function useSession(path: string): ResultHook;
export function usePage(path: string): ResultHook;

export function generateUseQueryDoc({ batch, optional }?: {
  batch: boolean;
  optional: boolean;
}): (collection: string, query: {}) => ResultHook;

export function generateUseQueryIds({ batch, optional }?: {
  batch: boolean;
  optional: boolean;
}): (collection: string, ids: any[], options?: {}) => ResultHook;

// meta
export const ComponentMetaContext: any;
export function useNow (): number;
export function useComponentId (): string;

// observer
export function observer(Component: React.FC, options: {
  forwardRef: boolean,
  suspenseProps: {
    fallback: React.ReactElement
  }
}): React.ReactElement;

// types
export const useDoc: (collection: string, docId: string) => ResultHook;
export const useBatchDoc: (collection: string, docId: string)=> ResultHook;
export const useAsyncDoc: (collection: string, docId: string) => ResultHook;

export const useQuery: (collection: string, query: {}) => ResultHook;
export const useBatchQuery: (collection: string, query: {}) => ResultHook;
export const useAsyncQuery: (collection: string, query: {}) => ResultHook;

export const useApi: (cb: Function, refreshParams: any[]) => ResultHook;
export const useBatchApi: (cb: Function, refreshParams: any[]) => ResultHook;
export const useAsyncApi: (cb: Function, refreshParams: any[]) => ResultHook;

export const useLocal: (path: string) => ResultHook;
export const useValue: (value: any) => ResultHook;

export function useBatch (): void;
