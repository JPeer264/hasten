'use strict';

var inquirer = require('inquirer');
var _ = require('lodash');
var fs = require('fs-extra');
var path = require('path');
var hasten = require('../util/hasten');
var cli = require('../cli');

module.exports = function (app) {
    var dir;
    var dirs;
    var defaultChoices = [];
    var msg;

    // check if there are some files in the dir
    defaultChoices.push({
        name: "Make a new project",
        value: "chooseFw"
    }, new inquirer.Separator(), {
        name: "Install / Remove frameworks",
        value: "install",
    }, {
        name: "Check your current project for vendor files",
        value: "check",
    }, {
        name: "Reorder your vendor files",
        value: "reorder",
    });

    inquirer.prompt([{
        name: "whatsnext",
        type: 'list',
        message: 'Choose your action!',
        choices: _.flatten([
                new inquirer.Separator(),
                defaultChoices,
                new inquirer.Separator()
            ])
        }], function (answer) {
            if (hasten.file.existsLocalHasten() && answer.whatsnext === 'chooseFw') {
                app.navigate('hastenExist');
                return;
            }

            switch (answer.whatsnext) {
                case "check": cli.check(); return;
                break;

                case "install": hasten.install.ask(app); return;
                break;

                case "reorder": cli.reorder(); return;
                break;
            }

            app.navigate(answer.whatsnext);
        }
    );
}