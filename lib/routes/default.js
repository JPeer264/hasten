'use strict';

var hasten = require('../util/hasten');
var spawn = require('child_process').execSync;

module.exports = function (app) {
	// place files into workingdirectory
	hasten.base.config(app.hasten);
    hasten.base.create();
}
