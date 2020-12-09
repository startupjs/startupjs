const jwt = require('jsonwebtoken')
const fs = require('fs')
// const uuid = require('uuid/v4')

const SIX_MOUTH = 15777000

// change this params
const CLIENT_ID = 'I0OC7h3vUPxoHKl7QwNHHLq2M2abtXIMjMevfvKGBvZwyX50FjJ8OmAQS0TxzfiM'
const TEAM_ID = 'GRZZD57234'
const KEY_ID = 'C3T694M845'

const privateKey = fs.readFileSync('./private.pem')

function createJWT () {
  const header = {
    header: { kid: KEY_ID },
    algorithm: 'ES256'
  }

  const payload = {
    iss: TEAM_ID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + SIX_MOUTH,
    aud: 'https://appleid.apple.com',
    sub: CLIENT_ID
  }

  const token = jwt.sign(payload, privateKey, header)

  console.log(token)
}

createJWT()
