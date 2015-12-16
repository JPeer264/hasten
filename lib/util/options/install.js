'use strict';

var fs = require('fs-extra');
var path = require('path');
var exec = require('child_process').exec;
var glob = require('glob');
var colors = require('colors');
var inquirer = require('inquirer');
var _ = require('lodash')
var npmKeyword = require('npm-keyword');
var hasten = require('../hasten');

var app;

/**
 * @module installGlobal
 *
 * every return value is a boolean
 */
module.exports = {
    ask: ask,
    showInstalled: showInstalledFrameworks
}

/**
 * asks what you want to do
 */
function ask(_app) {
    var defaultChoices = [{
            name: "Search and install global frameworks",
            value: true
        }, {
            name: "Remove installed frameworks",
            value: false
        }, new inquirer.Separator(), {
            name: "Back",
            value: 'back'
    }];

    // globalize app
    app = _app;

    inquirer.prompt([{
        name: "whatsnext",
        type: 'list',
        message: 'Framework env',
        choices: _.flatten([
                new inquirer.Separator(),
                defaultChoices,
                new inquirer.Separator()
            ])
        }], function (answer) {
            if (answer.whatsnext === 'back') {
                app.navigate('home');
                return;
            }

            listFrameworks(answer.whatsnext);
        }
    );
}

function showInstalledFrameworks() {
    var localModules = fs.readdirSync(hasten.paths.framework);
    var localModuleList = [];
    var msg = 'There is 1 Framework installed';

    if (localModules.length === 0) {
        console.log('No installed frameworks.');
        return;
    }

    if (localModules.length > 1) {
        msg = 'There are ' + localModules.length + ' Frameworks installed:';
    }

    console.log('');
    console.log(msg);

    // check all local frameworks
    for (var dirName of localModules) {
        console.log('- ' + dirName.green);
    }
}

/**
 * list all frameworks
 *
 * @param isInstall {Boolean} true for install new frameworks, false for delete installed frameworks
 *
 * @todo also check local modules
 * @todo check
 */
function listFrameworks(isInstall) {
    var pathToGlobalModules = path.join(process.env.APPDATA, 'npm/node_modules');
    var globalModules = fs.readdirSync(pathToGlobalModules);
    var localModules = fs.readdirSync(hasten.paths.framework);
    var result = [];
    var localModuleList = [];
    var msg = isInstall ? 'Install' : 'Remove';

    // check all local frameworks
    for (var dirName of localModules) {
        localModuleList.push(dirName);

        if (!isInstall) {
            result.push({
                name: dirName,
                value: path.join(hasten.paths.framework, dirName)
            });
        }
    }

    // check all global frameworks, wheter installed or not
    searchGlobalModules:
    for (var dirName of globalModules) {
        var frameworkName = dirName.substr(7);

        if (dirName.indexOf('hasten-') > -1) {
            for (var localDirName of localModuleList) {
                if (localDirName === frameworkName || !isInstall) {
                    // break if the local framework name already exist
                    break searchGlobalModules;
                }
            }

            // if it is a directory
            result.push({
                name: frameworkName,
                value: path.join(pathToGlobalModules, dirName)
            });
        }
    }

    if (isInstall && result.length === 0) {
        console.log('No new frameworks to install.');
        return;
    } else if (!isInstall && localModules.length === 0) {
        console.log('Install frameworks first.');
        return;
    }

    result.push(new inquirer.Separator(), {
        name: 'Back',
        value: 'back'
    })

    inquirer.prompt([{
        name: "path",
        type: 'list',
        message: msg + " a framework",
        choices: _.flatten([
                new inquirer.Separator(),
                result,
                new inquirer.Separator()
            ])
        }], function (answer) {
            if (answer.path === 'back') {
                ask(app);
                return;
            }

            if (isInstall) {
                install(answer.path);
            } else {
                remove(answer.path);
            }
        }
    );
}

/**
 * install global installed frameworks into hasten dir
 *
 * @param pathName {String} path of a framework
 */
function install(pathName) {
    fs.copySync(pathName, path.join(hasten.paths.framework, path.basename(pathName).substr(7)));
}

/**
 * remove frameworks from hasten dir
 *
 * @param pathName {String} path of a framework
 */
function remove(pathName) {
    fs.removeSync(pathName);
}
