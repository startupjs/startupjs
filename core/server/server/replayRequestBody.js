import { Readable } from 'node:stream'

export default function replayRequestBody (req) {
  if (req.rawBody == null || !req.readableEnded) return req

  const replay = Readable.from([req.rawBody])

  for (const property of REQUEST_PROPERTIES) {
    replay[property] = req[property]
  }

  // Expo's Express adapter resolves URLs from `req.url`, so preserve the full
  // request URL when this helper is used behind an Express app-level middleware.
  replay.url = req.originalUrl || req.url

  return replay
}

const REQUEST_PROPERTIES = [
  'aborted',
  'client',
  'complete',
  'connection',
  'headers',
  'httpVersion',
  'httpVersionMajor',
  'httpVersionMinor',
  'method',
  'originalUrl',
  'rawBody',
  'rawHeaders',
  'rawTrailers',
  'session',
  'socket',
  'trailers',
  'url'
]
