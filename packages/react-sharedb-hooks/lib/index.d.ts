import React from 'react';

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

export const useQueryIds: (collection: string, ids: string[], options?: {}) => any;
export const useBatchQueryIds: (collection: string, ids: string[], options?: {}) => any;
export const useAsyncQueryIds: (collection: string, ids: string[], options?: {}) => any;

export const useQueryDoc: (collection: string, query: {}) => any;
export const useBatchQueryDoc: (collection: string, query: {}) => any;
export const useAsyncQueryDoc: (collection: string, query: {}) => any;

export function useLocalDoc(collection: string, docId: string): any;
export function useSession(path: string): any;
export function usePage(path: string): any;

export function generateUseQueryDoc({ batch, optional }?: {
  batch: boolean;
  optional: boolean;
}): (collection: string, query: {}) => any;

export function generateUseQueryIds({ batch, optional }?: {
  batch: boolean;
  optional: boolean;
}): (collection: string, ids: any[], options?: {}) => any;

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
export const useDoc: (collection: string, docId: string) => any;
export const useBatchDoc: (collection: string, docId: string)=> any;
export const useAsyncDoc: (collection: string, docId: string) => any;

export const useQuery: (collection: string, query: {}) => any[];
export const useBatchQuery: (collection: string, query: {}) => any[];
export const useAsyncQuery: (collection: string, query: {}) => any[];

export const useApi: (cb: Function, refreshParams: any[]) => any;
export const useBatchApi: (cb: Function, refreshParams: any[]) => any;
export const useAsyncApi: (cb: Function, refreshParams: any[]) => any;

export const useLocal: (path: string) => any;
export const useValue: (value: any) => any;

export function useBatch (): void;
