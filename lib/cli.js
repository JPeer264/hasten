'use strict';

var fs = require('fs-extra');
var colors = require('colors');
var inquirer = require('inquirer');
var _ = require('lodash');
var Router = require('./router');
var hasten = require('./util/hasten');
var jtf = hasten.jsonToFolder;

var path = require('path');
var dive = require('dive');
var vendor = 'vendor';

module.exports = {
    init: init,
    standard: standardAction,
    check: checkPlugins,
    reorder: reorderPlugins,
    rename: renameFolders,
    existing: existingProject
}

function init() {
    var msg = "==================\n" +
        "Welcome to hasten!\n" +
        "==================";

    var router = new Router({
        lib: fs.realpathSync(__dirname)
    });

    // welcome to hasten msg
    console.log(msg.bold.white);

    // states and choosing
    router.registerRoute('home', require('./routes/home'));
    router.registerRoute('buildrunnerExist', require('./routes/buildrunnerExist'));
    router.registerRoute('hastenExist', require('./routes/hastenExist'));
    router.registerRoute('chooseFw', require('./routes/chooseFramework'));
    router.registerRoute('custom', require('./routes/custom'));
    router.registerRoute('chooseBuild', require('./routes/chooseBuild'));
    router.registerRoute('postinstall', require('./routes/postinstall'));
    router.registerRoute('existing', require('./routes/existing'));

    // folder structure
    router.registerRoute('default', require('./routes/default'));
    router.registerRoute('customize', require('./routes/customize'));
    router.registerRoute('exit', require('./routes/exit'));

    process.once('exit', router.navigate.bind(router, 'exit'));

    router.navigate('home');
}

/**
 * create the base with standard settings
 * cares about the local hasten.json file
 */
function standardAction() {
    hasten.base.create();
}

function existingProject() {
    // todo check if there is a project
    // todo check where js files are
    // todo check where scss/css files are
    // todo check if vendor files are inside
}

/**
 * Checks for plugins in the src dir. The src dir is by default "src", but if
 * in the hasten.json in .names.src is another value. It will be overwritten.
 */
function checkPlugins(checkFile) {
    var filteredPlugins;
    var detectedPlugins = new Array();
    var diveDir = 'src';
    var count = 0;
    var hstnFile = hasten.file.readJsonToObj(path.join(process.cwd(), 'hasten.json'));
    var keywordList = [
        "jquery",
        "bootstrap",
        ".min.js",
        ".min.css"
    ];

    // add keywords from "vendorKeywords" in hasten.json
    if (!!hstnFile.vendorKeywords) {
        for (var newKeyword of hstnFile.vendorKeywords) {
            keywordList.push(newKeyword);
        }
    }

    // check if second parameter in shell is set
    if (typeof checkFile === 'object' && checkFile.length !== 0) {
        keywordList = checkFile;
    }

    // overwrite some config if local hasten is found
    if (hasten.file.existsLocalHasten()) {
        // local hasten found
        var hastenFile = hasten.file.readJsonToObj(path.join(process.cwd(), 'hasten.json'));

        diveDir = hastenFile.names.src;
    }

    // dive through folders - https://www.npmjs.com/package/dive
    dive(path.join(process.cwd(), diveDir), function(err, file) {
        if (err) {
            console.log('Cannot find '.red + diveDir.red.bold + ' directory'.red);
            return;
        }

        // detect if the path has an index of the
        // keywordList, then push it to new array
        for (var keyword of keywordList) {
            if (file.indexOf(keyword) > -1) {
                detectedPlugins.push(file);
            }
        }
    }, function() { // done
        // fail, if no plugins are detected
        if (detectedPlugins.length === 0) {
            _showFileInConsole(keywordList, 'preset keywords, but no plugins detected:');
            return;
        } else {
            _showFileInConsole(keywordList, 'preset keywords:');
        }

        // filter all duplicates
        filteredPlugins = detectedPlugins.filter(function(elem, pos) {
            return detectedPlugins.indexOf(elem) === pos;
        });

        // start asking for renaming files
        _showFileInConsole(filteredPlugins, 'file(s) detected');

        // ask moving
        inquirer.prompt({
            type: 'checkbox',
            name: 'order',
            message: 'Exclude choosen files!',
            choices: filteredPlugins
        }, function(answers) {

            //get pathnames which are not moved
            for (var pluginValue of filteredPlugins) {
                // get exluded pathnames
                for (var excludedValue of answers.order) {
                    if (pluginValue === excludedValue) {
                        // filter pathnames which should not be moved
                        filteredPlugins = filteredPlugins.filter(function(elem) {
                            return elem !== excludedValue;
                        });
                    }
                }
            }

            // move every not choosen file
            for (var pluginValue of filteredPlugins) {
                // moving files to ./vendor
                fs.move(pluginValue, './' + vendor + '/' + path.basename(pluginValue), function(err) {
                    if (err) {
                        console.log('Error: ' + err);
                        return;
                    }
                });
            }

            if (filteredPlugins.length === 0) {
                console.log('No plugins to move'.red.bold);
                return;
            }

            _showFileInConsole(filteredPlugins, 'file(s) moved');
            _askReorder(filteredPlugins);
        });
    });
}

/**
 * function to reorder files in the ./vendor dir
 */
function reorderPlugins() {

    var basenameArray = new Array();
    var filenameArray = new Array();
    var isFolder = true;

    dive(path.join(process.cwd(), vendor), function(err, file) {
        if (err) {
            console.error('No '.red + 'vendor'.bold.red + ' directory found'.red);
            isFolder = false;
            return;
        }

        var basename;
        var splitBase;
        var unorderFile;

        basename  = path.basename(file);
        splitBase = basename.split('-');

        // file like 10-jquery.js turn to jquery.js
        // deletes {Number}- from every file in dir
        // and join them back into normal file name
        unorderFile = splitBase.filter(function(elem, index) {
            if (index === 0) {
                if (parseInt(elem)) {
                    elem = '';
                }
            }

            return elem;
        }).join('-');

        basenameArray.push(unorderFile);
        filenameArray.push(basename);

    }, function() { //done
        _showFileInConsole(basenameArray, 'file(s) for reordering found');

        if (basenameArray.length === 0) return;

        _resetVendorFileNames(basenameArray, filenameArray);
        _askReorder(basenameArray);
    });
}

/**
 * For renaming all the folders which are generated by hasten and relevant by Gruntfile
 */
 // todo logic is right. But jsonToFolder and file-helper are no new Objects.
function renameFolders() {
    console.log('Not available yet...');
    return;

    // var hastenFile;
    // var oldPaths;
    // var newPaths;
    // var test;
    // var questions = new Array();

    // if (!hasten.file.existsLocalHasten()) {
    //     console.log('Error: no local hasten found');
    // }

    // hastenFile  = hasten.json.readToObjSync(path.join(process.cwd(), 'hasten.json'));
    // oldPaths    = hasten.json.toPath(hastenFile.scaffold);

    // // create new questions
    // for (var key in hastenFile.names) {
    //     var newInputField = new Object();

    //     newInputField.type      = 'input';
    //     newInputField.name      = key;
    //     newInputField.message   = 'New ' + key;
    //     newInputField.default   = hastenFile.names[key];
    //     // values.value = key;

    //     questions.push(newInputField);
    // }

    // inquirer.prompt(questions, function (answers) {
    //     var newComparedScaffold = hasten.file.compareJson(hastenFile.scaffold, answers);
    //     var newPaths = hasten.json.toPath(newComparedScaffold);

    //     if (newPaths.length === oldPaths.length) {
    //         for (var pathIndex in newPaths) {
    //             fs.rename(path.join(process.cwd(), oldPaths[pathIndex]), path.join(process.cwd(), newPaths[pathIndex]), function (err) {
    //                 // console.log(err);
    //                 if (err) {
    //                     switch (err.code) {
    //                         case 'ENOENT':
    //                         break;

    //                         case 'EPERM': console.log('To rename this folder, close all programs which are using this directory.\n' + err);
    //                         break;
    //                     }
    //                 }
    //             });
    //         }
    //     }


    //     // start renaming

    //     // test = hasten.file.createRenamedFolders(hastenFile.scaffold, hastenFile.names);
    //     // console.log(ganzneu);
    // });

    // return;
}

/**
 * private function
 * reset filenames in vendor from 1-vendorName into vendorName
 *
 * @private
 *
 * @param {Object} basenameArray
 * @param {Object} filenameArray
 */
function _resetVendorFileNames(basenameArray, filenameArray) {
    // rename files without order
    for (var index in basenameArray) {
        fs.renameSync(path.join('.', vendor, path.basename(filenameArray[index])), path.join('.', vendor, path.basename(basenameArray[index])));
    }
}

/**
 * private function
 * Inquirer prompt which ask the order of the ./vendor files
 *
 * @private
 *
 * @param arr {Array}
 */
function _askReorder(arr) {
    // ask sorting
    inquirer.prompt({
        type: 'input',
        name: 'order',
        message: 'Please type in your order\n' +
                 '  e.g. 3,10 (Number 3 loads\n'+
                 '  first, then 10, and rest)\n',
        choices: arr
    }, function(answers) {

        var sortArray,
            parsedNumber;

        sortArray = answers.order.split(',');

        var count = 1;
        for (var number of sortArray) {
            var chosenObj = arr[number-1];

            parsedNumber = parseInt(number);

            // if this index exist
            if (chosenObj !== undefined) {

                fs.rename(path.join('.', vendor, path.basename(chosenObj)), path.join('.', vendor, count + '-' + path.basename(chosenObj)), function(err) {
                    if (err) {
                        console.log(err);
                    }
                });

                count++;
            }
        }
    });
}

/**
 * private function
 * Show how much files are found
 *
 * @private
 *
 * @param arr        {Array}  Array of paths
 * @param textAdding {String}
 */
function _showFileInConsole(arr, textAdding) {
    // what if textAdding is undefined
    textAdding = textAdding === undefined ? 'file(s) found' : textAdding;

    // console.log for layout purposes
    console.log();
    console.log();
    console.log(arr.length + ' ' + textAdding);
    console.log('==================');

    var count = 1;
    for (var key of arr) {
        console.log(count + ') ' + path.basename(key).green);
        count++;
    }

    console.log('==================');
}
