export default function sendRegistrationConfirmation (req, userId, next) {
  // Place to send a letter that confirms email address on registration
  // Email should have a link pointing to /auth/confirm-registration?id=<userId>
  // todo: implement a code instead of userId
  next()
}
