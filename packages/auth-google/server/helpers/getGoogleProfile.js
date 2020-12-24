import { OAuth2Client } from 'google-auth-library'

export default async function getGoogleProfile (idToken, clientId, clientSecret) {
  const client = new OAuth2Client(clientId, clientSecret)

  const ticket = await client.verifyIdToken({
    idToken,
    // Specify the CLIENT_ID of the app that accesses the backend
    audience: clientId
    // Or, if multiple clients access the backend:
    // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  })

  return ticket.getPayload()
}
