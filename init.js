// babel output for:
// export * from '@startupjs/init'
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _init = require("@startupjs/init");

Object.keys(_init).forEach(function(key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _init[key];
    }
  });
});
