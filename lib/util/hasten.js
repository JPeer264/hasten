'use strict';

/**
 * @module hasten
 *
 * @see module:file
 * @see module:jsonToFolder
 * @see module:paths
 * @see module:buildrunner
 * @see module:base
 */
var hasten = module.exports = {};

function doRequire(name) {
    return hasten[name] = require('./options/' + name);
}

doRequire('file');
doRequire('install');
doRequire('jsonToFolder');
hasten.json = require('json-extra');
doRequire('paths');
doRequire('buildrunner');
doRequire('base');
