import type { Request, Response } from 'express'

export function runWithRequestContext <T> (req: Request, res: Response, fn: () => T): T
export function getRequestContext (): { req: Request, res: Response } | undefined
export function getServerRequest (): Request | undefined
export function getServerResponse (): Response | undefined
export function getServerSession (): any | undefined
