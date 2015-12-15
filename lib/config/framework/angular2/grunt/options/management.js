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
 *   ** html2js  <- 4 angularJS. Make own module for all components
 */
module.exports = {
	concat: {
		js: {
			options: {
				process: function(src, filepath) {
					// TODO replace use strict
					var filename = filepath.split('/').pop();
					var wrapper;

					if (filename.indexOf('angular') > 0) {
						wrapper = 	(filepath.indexOf('_intro') === -1 ? ";(function( window, angular, undefined ){ \n 'use strict';\n\n":"") +
										src +
									(filepath.indexOf('_intro') === -1 ? "\n\n}( window, angular ));":"");
					} else {
						wrapper = src;
					}

			  		return "// Source: " + filepath + "\n" +
			  				wrapper
				},
			},
		},
		vendor: {
			options: {
				banner: 'window.angular = {};\n' +
						'window.module = {};\n'
			},
		},
		// concat all angular files
		app: {
			options: {
				process: function(src, filepath) {
					return "// Source: " + filepath + "\n" +
			  				(filepath.indexOf('_intro') === -1 ? ";(function( window, angular, undefined ){ \n 'use strict';\n\n":"") +
								src +
							(filepath.indexOf('_intro') === -1 ? "\n\n}( window, angular ));":"");
				}
			},
			files: [{
				src: [
					'<%= paths.src.files.angular.all %>',
					'<%= paths.tmp.folder.assets.js %>/template.js',
					'<%= paths.src.folder.assets.appjs %>'
				],
				dest: '<%=paths.tmp.folder.assets.js %>/app.js'
			}]
		},
	},

	bower_concat: {
		all: {
				process: function(src) {
				"\n" +
				";(function( window, angular, undefined ){ \n 'use strict';\n\n" +
					src +
				"\n\n}( window, angular ));"
			},
		}
	},

	html2js: {
		options: {
			htmlmin: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				removeEmptyAttributes: true,
				collapseBooleanAttributes: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
			},
			module: '<%= pkg.name %>.templates',
			singleModule: true,
		},
		template: {
			src:  '<%= paths.src.files.angular.html %>',
			dest: '<%= paths.tmp.folder.assets.js %>/template.js',
		},
	}
};