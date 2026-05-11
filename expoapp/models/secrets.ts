import { Signal, serverOnly, accessControl } from 'startupjs'

const secretSalt = 'theSalt'

interface SecretDoc {
  value?: string
}

export const access = accessControl({
  read: true,
  create: true,
  update: true
})

export default serverOnly(class Secrets extends Signal<SecretDoc[]> {
  async printSalt () {
    console.log('Only executable on server. Salt value is:', secretSalt)
  }
})
