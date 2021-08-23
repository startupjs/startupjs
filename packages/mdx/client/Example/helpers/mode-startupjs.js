/*eslint-disable*/
ace.define('ace/mode/startupjs_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules', 'ace/mode/javascript_highlight_rules', 'ace/mode/jade_highlight_rules', 'ace/mode/stylus_highlight_rules'], function (require, exports, module) {
  'use strict'

  var oop = require('../lib/oop')
  var TextHighlightRules = require('./text_highlight_rules').TextHighlightRules
  var JavaScriptHighlightRules = require('./javascript_highlight_rules').JavaScriptHighlightRules
  var JadeHighlightRules = require('./jade_highlight_rules').JadeHighlightRules
  var StylusHighlightRules = require('./stylus_highlight_rules').StylusHighlightRules

  var StartupjsHighlightRules = function () {
    this.$rules = new JavaScriptHighlightRules().$rules,

    this.$rules.no_regex.unshift({
      token: 'text',
      regex: /pug`/,
      next: 'pug-start'
    })
    this.$rules.no_regex.unshift({
      token: 'text',
      regex: /styl`/,
      next: 'styl-start'
    })

    this.embedRules(JadeHighlightRules, 'pug-', [{
      token: 'end',
      regex: '^`$',
      next: 'start'
    }])
    this.embedRules(StylusHighlightRules, 'styl-', [{
      token: 'end',
      regex: '^`$',
      next: 'start'
    }])
  }

  oop.inherits(StartupjsHighlightRules, TextHighlightRules)

  exports.StartupjsHighlightRules = StartupjsHighlightRules
})

ace.define('ace/mode/startupjs', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/startupjs_highlight_rules'], function (require, exports, module) {
  'use strict'

  var oop = require('../lib/oop')
  var TextMode = require('./text').Mode
  var StartupjsHighlightRules = require('./startupjs_highlight_rules').StartupjsHighlightRules

  var Mode = function () {
    this.HighlightRules = StartupjsHighlightRules
  }
  oop.inherits(Mode, TextMode);

  (function () {
  // Extra logic goes here. (see below)
  }).call(Mode.prototype)

  exports.Mode = Mode
});

(function () {
  ace.require(['ace/mode/startupjs'], function (m) {
    if (typeof module === 'object' && typeof exports === 'object' && module) {
      module.exports = m
    }
  })
})()
