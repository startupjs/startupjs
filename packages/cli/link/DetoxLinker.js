const fs = require('fs')
const path = require('./path')
const { DetoxTest, networkSecurityConfig } = require('./templates')
const { errorn, warnn, logn, infon, debugn } = require('./log')

class DetoxLinker {
  constructor () {
    this.networkSecurityConfigFolder = path.networkSecurityConfigFolder
    this.networkSecurityConfigRout = path.networkSecurityConfigRout
    this.detoxTestFolder = path.detoxTestFolder
    this.detoxTestRoute = path.detoxTestRoute
    this.mainBuildGradleAndroid = path.mainBuildGradleAndroid
    this.appBuildGradleAndroid = path.appBuildGradleAndroid
    this.androidManifestXML = path.androidManifestXML
  }

  link () {
    if (!this.checkRouts()) return

    logn('  Linking build.gradle')
    this.linkMainBuildGradle()

    logn('  Linking app/build.gradle')
    this.linkAppBuildGradleAndroid()

    logn('  Linking androidManifestXML')
    this.linkAndroidManifestXML()

    logn('  create network_security_config.xml')
    this.createNetworkSecurityConfig()

    logn('  create DetoxTest.java')
    this.createDetoxTest()
  }

  linkMainBuildGradle () {
    try {
      let content = fs.readFileSync(this.mainBuildGradleAndroid, 'utf8')
      content = this._linkMainBuildGradle(content)
      fs.writeFileSync(this.mainBuildGradleAndroid, content)
      infon('  build.gradle linked successfully!')
    } catch (e) {
      errorn('build.gradle was not linked. ' + e.message)
    }
  }

  _linkMainBuildGradle (content) {
    if (this._isLinkMainBuildGradle(content)) {
      warnn('    build.gradle already linked')
      return content
    }

    const extRegExp = /ext\s*\{[\s\S]*?\}/
    const detoxExt = 'ext {\n' +
      '        buildToolsVersion = "29.0.2"\n' +
      '        minSdkVersion = 18\n' +
      '        compileSdkVersion = 29\n' +
      '        targetSdkVersion = 29\n' +
      '        kotlinVersion = "1.4.21"\n' +
    '    }'

    const dependenciesRegExp = /dependencies\s*\{[\s\S]*?\}/
    const dependencies = 'dependencies {\n' +
      '        classpath("com.android.tools.build:gradle:3.5.3")\n' +
      '        // NOTE: Do not place your application dependencies here; they belong\n' +
      '        // in the individual module build.gradle files\n' +
      '        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion"\n' +
    '    }'

    const allProgectsPlaceForDetox = /(allprojects[\s\S]*)google\(\)/
    const allProgectsDetox = '\n        maven {\n' +
    '          // All of Detox\' artifacts are provided via the npm module\n' +
    '          url "$rootDir/../node_modules/detox/Detox-android"\n' +
    '        }\n'

    debugn('    Linking detox files in build.gradle')
    return content.replace(extRegExp, detoxExt)
      .replace(dependenciesRegExp, dependencies)
      .replace(allProgectsPlaceForDetox, content.match(allProgectsPlaceForDetox)[0] + allProgectsDetox)
  }

  linkAppBuildGradleAndroid () {
    try {
      let content = fs.readFileSync(this.appBuildGradleAndroid, 'utf8')
      content = this._linkAppBuildGradleAndroid(content)
      fs.writeFileSync(this.appBuildGradleAndroid, content)
      infon('  app/build.gradle linked successfully!')
    } catch (e) {
      errorn('app/build.gradle was not linked. ' + e.message)
    }
  }

  _linkAppBuildGradleAndroid (content) {
    if (this._isLinkAppBuildGradleAndroid(content)) {
      warnn('    app/build.gradle already linked')
      return content
    }

    const defaultConfigRegExp = /defaultConfig\s*\{[\s\S]*?\}/
    const defaultConfigDetox = content.match(defaultConfigRegExp)[0].replace(/\}$/,
      '    testBuildType System.getProperty(\'testBuildType\', \'debug\')  // This will later be used to control the test apk build type\n' +
      '        testInstrumentationRunner \'androidx.test.runner.AndroidJUnitRunner\')\n' +
      '}'
    )

    const progvardRegExp = /proguardFiles getDefaultProguardFile\("proguard-android\.txt"\), "proguard-rules\.pro"/
    const progvardDetox = 'proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"\n' +
    '            // Detox-specific additions to pro-guard\n' +
    // eslint-disable-next-line no-template-curly-in-string
    '            proguardFile "${rootProject.projectDir}/../node_modules/detox/android/detox/proguard-rules-app.pro"'

    const dependencesEndRegExp = /else\s*\{[\s\S]*?implementation jscFlavor[\s\S]*?\}/
    const dependencesDetox = content.match(dependencesEndRegExp)[0].replace(/\}$/,
      '}\n' +
      '    androidTestImplementation(\'com.wix:detox:+\')'
    )
    return content.replace(defaultConfigRegExp, defaultConfigDetox)
      .replace(progvardRegExp, progvardDetox)
      .replace(dependencesEndRegExp, dependencesDetox)
  }

  linkAndroidManifestXML () {
    try {
      let content = fs.readFileSync(this.androidManifestXML, 'utf8')
      content = this._linkAndroidManifestXML(content)
      fs.writeFileSync(this.androidManifestXML, content)
      infon('  AndroidManifestXML linked successfully!')
    } catch (e) {
      errorn('AndroidManifestXML was not linked. ' + e.message)
    }
  }

  _linkAndroidManifestXML (content) {
    if (this._isLinkAndroidManifestXML(content)) {
      warnn('    AndroidManifestXML already linked')
      return content
    }

    const manifestApplicationEndRegExp = /<application[\s\S]*?>/
    const manifestApplicationEndDetox = content.match(manifestApplicationEndRegExp)[0].replace(/>$/,
      '\n      android:networkSecurityConfig="@xml/network_security_config">'
    )
    return content.replace(manifestApplicationEndRegExp, manifestApplicationEndDetox)
  }

  createNetworkSecurityConfig () {
    try {
      if (fs.existsSync(this.networkSecurityConfigRout)) {
        warnn('    network_security_config.xml already exist')
        return
      }
      if (!fs.existsSync(this.networkSecurityConfigFolder)) {
        fs.mkdirSync(this.networkSecurityConfigFolder, { recursive: true })
      }
      fs.writeFileSync(this.networkSecurityConfigRout, networkSecurityConfig)
      infon('  network_security_config.xml created successfully!')
    } catch (e) {
      errorn('network_security_config.xml was not linked. ' + e.message)
    }
  }

  createDetoxTest () {
    try {
      if (fs.existsSync(this.detoxTestRoute)) {
        warnn('    DetoxTest.java already exist')
        return
      }
      if (!fs.existsSync(this.detoxTestFolder)) {
        fs.mkdirSync(this.detoxTestFolder, { recursive: true }, (err) => {
          if (err) throw err
        })
      }
      fs.writeFileSync(this.detoxTestRoute, DetoxTest)
      infon('  DetoxTest.java created successfully!')
    } catch (e) {
      errorn('DetoxTest.java was not linked. ' + e.message)
    }
  }

  _isLinkMainBuildGradle (content) {
    return (/kotlinVersion = "1\.4\.21"/.test(content) && /minSdkVersion=18/.test(content)) ||
          /classpath "org\.jetbrains\.kotlin:kotlin-gradle-plugin:\$kotlinVersion"/.test(content) ||
          /url "\$rootDir\/\.\.\/node_modules\/detox\/Detox-android"/.test(content)
  }

  _isLinkAppBuildGradleAndroid (content) {
    return /testBuildType System\.getProperty\('testBuildType', 'debug'\)/.test(content) ||
          /testInstrumentationRunner 'androidx\.test\.runner\.AndroidJUnitRunner'/.test(content) ||
          /proguardFile "\$\{rootProject\.projectDir\}\/\.\.\/node_modules\/detox\/android\/detox\/proguard-rules-app\.pro"/.test(content) ||
          /androidTestImplementation\('com\.wix:detox:\+'\)/.test(content)
  }

  _isLinkAndroidManifestXML (content) {
    return /android:networkSecurityConfig="@xml\/network_security_config"/.test(content)
  }

  checkRouts () {
    if (!this.mainBuildGradleAndroid) {
      errorn(
        'build.gradle not found! Does the file exist in the correct folder?'
      )
      return false
    }
    if (!this.appBuildGradleAndroid) {
      errorn(
        'app/build.gradle not found! Does the file exist in the correct folder?'
      )
      return false
    }
    if (!this.androidManifestXML) {
      errorn(
        'main/AndroidManifest.xml not found! Does the file exist in the correct folder?'
      )
      return false
    }
    return true
  }
}

module.exports = DetoxLinker
