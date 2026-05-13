import { getServerSession } from 'startupjs/serverContext'

export async function GET () {
  const session = getServerSession()
  return Response.json({
    ok: true,
    userId: session?.userId ?? null,
    loggedIn: session?.loggedIn ?? false
  })
}

export async function POST (request: Request) {
  const session = getServerSession()
  const body = await request.json()
  return Response.json({
    ok: true,
    userId: session?.userId ?? null,
    body
  })
}
