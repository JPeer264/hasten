'use strict';

var colors = require('colors'),
    inquirer = require('inquirer'),
    hasten = require('../util/hasten'),
    file = hasten.file,
    jtf = hasten.jsonToFolder,
    paths = hasten.paths;

module.exports = function (app) {

    var questions = [
        {
            type: "input",
            name: "src",
            message: "Name your working directory!",
            default: "src"
        },
        {
            type: "input",
            name: "dest",
            message: "Name your destination directory!",
            default: "dist"
        },
        {
            type: "confirm",
            name: "assets",
            message: "You want use a seperate assets folder?"
        }
    ];

    inquirer.prompt(questions, function (answers) {
        // todo choose from different builds
    });
}