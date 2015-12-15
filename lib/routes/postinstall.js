'use strict';

var inquirer = require('inquirer');
var path = require('path');
var _ = require('lodash');
var hasten = require('../util/hasten');

module.exports = function (app) {
    var combinedHasten = hasten.base.getCombinedScaffold();
    var choices = new Array();

    // add ask, combined from all relevant hasten files
    for (var askObject of combinedHasten.ask) {
        var newQuestion = new Object();

        newQuestion.type = 'confirm';
        newQuestion.message = askObject.message;
        newQuestion.name = askObject.command;
        newQuestion.default = askObject.default !== undefined || true;

        choices.push(newQuestion);
    }

    inquirer.prompt(choices, function (questions) {
        var cmds = [];

        // check if there are true values
        // commands with false values shouldnt be installed
        for (var commandKey in questions) {
            if (questions[commandKey]) {
                cmds.push(commandKey);
            }
        }

        // add for later installation in ../util/options/base.js
        hasten.base.postinstall = cmds;

        app.navigate('custom');
    });
}