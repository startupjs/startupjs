/**
 * COMPAT-ONLY legacy entrypoint for older code and third-party LMS packages
 * which still import model helpers from `startupjs/orm`.
 *
 * Purpose:
 * - preserve the historic import path while the new Startupjs package surface is
 *   organized around `startupjs` root exports
 * - avoid mechanical divergence in downstream apps and patched dependencies
 *
 * Contract in this compat file:
 * - `BaseModel` is exposed as an alias of the current `Signal` export
 * - `hasMany` and `belongsTo` are re-exported from the current root package API
 *
 * Explicit limitations:
 * - this file is internal compat support and is intentionally not part of the
 *   main documented Startupjs API surface
 * - it only restores the legacy `startupjs/orm` surface used by the LMS stack
 */

export { Signal as BaseModel, hasMany, belongsTo } from './index.js'
