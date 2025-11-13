export async function beforeLogin ({ $auth, config, provider, userId }) {
  if (!config.beforeLogin) return

  const beforeLoginResult = config.beforeLogin({ $auth, userId, provider })
  if (beforeLoginResult?.then) await beforeLoginResult
}

export async function afterRegister ({ $auth, config, provider, userId, state }) {
  if (!config.afterRegister) return

  const afterRegisterResult = config.afterRegister({ $auth, userId, provider, state })
  if (afterRegisterResult?.then) await afterRegisterResult
}
