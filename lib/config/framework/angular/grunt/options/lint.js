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
module.exports = {
	validation: {
		// todo angular path
		angular: {
			options: {
				wrapfile: './config/validation/html5-wrapper.html'
			},
			src: '<%= paths.src.files.angular.html %>'
		}
	},
}