'use strict';

var inquirer = require('inquirer');
var _ = require('lodash');
var hasten = require('../util/hasten');

module.exports = function (app) {
	var framework = app.hasten.framework;
	var msg = framework === '' ? 'You chose no framework.' : 'You chose the framework: ' + framework;
	var defaultChoices = [{
            name: "Default",
            value: "default"
        }, {
            name: "Customize",
            value: "customize",
        }, new inquirer.Separator(), {
            name: "Back",
            value: "chooseFw"
    }];

	inquirer.prompt([{
		name: "whatsnext",
		type: 'list',
		message: msg + '\n  Default folderstructure or a custom one?',
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