// 'use strict';
// // todo should create from json a folder dir
// // todo use mkdirp
var mkdirp = require('mkdirp');
var colors = require('colors');
var json = require('json-extra');

/**
 * @module jsonToFolder
 */
module.exports = {
    create: create
};

/**
 *  creates the folder structure.
 *
 *  @param {Object} json
 */
function create(jsonString) {
    // if(!json.check('string', jsonString)) return false;
    var sortedArray = json.toPath(jsonString);

    for (var elem of sortedArray) {
        mkdirp(elem, function(err) {
            if(err) {
                console.error(err);
                return;
            }
        });
    }

    console.log('Successfull created'.green + ' folders'.bold.green + '!'.green);
} // create
