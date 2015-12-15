'use strict';

var path = require('path');
var colors = require('colors');
var inquirer = require('inquirer');
var hasten = require('../util/hasten');

module.exports = function (app) {

    var msg = "================================\n"+
            "  Local hasten file exists.\n".red +
            "  You want to create the project\n"+
            "  based on the local hasten file?\n"+
            "  ================================";

    var questions = [
        {
            type: "confirm",
            name: "localBased",
            message: msg
        }
    ];

    inquirer.prompt(questions, function (answers) {
        if (answers.localBased) {
            if (hasten.file.exists(path.join(process.cwd(), 'Gruntfile.js'))) {
                app.navigate('buildrunnerExist', true);
                return;
            }
            hasten.base.create();
        } else {
            if (hasten.file.exists(path.join(process.cwd(), 'Gruntfile.js'))) {
                app.navigate('buildrunnerExist');
                return;
            }
            app.navigate('chooseFw');
        }
    });
}