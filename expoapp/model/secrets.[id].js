import { Signal, serverOnly } from 'startupjs'

const secretSalt = 'theSalt'

export default class Secret extends Signal {
  printWithSalt = serverOnly(async function () {
    console.log('Only executable on server. Secret value with salt is:', this.value.get(), secretSalt)
  })

  print () {
    console.log('Secret value is:', this.value.get())
  }
}
