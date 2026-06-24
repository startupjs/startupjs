import { Signal, serverOnly } from 'startupjs'

const secretSalt = 'theSalt'

interface SecretDoc {
  value?: string
}

export default class Secret extends Signal<SecretDoc> {
  printWithSalt = serverOnly(async function (this: Secret) {
    console.log('Only executable on server. Secret value with salt is:', this.value.get(), secretSalt)
  })

  print () {
    console.log('Secret value is:', this.value.get())
  }
}
