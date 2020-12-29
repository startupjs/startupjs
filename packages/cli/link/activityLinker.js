const fs = require('fs')
const path = require('./path')
const { errorn, warnn, logn, infon, debugn } = require('./log')

class ActivityLinker {
  constructor () {
    this.path = path.mainActivityJava
  }

  link () {
    if (!this.path) {
      errorn(
        'MainActivity not found! Does the file exist in the correct folder?'
      )
      return
    }

    logn('  Linking MainActivity')

    try {
      let content = fs.readFileSync(this.path, 'utf8')
      content = this._link(content)
      fs.writeFileSync(this.path, content)
      infon('  MainActivity linked successfully!')
    } catch (e) {
      errorn('MainActivity was not linked. ' + e.message)
    }
  }

  _link (content) {
    if (this._isGestureHandlerLinked(content)) {
      warnn('    react-native-gesture already linked')
      return content
    }

    debugn('    Linking react-native-gesture-handler')
    return content
      .replace(
        'import com.facebook.react.ReactActivity;',
        'import com.facebook.react.ReactActivity;\n' +
        'import com.facebook.react.ReactActivityDelegate;\n' +
        'import com.facebook.react.ReactRootView;\n' +
        'import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;'
      )
      .replace(
        /\/\*\*\s*\n([^*]|(\*(?!\/)))*\*\/\s*@Override\s*protected\s*String\s*getMainComponentName\s*\(\)\s*{\s*return.+\s*\}/,
        '$&\n' +
        '  @Override\n' +
        '  protected ReactActivityDelegate createReactActivityDelegate() {\n' +
        '    return new ReactActivityDelegate(this, getMainComponentName()) {\n' +
        '      @Override\n' +
        '      protected ReactRootView createRootView() {\n' +
        '        return new RNGestureHandlerEnabledRootView(MainActivity.this);\n' +
        '      }\n' +
        '    };\n' +
        '  }'
      )
  }

  _isGestureHandlerLinked (content) {
    return /new\sRNGestureHandlerEnabledRootView\(MainActivity\.this\)/
      .test(content)
  }
}

module.exports = ActivityLinker
