import type { ComponentType, ReactNode } from 'react'
import type { RouteObject } from 'react-router'

export interface RoutesProps {
  basename?: string
  routes: RouteObject[]
}

export interface SlotProps {
  name?: string
  children?: ReactNode
}

export interface SlotProviderProps {
  name: string
  children?: ReactNode
}

export interface GetRouterOptions {
  basename?: string
}

export interface StartupjsRouter {
  basename: string
  replace(url: string, ...args: any[]): void
  push(url: string, ...args: any[]): void
  back(): void
  navigate(url: string, ...args: any[]): void
  canGoBack(): boolean
  setParams(params?: Record<string, any>): void
  usePathname(): string
}

export const Routes: ComponentType<RoutesProps>
export const Slot: ComponentType<SlotProps>
export const SlotProvider: ComponentType<SlotProviderProps>

export function getRouter (
  routes: RouteObject[],
  options?: GetRouterOptions
): ComponentType

export function useRouter (): StartupjsRouter
