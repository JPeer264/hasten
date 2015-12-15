'use strict';

var inquirer = require('inquirer');
var _ = require('lodash');
var fs = require('fs-extra');
var path = require('path');
var hasten = require('../util/hasten');

module.exports = function (app) {
    var dir;
    var dirs;
    var defaultChoices;
    var msg;

    // initialize list
    defaultChoices = [{
        name: "No Framework",
        value: "noframework"
    }];

    // get all directories
    dirs = fs.readdirSync(hasten.paths.framework).filter(function(file) {
        return fs.statSync(path.join(hasten.paths.framework, file)).isDirectory();
    });

    // add new list targets
    for (dir of dirs) {
        defaultChoices.push({
            name: dir.substr(0,1).toUpperCase() + dir.substr(1),
            value: dir
        })
    }

    // add the back button at the end
    defaultChoices.push(new inquirer.Separator(), {
        name: 'Back',
        value: 'home'
    });

    inquirer.prompt([{
        name: "whatsnext",
        type: 'list',
        message: "Choose your framework",
        choices: _.flatten([
                new inquirer.Separator(),
                defaultChoices,
                new inquirer.Separator()
            ])
        }], function (answer) {
            if (answer.whatsnext === 'home') {
                app.navigate('home');
                return;
            }

            app.hasten['framework'] = answer.whatsnext === "noframework" ? "" : answer.whatsnext;
            hasten.base.hasten.framework = answer.whatsnext === "noframework" ? "" : answer.whatsnext;

            app.navigate('postinstall');
        }
    );
}