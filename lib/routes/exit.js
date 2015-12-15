'use strict';

var colors = require('colors');

module.exports = function() {
    console.log('\nByeBye, see you soon!'.bold.white);
    process.exit();
}