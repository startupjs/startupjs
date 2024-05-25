import { type Redis } from 'ioredis'
import { type Db, type MongoClient, type CreateIndexesOptions } from 'mongodb'
import { type Database as SqliteDatabase } from 'sqlite3'

export interface BackendOptions {
  secure?: boolean
  ee?: any // EventEmitter instance, replace 'any' with more specific type if available
  pollDebounce?: number
  flushRedis?: boolean
  extraDbs?: any // Replace 'any' with actual type
  hooks?: (backend: any) => void // Replace 'any' with Backend class type
  accessControl?: boolean
  serverAggregate?: boolean | { customCheck: () => any } // TODO: remove customCheck support
  validateSchema?: boolean
  silentLogs?: boolean
}

// Accommodate both the specific MongoDB index creation signature and a dummy function
interface CreateMongoIndexFunction {
  (collection: string, keys: Record<string, number | string>, options?: CreateIndexesOptions): void
  (): void
}

export const createMongoIndex: CreateMongoIndexFunction

export interface RedisExports {
  redis: Redis
  redlock: any
  Redlock: any
}

export interface DbExports {
  db: any // This refers to the ShareDB connection, not MongoDB connection
  mongo: Db // MongoDB Db instance from MongoClient.db()
  mongoClient: MongoClient
  sqlite: SqliteDatabase // sqlite3 Database instance
}

export function createBackend (options?: BackendOptions): any // Replace 'any' with Backend class type

// Exports instances and constructors for Redis and database connections
export const redis: RedisExports['redis']
export const redlock: RedisExports['redlock']
export const Redlock: RedisExports['Redlock']
export const db: DbExports['db']
export const mongo: DbExports['mongo'] | undefined
export const mongoClient: DbExports['mongoClient'] | undefined
export const sqlite: DbExports['sqlite'] | undefined
