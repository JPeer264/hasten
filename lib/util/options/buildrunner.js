'use strict';

var fs = require('fs-extra');
var path = require('path');
var glob = require('glob');
var extend = require('extend');
var _ = require('underscore');
var hasten = require('../hasten');

var dir = process.cwd();

/**
 * (require(hasten)).buildrunner
 *
 * @module buildrunner
 */
var buildrunner = module.exports = {};

/**
 * adds the new base file into the process.cwd()
 * e.g.: for grunt it should be the Gruntfile.js
 *
 * @alias module:buildrunner.add
 *
 * @param {Object} config - configuration -> framework / buildrunner / config
 */
buildrunner.add = function add(config) {
    if (typeof config !== 'object') {
        return console.error('Invalid config of buildrunner.add');
    }

    // framework and buildrunner is important for the next step
    if (config.framework === undefined || config.buildrunner === undefined) {
        return console.error('Framework or buildrunner is not set');
    }

    if (!!config.config) {
        for (var key of config.config) {
            buildrunner.addConfig(key, config.framework, config.buildrunner);
        }
    }
}; // add

/**
 * merge 2 config files into one
 *
 * @alias module:buildrunner.merge
 *
 * @param {String} folderNameOfOptions - name of the foldername which should be merged
 * @param {String} chosenFw - name of the chosen framework
 * @param {String} buildrunner - name of the buildrunner
 * @param {Function} cb - callback function
 *
 * @return {Function} cb(err, data) - callback function, error and combined config file
 */
buildrunner.merge = function merge(folderNameOfOptions, chosenFw, choosenBuildRunner, cb) {
    var taskObj = {};
    var fwObj = {};
    var combinedObj;
    var extension = '.js';

    // glob the /taskrunner/{choosenBuildRunner}/config/{choosenBuildRunner} for .js files
    glob(path.join(hasten.paths.taskrunner, choosenBuildRunner, 'config', choosenBuildRunner, folderNameOfOptions, '*' + extension), function(err, taskFiles) {
        // glob the /framework/{framework}/{choosenBuildRunner} for .js files
        glob(path.join(hasten.paths.framework, chosenFw, choosenBuildRunner, folderNameOfOptions, '*' + extension), function(err2, fwFiles) {
            if (err) return cb(err);
            if (err2) return cb(err2);

            // get the object from task dir
            for (var taskKey of taskFiles) {
                taskObj[(path.basename(taskKey, extension))] = require(taskKey);
            }

            // get the object from fw dir
            for (var fwKey of fwFiles) {
                fwObj[(path.basename(fwKey, extension))] = require(fwKey);
            }

            // combine both objects into one
            // level 1 object keys are the filename
            // level 1 object value is the content
            // manage: [Object] <- manage.js | [Object] is the value
            combinedObj = extend(true, taskObj, fwObj);

            return cb(undefined, combinedObj);
        });
    });
}; // merge

/**
 * add all the available options
 *
 * @alias module:choosenBuildRunner.addConfig
 *
 * @param {String} folderNameOfOptions - should be "task" or "option"
 * @param {String} chosenFw - name of the chosen framework
 * @param {String} choosenBuildRunner - name of the choosenBuildRunner
 *
 * @todo folderNameOfOptions should be a Array not a String
 */
buildrunner.addConfig = function addConfig(folderNameOfOptions, chosenFw, choosenBuildRunner) {
    this.merge(folderNameOfOptions, chosenFw, choosenBuildRunner, function(err, buildOptions) {
        if (err) return console.error(err);
        // if (buildOptions.management !== undefined) console.log(buildOptions)

        for (var buildKey in buildOptions) {
            // JSON.stringify returns "key": "value"
            // here it replaces the keys "" -> key: "value"
            // this will keep the grunt object formatation
            var objectStyledString = JSON.stringify(buildOptions[buildKey], function(key, value) {
                    // without toString the function could not be converted by stringify
                    // it will end up as an empty object
                    // lateron it will be reverted in the replace function
                    if (typeof value === 'function')  {
                        return value.toString();
                    }

                    return value;
                }, '\t')
                .replace(/\"\w+\":/g, function(matchedString) {
                    // replaces the "string" into an objectkey
                    // "name": -> name:
                    return matchedString.substr(1, matchedString.length-3) +  ':';
                })
                .replace(/"function(.*?)}"/g, function(matchedString) {
                    // returns functionsstring into functions again
                    return matchedString
                                .substr(1, matchedString.length-3)
                                .replace(/\\r\\n/g, '\n') // replace all \r\n into one non-string \n
                                .replace(/\\\\n/g, '\\n') // replace all \\n into '\n'
                                .replace(/\\"/g, '"') // replace all \" into "
                                .replace(/\\r/g, '\r') // replace all \r into one non-string \r
                                .replace(/\\t/g, '\t') + '}'; // replace all \t into one non-string \t
                });

            hasten.file.create(
                path.join(dir, 'config', choosenBuildRunner, folderNameOfOptions), // path
                buildKey + '.js', // filename
                'module.exports = ' + objectStyledString + ';' // content with module.exports wrapper
            );
        }

        if (folderNameOfOptions === 'lists') {
            buildrunner.replaceList();
        }
    });
}; // addConfig

/**
 * replace all {STRING} in the original Gruntfile
 *
 * @alias module:buildrunner.replaceList
 *
 * @param {String} buildrunner - name of the buildrunner
 */
buildrunner.replaceList = function replaceList() {
    var modifiedFileString;
    var fileString = fs.readFileSync(hasten.paths.gruntFile, 'utf8');
    var listPath = path.join(dir, 'config/grunt/lists/');

    // replaces the {STRING} from Gruntfile into
    modifiedFileString = fileString.replace(/{\w+}/g, function(data) {
        var val = data.substring(1, data.length-1);
        var replaceFileString = fs.readFileSync(path.join(listPath, val + '.js'), 'utf8');

        if (!!replaceFileString) {
            return replaceFileString
                        .replace('module.exports = {', '/* ' + val + ' start */')
                        .replace('};', '/* ' + val + ' end */');
        } else {
            return '';
        }
    });

    fs.writeFileSync(path.join(dir, 'Gruntfile.js'), modifiedFileString);
    fs.removeSync(listPath);
}; // replaceList
