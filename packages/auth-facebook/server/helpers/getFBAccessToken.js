import FB from 'fb'

export default function getFBAccessToken ({
  clientId,
  clientSecret,
  redirectURI,
  code
}) {
  return new Promise((resolve, reject) => {
    FB.api('oauth/access_token', {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectURI,
      code
    }, function (res) {
      if (!res || res.error) {
        console.log(!res ? 'error occurred' : res.error)
        return reject(res.error)
      }

      resolve(res.access_token)
    })
  })
}
