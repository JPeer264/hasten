var jitMappings = {
	removelogging: 'grunt-remove-logging',
	validation: 'grunt-html-validation',
	mocha: 'grunt-mocha-phantom-istanbul',
	json2js: 'grunt-angular-json2js',
	instrument: 'grunt-istanbul',
	scsslint: 'grunt-scss-lint',
};

module.exports = function(grunt) {
	// see how long each task need
	require('time-grunt')(grunt);

	function loadConfig(path) {
		var glob = require('glob');
		var object = {};
		var key;

		glob.sync('*', {cwd: path}).forEach(function(option) {
			// key = option.replace(/\.js$/,'');
			object = grunt.util._.extend(object, require(path + option));
		});

		return object;
	}

	grunt.config.init({
		// paths for easier maintenance
		pkg: grunt.file.readJSON('package.json'),
		hstn: grunt.file.readJSON('hasten.json'),
        {pathList}
/*
 * @start Code checking
 *
 * @dev
 *
 * @used plugins
 *   ** eslint
 *   ** jsinspector
 *   ** csslint
 **  ** html-validation
 */

// see ./config/grunt/lint.js


/*
 * @start Managing Files
 *
 * @prod
 *
 * @used plugins
 *   ** concat   <- merges all files together
 *   ** sass     <- convert from `scss` to `css`
 *   ** clean    <- delete folder and files
 *   ** copy     <- copy files from one dir to another
 *   ** cdnify   <- rewrite HTML files from *.css to *.min.css or *.js
 *   ** html2js  <- 4 angularJS. Make own module for all component
 *   ** jsdoc    <- generates documentation for js-Files
 */

// see ./config/grunt/management.js


/*
 * @start Filesize reducing, optimization and remove junk
 *
 * @prod
 *
 * @used plugins
 *   ** autoprefixer   <- add prefixes for every browser
 *   ** removelogging  <- remove `console.*` in all js files
 *   ** imagemin       <- reduces file size of `img` files
 *   ** cssmin         <- minification of `.css` to `.min.css`
 *   ** uglify         <- minification of `.js` to `.min.js`
 */

// see ./config/grunt/optimization.js


/*
 * @start Testing
 *
 * @dev
 *
 * @used plugins
 *   ** instrument  <- instrument `js` files for coverage reports
 *   ** mocha       <- runs the tests
 */

// see ./config/grunt/tests.js


/*
 * @start Development Helpers
 *
 * @dev
 *
 * @used plugins
 *   ** watch       <- watches tasks for development
 *   ** connect     <- make a HTTP server for developing or test results
 *   ** php         <- make a PHP  server for developing or test results
 *   ** browserSync <- updating server after changing files
 */

// see ./config/grunt/helpers.js

	}); // grunt.initConfig END

// merge tasks in config folder with this grunt file
// all options in the subdirectory are now available
grunt.config.merge(loadConfig('./config/grunt/options/'));

/*
 * @start tasks
 *
 * * helpers
 *   ** default
 *   ** force:on
 *   ** force:off
 *   ** manageScssFolder
 *
 * * manage
 *   ** manage
 *   ** manage:js
 *   ** manage:sass
 *
 * * minify
 *   ** minify
 *   ** minify:js
 *   ** minify:app
 *   ** minify:css
 *
 * * lint
 *   ** lint:dev
 *   ** lint:reports
 *   ** lint:ci
 *
 * * tests
 *   ** test:dev
 *   ** test:reports
 *   ** test:ci
 *
 * * reports
 *   ** reports
 *
 * * build
 *   ** build:prod
 *   ** build:dev
 */

	/*
	 * @tasks helpers
	 * :on, :off
	 *
	 * enable the force during another tasks
	 */
	grunt.registerTask('force:on',
		'force the force option on if needed',
		function() {
			if ( !grunt.option( 'force' ) ) {
				grunt.config.set('usetheforce_set', true);
				grunt.option( 'force', true );
			}
		}
	);

	grunt.registerTask('force:off',
		'turn force option off if we have previously set it',
		function() {
			if ( grunt.config.get('usetheforce_set') ) {
				grunt.option( 'force', false );
			}
		}
	);

	/**
	 * Concat every scss file in a subdirectory of src/assets/scss/
	 * every folder in scss becomes a own css file. E.g. scss/ie8/* -> css/ie8.css
	 */
	grunt.registerTask('manageScssFolders', "Finds and prepares scss files into .tmp/css folder for concatenation.", function() {
		var hstnNames = grunt.file.readJSON('hasten.json').names;

		// get all module directories
		grunt.file.expand('./' + hstnNames.src + '/' + hstnNames.assets + '/scss/*').forEach(function (dir) {
			var dirName;

			// delete if no indexOf browser.
			if (dir.indexOf('browser.') === -1) {
				dir = '';
			}

			dirName = dir.substr(dir.lastIndexOf('.')+1);

			// get the current concat object from initConfig
			var sass   = grunt.config.get('sass')   || {};
			var concat = grunt.config.get('concat') || {};
			var clean  = grunt.config.get('clean')  || {};

			// create a subtask for each module, find all src files
			// and combine into a single js file per module
			if (dir !== '') {
				// all necessary scss files are now in .sass-cache/assets/scss/DIR/*.scss
				console.log(dirName);
				concat[dirName] = {
					src:  [
						dir + '/**/*.scss',
						'!' + dir + '/**/_*.scss',
					],
					dest: dir + '/'+ dirName + '.GruntGenerated.scss'
				};

				sass[dirName] = {
					src:  dir + '/' + dirName + '.GruntGenerated.scss',
					dest: '<%= paths.tmp.folder.assets.css %>/' + dirName + '.css'
				};

				clean[dirName] = {
					src: dir + '/' + dirName + '.GruntGenerated.scss'
				};

				// add module subtasks to the concat task in initConfig
				grunt.config.set('concat', concat);
				grunt.config.set('sass', sass);
				grunt.config.set('clean', clean);

				// run all task which are generated before
				grunt.task.run('concat:' + dirName,'sass:' + dirName, 'clean:' + dirName);
			}
		});
	});

	require('et-grunt')(grunt, {
        {taskList}
    }, jitMappings);
}
