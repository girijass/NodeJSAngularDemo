'use strict';

var _PROPS = {};

exports.setProperty = function(name, value) {
  _PROPS[name] = value;
};

exports.getProperty = function(name) {
  return _PROPS[name];
};
