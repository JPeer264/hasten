'use strict';

var path = require('path');
var colors = require('colors');
var inquirer = require('inquirer');
var hasten = require('../util/hasten');

module.exports = function (app, isStandardInstallation) {

    var msg = "====================================\n"+
            "  Local buildrunner exists.\n".red +
            "  If you continue, your buildrunner\n" +
            "  and its settings will be overwritten\n" +
            "  ====================================";

    var questions = [
        {
            type: "confirm",
            name: "localBased",
            default: true,
            message: msg
        }
    ];

    inquirer.prompt(questions, function (answers) {
        if (isStandardInstallation) {
            hasten.base.create();
            return;
        }

        if (!answers.localBased) {
            app.navigate('home');
        } else {
            app.navigate('chooseFw');
        }
    });
}