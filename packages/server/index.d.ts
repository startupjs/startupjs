import type { BackendOptions } from '@startupjs/backend'
import type { Server as HttpServer } from 'http'
import type { Express } from 'express' // Assuming Express types are available

export interface ServerOptions extends BackendOptions {
  publicPath?: string
  loginUrl?: string
  bodyParserLimit?: string
  dirname?: string
  isExpo?: boolean
  // Note: Additional properties specific to ServerOptions go here.
  // There's no need to repeat properties from BackendOptions unless you want to change the type or documentation.
}

export interface CreateServerOptions extends ServerOptions {}

export interface CreateMiddlewareOptions extends ServerOptions {}

export interface ServerProps {
  server: HttpServer
  backend: any // Replace 'any' with the actual type of backend
  session: any // Replace 'any' with the actual type of session
  channel: any // Replace 'any' with the actual type of channel
  expressApp: Express
}

export interface MiddlewareProps {
  middleware: any // Replace 'any' with the actual type of middleware
  backend: any // Same as above
  session: any // Same as above
  channel: any // Same as above
}

export default function startServer (options?: ServerOptions): Promise<ServerProps>
export function createServer (options?: CreateServerOptions): Promise<ServerProps>
export function createMiddleware (options?: CreateMiddlewareOptions): Promise<MiddlewareProps>
export function createBackend (options?: ServerOptions): any // Replace 'any' with the actual backend type
export function NO_DEAD_CODE_ELIMINATION (): [any, any] // Replace 'any' with actual types if known

// Assuming the types for the below exports are defined in '@startupjs/backend' module
export { mongo, mongoClient, createMongoIndex, redis, redlock, sqlite } from '@startupjs/backend'
