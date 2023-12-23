import inquirer from 'inquirer'
import { $ as execa } from 'execa'
import semver from 'semver'

const $ = execa({ shell: true })
const MIN_COREPACK_VERSION = '0.20.0'
const packageManagers = {
  yarn: {
    install: ['add'],
    installDev: ['add', '-D'],
    uninstall: ['remove']
  },
  npm: {
    install: ['install'],
    installDev: ['install', '--save-dev'],
    uninstall: ['uninstall']
  }
}

export default class PackageManager {
  constructor (packageManager, projectPath) {
    if (!packageManager) throw new Error('Package manager is not provided')

    this.packageManager = packageManager
    this.$project = $({ cwd: projectPath })

    switch (this.packageManager) {
      case 'yarn':
        return initYarn()
    }
  }

  install (dependencies) {
    if (!dependencies.length) return

    return this._runPackageMangerCommand('install', dependencies)
  }

  installDev (dependencies) {
    if (!dependencies.length) return

    return this._runPackageMangerCommand('installDev', dependencies)
  }

  uninstall (dependencies) {
    if (!dependencies.length) return

    return this._runPackageMangerCommand('uninstall', dependencies)
  }

  complete () {
    switch (this.packageManager) {
      case 'yarn':
        return completeYarn()
    }
  }

  async _runPackageMangerCommand (command, dependencies) {
    const { packageManager, $project } = this
    const args = packageManagers[packageManager][command]

    await $project`${packageManager} ${args} ${dependencies}`
  }
}

async function completeYarn () {
  await this.$project`corepack use 'yarn@*'`
  await this.$project`yarn config set nodeLinker node_modules`
}

async function initYarn () {
  // Checking if 'corepack' exists.
  // If not, ask the user for permission to install it.
  try {
    await $`command -v corepack`
  } catch {
    const { installCorepack } = await inquirer.prompt([{
      type: 'confirm',
      name: 'installCorepack',
      message: 'Corepack could not be found, do you want to install it?',
      default: true
    }])

    if (!installCorepack) {
      throw new Error('Aborting the script as per your request.')
    }

    await $`npm i -g corepack@latest`
  }

  // Checking if 'corepack' version is less than minimum required version.
  // If it is, asking user permission to update it.
  const corepackVersion = (await $`corepack --version`).stdout

  if (semver.lt(corepackVersion, MIN_COREPACK_VERSION)) {
    const { updateCorepack } = await inquirer.prompt([{
      type: 'confirm',
      name: 'updateCorepack',
      message:
        `Corepack version is less than ${MIN_COREPACK_VERSION}, ` +
        'would you like to update it now?',
      default: true
    }])

    if (!updateCorepack) {
      throw new Error('Aborting the script as per your request.')
    }

    await $`npm i -g corepack@latest`
  }

  await $`corepack enable`
}
