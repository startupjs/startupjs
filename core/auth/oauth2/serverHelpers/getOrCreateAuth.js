export default async function getOrCreateAuth (config, provider, { userinfo, token, scopes, storage } = {}) {
  const { id: providerUserId, ...privateInfo } = getPrivateInfo(config, userinfo)
  if (!providerUserId) throw Error(ERRORS.noIdField)
  const publicInfo = getPublicInfo(config, userinfo)
  async function updateProviderInfo (userId) {
    const raw = config.saveRawUserinfo ? userinfo : undefined
    await storage.addNewProvider(userId, provider, { providerUserId, privateInfo, publicInfo, raw, token, scopes })
  }
  // first try to find the exact match with the provider's id
  {
    const user = await storage.findUserByProvider(provider, providerUserId, storage.getUsersFilterQueryParams())
    // update user info if it was changed
    if (user) {
      const { $auth, userId } = user
      const { autoUpdateInfo = true } = config
      if (autoUpdateInfo) await updateProviderInfo(userId)
      return { $auth, userId, registered: false }
    }
  }
  // then see if we already have a user with such email but without this provider.
  // If the provider is trusted (it definitely provides correct and confirmed email),
  // then we can merge the provider into the existing user.
  if (config.allowAutoMergeByEmail && privateInfo.email) {
    const user = await storage.findUserByEmail(privateInfo.email, {
      [provider]: { $exists: false },
      ...storage.getUsersFilterQueryParams()
    })
    if (user) {
      const { $auth, userId } = user
      await updateProviderInfo(userId)
      return { $auth, userId, registered: false }
    }
  }
  // create a new user
  {
    const { $auth, userId } = await storage.createUser({ ...privateInfo })
    await updateProviderInfo(userId)
    return { $auth, userId, registered: true }
  }
}

function getPrivateInfo (config, userinfo) {
  const privateInfo = config.getPrivateInfo?.(userinfo) || defaultGetPrivateInfo(userinfo)
  if (!privateInfo?.id) throw Error('Userinfo: id is missing')
  return privateInfo
}

function getPublicInfo (config, userinfo) {
  return config.getPublicInfo?.(userinfo) || defaultGetPublicInfo(userinfo)
}

function defaultGetPrivateInfo (userinfo) {
  const email = userinfo.email
  const id = userinfo.id || userinfo.sub || userinfo.user_id || userinfo.email || userinfo.login
  return { id, email }
}

function defaultGetPublicInfo (userinfo) {
  const name = userinfo.displayName || userinfo.name || userinfo.nickname || userinfo.username || userinfo.login
  const potentialAvatarKeys = [
    'avatarUrl', 'avatar_url', 'avatarURL', 'avatar', 'photoUrl', 'photo_url', 'photoURL', 'photo',
    'pictureUrl', 'picture_url', 'pictureURL', 'picture', 'image', 'imageUrl', 'image_url', 'imageURL'
  ]
  let avatarUrl
  for (const key of potentialAvatarKeys) {
    if (userinfo[key]) {
      avatarUrl = userinfo[key]
      break
    }
  }
  return { name, avatarUrl }
}

const ERRORS = {
  noIdField: `
    auth: did not receive 'id' from userinfo.
    You have probably forgot to return the 'id' field from getPrivateInfo()
  `
}
