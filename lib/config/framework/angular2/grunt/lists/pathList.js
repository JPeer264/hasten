module.exports = {
    paths: {
        tmp: {
            files: {
                instrumented: [
                    '<%=   paths.tmp.folder.tests.instrumented   %>/**/*.modules.js',
                    '<%=   paths.tmp.folder.tests.instrumented   %>/**/*.directives.js',
                    '<%=   paths.tmp.folder.tests.instrumented   %>/**/*.class.js',
                    '<%=   paths.tmp.folder.tests.instrumented   %>/**/*.js',
                    '!<%=   paths.tmp.folder.tests.instrumented   %>/**/*_.js',
                ]
            } // files
        }, // tmp
        src: {
            folder: {
                assets: {
                    appjs: '<%= paths.src.folder.assets.base %>/*.app.js'
                },
                angular: {
                    base: '<%= paths.src.base %>/<%= hstn.names.angular %>',
                } // angular
            }, // folder
            ignore: {
                appHtml: [
                    '!<%= paths.src.files.angular.html %>'
                ],
                angular: [
                    '!<%= paths.src.files.angular.all %>'
                ]
            }, // ignore
            files: {
                angular: {
                    modules: '<%= paths.src.folder.angular.base %>/**/*.module.js',
                    directives: [
                        '<%= paths.src.folder.angular.base %>/**/*.directive.js',
                        '<%= paths.src.folder.angular.base %>/**/*.dir.js'
                    ],
                    services: [
                        '<%= paths.src.folder.angular.base %>/**/*.factory.js',
                        '<%= paths.src.folder.angular.base %>/**/*.provider.js',
                        '<%= paths.src.folder.angular.base %>/**/*.service.js'
                    ],
                    controller: [
                        '<%= paths.src.folder.angular.base %>/**/*Ctrl.js',
                        '<%= paths.src.folder.angular.base %>/**/*Controller.js',
                        '<%= paths.src.folder.angular.base %>/**/*.ctrl.js',
                        '<%= paths.src.folder.angular.base %>/**/*.controller.js'
                    ],
                    all: [
                        '<%= paths.src.files.angular.modules %>',
                        '<%= paths.src.files.angular.directives %>',
                        '<%= paths.src.files.angular.services %>',
                        '<%= paths.src.files.angular.controller %>',
                    ],
                    html: '<%= paths.src.folder.angular.base %>/**/*.html'
                }, // angular
            } // files
        }, // src
        reports: {
            html2: '<%= paths.reports.base %>/app.json',
        }, // reports
    } // paths
};