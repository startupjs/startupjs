// eslint-disable-next-line camelcase
export const unstable_settings = {
  matcher: {
    patterns: ['/api/expo-session']
  }
}

export default function middleware (request: Request) {
  const url = new URL(request.url)
  if (url.searchParams.get('middleware') !== 'block') return

  return Response.json(
    { ok: false, blockedBy: 'expo-router-middleware' },
    {
      status: 418,
      headers: {
        'x-expo-router-middleware': 'hit'
      }
    }
  )
}
