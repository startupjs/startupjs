export default function onBeforeConfirmRegistration (req, res, next) {
  const userId = req.query.id

  if (!userId) return next('Missing userId');

  next(null, userId);
}
