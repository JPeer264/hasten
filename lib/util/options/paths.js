'use strict';

var fs   = require('fs');
var path = require('path');

/**
 * @module paths
 */
module.exports = {
    workDir: path.join(process.cwd(), '/globeTest'),
    config: path.join(fs.realpathSync(__dirname), '../../config'),
    defaultHstn: path.join(fs.realpathSync(__dirname), '../../config/hasten-default.json'),
    framework: path.join(fs.realpathSync(__dirname), '../../config/framework'),
    taskrunner: path.join(fs.realpathSync(__dirname), '../../config/taskrunner'),
    gruntFile: path.join(fs.realpathSync(__dirname), '../../config/taskrunner/grunt/Gruntfile.js'),
    gruntPackage: path.join(fs.realpathSync(__dirname), '../../config/taskrunner/grunt/package.json'),
    copy: path.join(fs.realpathSync(__dirname), '../../config/copy')
}