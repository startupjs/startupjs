// import React, { useState } from 'react'
// import Button from '../../../Button'
// import PropTypes from 'prop-types'
// import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
// import styles from '../index.styl'
// import { Modal, Div } from '@startupjs/ui'
// import { WebView } from 'react-native-webview'
// import { observer, u } from 'startupjs'
// import qs from 'query-string'
// import { BASE_URL, LINKEDIN_CLIENT_ID } from '@env'
// import constants from '../../../../../helpers/constants.json'

// const AUTHORIZATION_URL = 'https://www.linkedin.com/oauth/v2/authorization'
// const baseUrl = BASE_URL
// const clientId = LINKEDIN_CLIENT_ID

// function LinkedinButton ({ text }) {
//   const [showModal, setShowModal] = useState(false)

//   function showLoginModal () {
//     setShowModal(true)
//   }

//   const getAuthorizationUrl = () =>
//     `${AUTHORIZATION_URL}?${qs.stringify({
//       response_type: 'code',
//       client_id: clientId,
//       scope: 'r_emailaddress r_liteprofile',
//       redirect_uri: baseUrl + constants.CALLBACK_LINKEDIN_URL + '-native'
//     })}`

//   return pug`
//     Button(
//       icon=faLinkedinIn
//       text=text
//       variant='flat'
//       style=styles.flexStartText
//       onPress=showLoginModal
//     )
//     Modal(
//       variant='fullscreen'
//       visible=showModal
//     )
//       Div.modal
//         WebView(
//           style={ height: u(100) }
//           source={ uri: getAuthorizationUrl() }
//           startInLoadingState
//           javaScriptEnabled
//           domStorageEnabled
//           sharedCookiesEnabled
//         )
//   `
// }

// LinkedinButton.defaultProps = {
//   text: 'Login with LinkedIn'
// }

// LinkedinButton.propTypes = {
//   text: PropTypes.string.isRequired
// }

// export default observer(LinkedinButton)
