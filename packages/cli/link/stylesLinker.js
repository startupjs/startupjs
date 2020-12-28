const fs = require('fs')
const path = require('./path')
const { errorn, warnn, logn, infon, debugn } = require('./log')

class StylesLinker {
  constructor () {
    this.paths = path.styles
  }

  link () {
    if (!this.paths) {
      warnn('  Style linking skipped due to missing style files')
      return
    } else {
      logn('  Linking styles')
    }

    try {
      for (const path of this.paths) {
        let content = fs.readFileSync(path, 'utf8')
        if (this._hasColorControlActivated(content)) {
          warnn(`    ${path} already linked`)
          continue
        }

        // FIXME: we need to get color from UI ans paste them to link item
        debugn(`    Linking ${path}`)
        content = content
          .replace(
            '</style>',
            '    <item name="colorControlActivated">#2962FF</item>\n' +
            '    </style>'
          )
        fs.writeFileSync(path, content)
      }
      infon('  Styles linked successfully!')
    } catch (e) {
      errorn('Styles was not linked. ' + e.message)
    }
  }

  _hasColorControlActivated (content) {
    return /colorControlActivated/.test(content)
  }
}

module.exports = StylesLinker
