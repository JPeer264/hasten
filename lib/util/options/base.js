'use strict';

var fs     = require('fs-extra');
var path   = require('path');
var colors = require('colors');
var extend = require('extend');
var glob   = require('glob');
var spawn = require('child_process').spawn;

// own modules
var hasten = require('../hasten');
var dir    = process.cwd();

/**
 * (require(hasten)).base
 *
 * @module base
 */
exports = module.exports = new Base();
/**
 */
function Base() {
    this.hasten        = hasten.file.readJsonToObj(hasten.paths.defaultHstn);
    this.confHstn      = this.hasten;
    this.hstnName      = 'hasten.json';
    this.fwJsonContent = null;
    this.existingHstn  = {};
    this.names         = {};
};

/**
 * Initialize config data
 *
 * @alias module:base.config
 *
 * @param {Object} conf
 */
Base.prototype.config = function config(conf) {
    this.confHstn      = conf === undefined ? this.hasten : conf;
    this.fwJsonContent = conf.framework === '' ? null : hasten.file.readJsonToObj(path.join(hasten.paths.framework, '/' + conf.framework + '/hasten.json')); 
};

/**
 * Create a new file if there is no existing one
 * Manage "hasten.json", "buildrunner" and the "package.json"
 *
 * @alias module:base.create
 */
Base.prototype.create = function create() {
    // TODO check before move if framework exist !!!
    var pathname = path.join(dir, this.hstnName);
    var combinedHstn = this.getCombinedScaffold();
    var hstnMerged = JSON.stringify(combinedHstn, null, '\t');

    // ==================
    // Manage hasten.json
    // ==================
    // check if hasten file exists
    if(hasten.file.exists(pathname)) {

        // TODO stoecjan: rename folders !!! or copy files if the value is empty now

        // var shellNames = this.confHstn.names;
        // this.existingHstn = file.readJsonToObj(pathname);
        // file.renameFolders(this.existingHstn.scaffold, shellNames);

        // // compare names if they are not the same -> rename
        // // if empty create or copy

        fs.writeFileSync(dir + '/' + this.hstnName, hstnMerged);
        console.log('Successful updated '.green + this.hstnName.bold.green + '!'.green );

    } else {
        hasten.json.createSync(dir, this.hstnName, hstnMerged);
        console.log('Successful created '.green + this.hstnName.bold.green + '!'.green );
    }

    this.moveCopyFolder();

    // BUILDRUNNER | copy the buildrunner.js to the working dir
    // TODO add route.navigate to are you sure to overwrite this gruntfile or not ?
    hasten.buildrunner.add({
        buildrunner: 'grunt',
        config: ['lists', 'options'],
        framework: this.confHstn.framework
    });

    // add the package.json
    this.addPackage();

    // create folders
    hasten.jsonToFolder.create((this.getCombinedScaffold()).scaffold);
}; // create


/**
 * Return the combined hasten file
 *
 * @alias module:base.getCombinedScaffold
 *
 * @return {Object} this.hasten - combined hasten file
 */
Base.prototype.getCombinedScaffold = function getCombinedScaffold() {
    var pathname = path.join(dir, this.hstnName);
    var jsonContent;
    var result;

    // check if local hasten exist
    if(hasten.file.exists(pathname)) {
        // exist - read it and save it
        jsonContent = hasten.json.readToObjSync(pathname);
    } else {
        jsonContent = null;
    }

    if (this.hasten.framework !== '') {
        this.fwJsonContent = hasten.json.readToObjSync(path.join(hasten.paths.framework, this.hasten.framework, 'hasten.json'));
    }

    // combine files
    // Order:
    //    1. Default hasten (saved one in /lib/config/hasten-default.json)
    //    2. Chosen Framework hasten (saved one in /lib/config/framework/< chosenFramework >/hasten.json)
    //    3. Local and saved Hasten (in the working directory)
    //    4. Folder names typed in in the console (shell)
    this.hasten = extend(true, this.hasten, this.fwJsonContent, jsonContent, this.confHstn);

    result = this.hasten;
    result.scaffold = hasten.file.createRenamedFolders(result.scaffold, result.names);

    return result;
};

/**
 * add a new json to the current config
 *
 * @alias module:base.add
 *
 * @param {Object} jsonAdding
 */
Base.prototype.add = function add(jsonAdding) {
    var bufferHstn = this.confHstn;

    this.confHstn = extend(true, bufferHstn, jsonAdding);
};

/**
 * searches for the normal copy folder in "{taskrunner}/copy"
 * searches for copy folder in "framework/{framework}/grunt/copy"
 * and copy them to process.cwd() // homedirectory
 *
 * @alias module:base.moveCopyFolder
 */
Base.prototype.moveCopyFolder = function moveCopyFolder() {
    var frameworkCopyFolder = path.join(hasten.paths.framework, this.confHstn.framework, 'grunt/copy');

    // copy necessary files to the working dir from taskrunner
    fs.copySync(hasten.paths.copy, dir);

    // copy the files from choosen framework
    if (fs.existsSync(frameworkCopyFolder)) {
        fs.copy(frameworkCopyFolder, dir, function(err) {
            if (err) console.log(err);
        });
    }
}

/**
 * add the right package.json - merges also from {framework}/{taskrunner}/package.json
 *
 * @alias module:base.addPackage
 */
Base.prototype.addPackage = function addPackage() {
    // PACKAGE.JSON | check if local package.json exist
    // if (!hasten.file.exists(path.join(dir, 'package.json')) || false) {
    //         console.log('test');
    //     // do not exist - create one
    //     fs.copy(hasten.paths.gruntPackage, path.join(dir, 'package.json'), function(err) {
    //         if (err) {
    //             console.error(err);
    //             return;
    //         }

    //         console.log('Successful created'.green + ' package.json'.bold.green + '!'.green);
    //     });

    // } else {
        // do exist - update with chosen taskrunner package.json // now gruntPackage
        var localPackage = hasten.file.readJsonToObj(path.join(dir, 'package.json'));
        var gruntPackage = hasten.file.readJsonToObj(hasten.paths.gruntPackage);
        var frameworkPackage = hasten.file.readJsonToObj(path.join(hasten.paths.framework, this.hasten.framework, 'grunt/package.json'));
        var result       = JSON.stringify(extend(true, localPackage, gruntPackage, frameworkPackage), null, '\t');
        var self = this;

        fs.writeFile(path.join(dir, 'package.json'), result, 'utf8', function(err) {
            if (err) {
                console.error(err);
                return;
            }

            console.log('Successful updated'.green + ' package.json'.bold.green + '!'.green);

            // shell execution
            if (self.postinstall !== undefined && self.postinstall.length > 0) {
            console.log('\nRun ' + ((self.postinstall).join(' & ')).bold.red + ' in terminal');
                // solution windows http://stackoverflow.com/questions/33141736/change-from-child-process-exec-to-spawn-dont-work
                var execthis = spawn('cmd', ['/c', (self.postinstall).join(' & ')]);

                execthis.stdout.on('data', function (data) {
                  console.log('' + data);
                });

                execthis.stderr.on('data', function (data) {
                  console.log('' + data);
                });

                execthis.on('close', function (code) {
                  console.log('child process exited with code ' + code);
                });
            }
        });

    // }
};
