'use strict';

var colors = require('colors');
var path = require('path');
var fs = require('fs-extra');
var jtf = require('./jsonToFolder');
var paths = require('./paths');

// important for prepareRenamingArray()
var count = 0;
var pathArray = [];

/**
 * @module file
 */
module.exports = {
    exists: exists,
    existsLocalHasten: existsLocalHasten,
    readJsonToObj: readJsonToObj,
    create: create,
    replaceNames: replaceNames,
    createRenamedFolders: createRenamedFolders,
    compareJson: compareJson,
    prepareRenamingArray: prepareRenamingArray
}

/**
 * Check if this file exists
 *
 * @param {String} pathString
 *
 * @return {Boolean}
 */
function exists(pathString) {

    // search for file. Fail fast if there is no json File
    if (!fs.existsSync(pathString)) return false;
    if (!fs.statSync(pathString).isFile()) return false;

    return true;
}

/**
 * Check if the local hasten exists
 *
 * @return {Boolean}
 */
function existsLocalHasten() {
    if (exists(path.join(process.cwd(), 'hasten.json'))) {
        return true;
    }

    return false;
}

/**
 * Create a file
 *
 * @param {String} pathString
 * @param {String} filename
 * @param {String} content
 */
function create(pathString, filename, content) {
    var combinePath = path.join(pathString, filename);
    content = typeof content === 'undefined' ? '{}' : content ;

    if (typeof content !== 'string') {
        console.log('Error. Please enter a json string as content.'.bold.red);
        process.exit(5);
    }

    fs.ensureDirSync(pathString);
    fs.writeFileSync(combinePath, content, 'utf8');
}

/**
 * Read the file in the path and convert it into an Javascript Object
 *
 * @param {String} path
 *
 * @return {Objects} strToObj
 */
function readJsonToObj(path) {
    if (!this.exists(path)) {
        return false;
    }

    var fileString = fs.readFileSync(path, 'utf8');
    var strToObj = JSON.parse(fileString);

    return strToObj;
}

/**
 * This function replaces the names in the `mkhstn` Object from the hasten.json file.
 * This is necessary if you want custom names
 *
 * @param {Object} mkhstn
 * @param {Object} names
 *
 * @return {Object} renamedJson
 */
function createRenamedFolders(mkhstn, names) {
    // console.log(mkhstn);
    var replacedAnswer = this.replaceNames(names);
    var comparedJson = this.compareJson(mkhstn, replacedAnswer);

    return comparedJson;
}

/**
 * This function compares mkhstn and the names
 * This function is recursive
 *
 * @param {Object} mkhstn
 * @param {Object} names
 *
 * @return {Object}
 */
function compareJson(mkhstn, names, lastKey) {
    for (var key in mkhstn) {

        if (typeof mkhstn[key] === 'object') {
            this.compareJson(mkhstn[key], names, key);
        }

        if (typeof mkhstn[key] === 'string') {
            if (key === 'base') {
                for (var aKey in names) {
                    if (aKey ===  lastKey) {
                        mkhstn[key] = names[aKey];
                    }
                }
            }
        }
    }

    return mkhstn;
}

/**
 * This function replaces every boolean with a value
 * This function is recursive
 *
 * @param {Object} names
 *
 * @return {Object} changed names. true = key is value; false = '' is value
 */
function replaceNames(names) {
    for (var key in names) {
        if (typeof names[key] === 'boolean') {
            if (names[key]) {
                names[key] = key;
            } else {
                names[key] = '';
            }
        }
    }

    return names;
}

/**
 * This functions prepare an array for later renaming function
 * This function is recursive
 *
 * @params {Object} json
 * @params {Object} names
 *
 * @return {Array}
 */
function prepareRenamingArray(json, names) {
    for (var jsonKey in json) {
        if (typeof json[jsonKey] === 'object') {
            for (var nameKey in names) {

                // check if they are the same key
                if (jsonKey === nameKey) {
                    // check if do not have the same value, if so - rename
                    if (json[jsonKey].base === names[nameKey]) {
                        // rename
                        pathArray[count] = names[nameKey];
                    }
                }
            }

            this.prepareRenamingArray(json[jsonKey], names);
        }
        count++;
    }

    return pathArray;
}
