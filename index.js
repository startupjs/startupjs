// babel output for:
// export * from '@startupjs/react-sharedb'
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactSharedb = require("@startupjs/react-sharedb");

Object.keys(_reactSharedb).forEach(function(key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _reactSharedb[key];
    }
  });
});