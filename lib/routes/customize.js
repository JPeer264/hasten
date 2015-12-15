'use strict';

    // load external modules
var inquirer = require('inquirer'),
    colors = require('colors'),
    extend = require('extend'),
    path = require('path'),
    fs = require('fs-extra'),

        // load internal modules
    hasten = require('../util/hasten'),
    file = hasten.file,
    jtf = hasten.jsonToFolder;

module.exports = function (app) {
    // combine names
    // dynamic generate questions for inquirer
    var chosenFramework   = app.hasten.framework;
    var loadFrameworkJson = file.readJsonToObj(path.join(hasten.paths.framework, chosenFramework, 'hasten.json'));
    var loadStandardJson  = file.readJsonToObj(hasten.paths.defaultHstn);
    var combinedNames    = extend(true, loadStandardJson.names, loadFrameworkJson.names);
    var questionsArray = new Array();

    // generate new questions out of all
    // 'names' in the combined json file
    for (var keyName in combinedNames) {
        var newQuestion = new Object();
        var type = 'input';
        var msg  = 'Name your ' + keyName + ' directory!';

        // if value is a boolean, change the default values
        if (typeof combinedNames[keyName] === 'boolean') {
            type = 'confirm';
            msg = 'You want use a seperate ' + keyName + ' directory?';
        }

        // generate new question fields
        newQuestion.type = type;
        newQuestion.name = keyName;
        newQuestion.message = msg;
        newQuestion.default = combinedNames[keyName];
        newQuestion.validate = function(value) {
            if (value.indexOf(' ') >= 0) {
                return 'Please do not type whitespaces.';
            }

            return true;
        };

        questionsArray.push(newQuestion);
    }

    inquirer.prompt(questionsArray, function (answers) {
        // var answers = {src: 'sourrce', dest: 'distance', assets: true}; // exampleData
        var objectAddings = {};
        var combinedJson;
        var replacedNames = file.replaceNames(answers);

        objectAddings.names = replacedNames;
        hasten.base.config(app.hasten);
        combinedJson = hasten.base.getCombinedScaffold();

        // combine local hasten with answers
        objectAddings.scaffold = file.createRenamedFolders(combinedJson.scaffold, replacedNames);

        // add new config data
        hasten.base.add(objectAddings);
        hasten.base.create();
    });
}