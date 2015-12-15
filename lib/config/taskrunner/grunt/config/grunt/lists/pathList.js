module.exports = {
    paths: {
        base: '.',
        cache: {
            scss:   '<%= paths.base %>/.scss-cache',
        },
        tmp: {
            base: '<%= paths.base       %>/tmp',
            folder: {
                assets: {
                    base: '<%=   paths.tmp.base %>/<%= hstn.names.assets %>',
                    js: '<%=     paths.tmp.folder.assets.base %>/js',
                    jss:'<%=     paths.tmp.folder.assets.js %>/**',
                    css: '<%=    paths.tmp.folder.assets.base %>/css',
                    csss: '<%=   paths.tmp.folder.assets.css %>/**',
                    styles: '<%= paths.tmp.folder.assets.css %>/global.css',
                },
                tests: {
                    base: '<%= paths.tmp.base %>/tests',
                    js: '<%=   paths.tmp.folder.tests.base   %>/js',
                    instrumented: '<%=   paths.tmp.folder.tests.base   %>/instrumented',
                    css: '<%=  paths.tmp.folder.tests.base   %>/css',
                },
                docs: {
                    base: '<%= paths.tmp.base %>/docs',
                }
            }, // folder
            files: {
                css: '<%= paths.tmp.folder.assets.csss %>/*.css',
                instrumented: [
                    '<%=   paths.tmp.folder.tests.instrumented   %>/**/*.class.js',
                    '<%=   paths.tmp.folder.tests.instrumented   %>/**/*.js',
                    '!<%=   paths.tmp.folder.tests.instrumented   %>/**/*_.js',
                ]
            } // files
        }, // tmp
        vendor: {
            base: '<%= paths.base %>/vendor',
            css: [
                '<%= paths.vendor.base %>/**/*.css'
            ],
            js: [
                '<%= paths.vendor.base %>/**/*.js',
            ],
            min: {
                js: '<%= paths.vendor.base %>/**/*.min.js',
                css: '<%= paths.vendor.base %>/**/*.min.css',
            }
        }, // vendor
        src: {
            base: '<%=  paths.base      %>/<%= hstn.names.src %>',
            tests: '<%= paths.src.base  %>/**/*.spec.js',
            folder: {
                assets: {
                    base: '<%=  paths.src.base               %>/<%= hstn.names.assets %>',
                    js: '<%=    paths.src.folder.assets.base %>/js',
                    jss: '<%=   paths.src.folder.assets.js   %>/**',
                    scss: '<%=  paths.src.folder.assets.base %>/scss',
                    scsss: '<%= paths.src.folder.assets.scss %>/**',
                    css: '<%=   paths.src.folder.assets.base %>/css',
                    csss: '<%=  paths.src.folder.assets.css  %>/**',
                    img: '<%=   paths.src.folder.assets.base %>/img',
                    imgs: '<%=  paths.src.folder.assets.img  %>/**',
                    svg: '<%=   paths.src.folder.assets.base %>/svg',
                    svgs: '<%=  paths.src.folder.assets.svg  %>/**',
                    json: '<%=  paths.src.folder.assets.base %>/json',
                    jsons: '<%= paths.src.folder.assets.json %>/**',
                }, // assets
            }, // folder
            ignore: {
                modules: [
                    '!<%= paths.src.base %>/**/node_modules/**/*.js',
                    '!<%= paths.src.base %>/**/node_modules/**/*.css',
                    '!<%= paths.src.base %>/**/node_modules/**/*.html',
                ],
                tests: [
                    '!<%= paths.src.tests %>'
                ],
                _js: [
                    '!<%=   paths.src.base   %>/**/_*.js',
                ],
                couldBeVendor: [
                    // start with js
                    '!<%= paths.src.base %>/**/*.min.js',
                    '!<%= paths.src.base %>/**/*jquery*.js',
                    '!<%= paths.src.base %>/**/*angular*.js',
                    '!<%= paths.src.base %>/**/*ember*.js',
                    '!<%= paths.src.base %>/**/*bootstrap*.js',

                    // end with css
                    '!<%= paths.src.base %>/**/*.min.css',
                    '!<%= paths.src.base %>/**/*bootstrap*.css',
                ],
                _scss: '!<%= paths.src.base %>/**/_*.scss',
                _css:  '!<%= paths.src.base %>/**/_*.css',
                _html: '!<%= paths.src.base %>/**/_*.html',
                assets: [
                    '!<%= paths.src.files.assets.js',
                    '!<%= paths.src.files.assets.css',
                    '!<%= paths.src.files.assets.scss',
                    '!<%= paths.src.files.assets.img',
                    '!<%= paths.src.files.assets.svg',
                    '!<%= paths.src.files.assets.json',
                ],
                min: [
                    '!<%= paths.src.base %>/**/*.min.*'
                ]
            }, // ignore
            allFiles: {
                js: '<%=   paths.src.base %>/**/*.js',
                scss: '<%= paths.src.base %>/**/*.scss',
                css: '<%=  paths.src.base %>/**/*.css',
                html: '<%= paths.src.base %>/**/*.html',
                img: '<%=  paths.src.base %>/**/*.img',
                svg: '<%=  paths.src.base %>/**/*.svg',
                json: '<%= paths.src.base %>/**/*.json',
            }, // allfiles
            files: {
                js: [
                    '<%= paths.src.allFiles.js %>',
                    '<%= paths.src.ignore._js %>',
                    '<%= paths.src.ignore.tests %>'
                ],
                scss: [
                    '<%= paths.src.allFiles.scss %>',
                    '<%= paths.src.ignore._scss %>',
                ],
                css: [
                    '<%= paths.src.allFiles.css %>',
                    '<%= paths.src.ignore._css %>'
                ],
                html: [
                    '<%= paths.src.allFiles.html %>',
                    '<%= paths.src.ignore._scss %>'
                ],
                assets: {
                    js: [
                        '<%= paths.src.folder.assets.jss %>/*.class.js',
                        '<%= paths.src.folder.assets.jss %>/*.js',
                        '<%= paths.src.folder.assets.jss %>/*.init.js',
                        '<%= paths.src.ignore._js %>',
                        '<%= paths.src.ignore.tests %>'
                    ],
                    scss: [
                        '<%= paths.src.folder.assets.scss %>/*.scss',
                        '<%= paths.src.ignore._scss %>',
                        '<%= paths.src.folder.assets.css %>/*.css',
                        '<%= paths.src.ignore._css %>',
                    ],
                    oldBrowserScss: [
                        '<%= pahts.src.folder.assets.scss %>/**/*.scss',
                        '!<%= pahts.src.folder.assets.scss %>/*.scss',
                    ],
                    img: '<%=  paths.src.folder.assets.imgs %>/*.img',
                    svg: '<%=  paths.src.folder.assets.svgs %>/*.svg',
                    json: '<%= paths.src.folder.assets.jsons %>/*.json',
                }, // assets
                couldBeVendor: {
                    js: [
                        // start with js
                        '<%= paths.src.base %>/**/*.min.js',
                        '<%= paths.src.base %>/**/*jquery*.js',
                        '<%= paths.src.base %>/**/*angular*.js',
                        '<%= paths.src.base %>/**/*ember*.js',
                        '<%= paths.src.base %>/**/*bootstrap*.js',
                    ],
                    css: [
                        // end with css
                        '<%= paths.src.base %>/**/*.min.css',
                        '<%= paths.src.base %>/**/*bootstrap*.css',
                    ]
                }, // couldBeVendor
            } // files
        }, // src
        dest: {
            base: '<%=  paths.base %>/<%= hstn.names.dest %>',
            folder: {
                html: '<%= paths.dest.base %>/html',
                htmls: '<%= paths.dest.folder.html %>/**',
                assets: {
                    base: '<%=  paths.dest.base %>/<%= hstn.names.assets %>',
                    js: '<%=    paths.dest.folder.assets.base %>/js',
                    jss: '<%=   paths.dest.folder.assets.base %>/**',
                    css: '<%=   paths.dest.folder.assets.base %>/css',
                    csss: '<%=  paths.dest.folder.assets.base %>/**',
                    html: '<%=  paths.dest.folder.assets.base %>/html',
                    htmls: '<%= paths.dest.folder.assets.base %>/**',
                    img: '<%=   paths.dest.folder.assets.base %>/img',
                    imgs: '<%=  paths.dest.folder.assets.base %>/**',
                    svg: '<%=   paths.dest.folder.assets.base %>/svg',
                    svgs: '<%=  paths.dest.folder.assets.base %>/**',
                    json: '<%=  paths.dest.folder.assets.base %>/json',
                    jsons: '<%= paths.dest.folder.assets.base %>/**',
                }
            },
            allFiles: {
                js: '<%=     paths.dest.folder.assets.jss   %>/*.js',
                css: '<%=    paths.dest.folder.assets.csss  %>/*.css',
                mincss: '<%= paths.dest.folder.assets.csss  %>/*.min.css',
                html: '<%=   paths.dest.folder.assets.htmls %>/*.html',
                img:  '<%=   paths.dest.folder.assets.imgs  %>/*.img',
                svg:  '<%=   paths.dest.folder.assets.svgs  %>/*.svg',
                json: '<%=   paths.dest.folder.assets.jsons %>/*.json',
            } // files
        }, // dest
        reports: {
            base:     '<%= paths.tmp.base     %>/reports',
            coverage: '<%= paths.reports.base %>/coverage',
            checkstyle: '<%= paths.reports.base %>/checkstyle.xml',
            pmd: '<%=        paths.reports.base %>/pmd.xml',
            html: '<%= paths.reports.base %>/.html-status.json',
            html2: '<%= paths.reports.base %>/app.json',
            csslint:  '',
            js:   '',
        }, // reports
        config: '<%= paths.base %>/config',
    } // paths
};