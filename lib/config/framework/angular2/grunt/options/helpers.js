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
module.exports = {
    watch: {
        // watch concat files
        app: {
            files: [
                '<%= paths.src.allFiles.js %>',
                '!<%= paths.src.folder.assets.js %>/**/*.js'
            ],
            tasks: ['manage:app']
        },
    }
};
