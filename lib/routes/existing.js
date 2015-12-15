'use strict';

var inquirer = require('inquirer');
var _ = require('lodash');
var hasten = require('../util/hasten');

module.exports = function (app) {
    // todo ask if all files are in the assets folder
    // todo ask if user is using framework such as angular
    // todo ask if the user uses any vendors -> hasten check

    var msg = framework === '' ? 'You chose no framework.' : 'You chose the framework: ' + framework;
    var defaultChoices = [{
            name: "Default",
            value: "default"
        }, {
            name: "Customize",
            value: "customize",
        }, {
            name: "Back",
            value: "home"
    }];

    inquirer.prompt([{
        name: "whatsnext",
        type: 'list',
        message: msg,
        choices: _.flatten([
                new inquirer.Separator(),
                defaultChoices,
                new inquirer.Separator()
            ])
        }], function (answer) {
            app.navigate(answer.whatsnext);
        }
    );
}