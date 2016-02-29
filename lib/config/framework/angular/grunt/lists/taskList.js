module.exports = {
    /**
     * @tasks manage files for develop
     * -, :sass, :js
     */
    manage: {
        default: [
            'manage:sass',
            'manage:js',
            'manage:app',
        ],
        app: [
            // concat app
            'html2js:template',
            'concat:app',
            'clean:template',
        ],
    }
}
