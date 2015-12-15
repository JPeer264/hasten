module.exports = {
    default: ['build:prod'],
    /**
     * @tasks manage files for develop
     * -, :sass, :js
     */
    manage: {
        default: [
            'manage:sass',
            'manage:js',
        ],
        sass: [
            'concat:scss',
            'sass:dev',
            'concat:css',
            'clean:createdSassByGrunt',
            'manageScssFolders',
            'autoprefixer'
        ],
        js: [
            'concat:js',

            // concat vendor
            'bower_concat',
            'concat:vendor',
            'clean:bower'
        ]
    },

    /*
     * @tasks minify
     * -, :sass, :js
     */
    //todo minify:oldbrowsers for manageScssFolders -> make own watch task
    minify: {
        default: [
            'minify:css',
            'minify:js',
            // notlösung: vendors können minifierten code enthalten
            // 'uglify' kann minifierten code nicht erneut uglifien
            'copy:vendor'
        ],
        css: [
            'manage:sass',
            'cssmin'
        ],
        js: [
            'manage:js',
            'removelogging',
            'uglify:nonvendor',
        ]
    },

    /*
     * @tasks lint
     * -, :dev, :ci, :reports
     */
    lint: {
        default: ['lint:ci'],
        dev: [
            'lint:ci'
        ],
        ci: [
            'manage',
            'eslint:dev',
            'csslint:dev',
            'validation'
        ],
        reports: [
            'force:on',
            'manage',
            'eslint:report',
            'csslint:report',
            // 'validation', add validation for angular and non angular apps
            'force:off'
        ]
    },

    /*
     * @tasks test
     * -, :dev, :reports, :ci
     */
    test: {
        default: ['test:ci'],
        dev: [
            'test:ci',
            'connect:reports'
        ],
        ci: [
            'copy:tests',
            'instrument',
            'concat:tests',
            'mocha:report'
        ],
        reports: [
            'force:on',
            'test:ci',
            'force:off'
        ]
    },

    /*
     * @tasks reports
     *
     * this task should never fail
     */
    reports: [
        'lint:reports',
        'test:reports'
    ],

    /*
     * @tasks build
     * :prod, :dev, :ci
     */
    build: {
        default: ['build:prod'],
        prod: [
            'minify',
            // 'lint:dev',
            'copy:prod',
            // 'imagemin:prod', // <- deactivated due to issues
            'cdnify:prod'
        ],
        dev: [
            'manage',
            'copy:dev'
        ],
        ci: ['build:prod']
    },

    /*
     * @tasks serve
     * -, :dev, :prod
     */
    serve: {
        default: ['serve:dev'],
        dev: [
            'build:dev',
            'connect:dev',
            'browserSync:dev',
            'watch',
        ],
        devphp: [
            'build:dev',
            'php:dev',
            'browserSync:dev',
            'watch',
        ],
        reports: [
            'test:ci',
            'connect:reports'
        ],
        docs: [
            'jsdoc',
            'connect:docs'
        ]
    }
}