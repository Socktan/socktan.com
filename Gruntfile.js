(function () {

    'use strict';

    module.exports = function (grunt) {

        var watchedFiles = [
            'css/**/*',
            'fonts/**/*',
            'img/**/*',
            'js/**/*',
            '*.html',
            '*.json',
            '*.js',
            '!dist'
        ];
        var baseUrl = 'http://localhost:8000/';
        var testPath = baseUrl + 'test.html';
        var routesArr = ['about', 'contact', 'work'];

        function getTestFiles() {
            return routesArr.map(function(route) {
                return 'dist/test/html/' + route + '.html';
            });
        }

        function makeCommands() {
            return routesArr.map(function(route) {
                return 'phantomjs load_ajax.js http://localhost:5000/index.html#' + route + ' dist/test/html/' + route + '.html';
            });
        }

        /**
         * Grunt Tasks and Configurations
         */
        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            copy: {
                build: {
                    expand: true,
                    src: [
                        '*.html',
                        'img/**',
                        'demo/**',
                        'fonts/**',
                        'js/**/*',
                        'video/**/*',
                        'uploads/**/*'
                    ],
                    dest: 'dist'
                },
                all: {
                    expand: true,
                    src: [
                        '*.html',
                        'img/**',
                        'css/**',
                        'demo/**',
                        'fonts/**',
                        'js/**'
                    ],
                    dest: 'dist'
                },
                mocha: {
                    expand: true,
                    cwd: 'node_modules/mocha/',
                    src: [
                        'mocha.js',
                        'mocha.css'
                    ],
                    dest: 'dist/test/'
                },
                test: {
                    expand: true,
                    src: [
                        'test/*',
                        'js/rjsTest.js',
                        'js/rjsConfig.js',
                        'test.html'
                    ],
                    dest: 'dist'
                },
                chai: {
                    expand: true,
                    cwd: 'node_modules/chai/',
                    src: [
                        'chai.js'
                    ],
                    dest: 'dist/test'
                },
                /**
                 * Copies original source from src/js to build/js/src/js for source map debugging.
                 */
                src: {
                    files: [
                        {
                            expand: true,
                            src: '*.js',
                            dest: 'dist/js/src/js'
                        }
                    ]
                },
                other: {
                    files: [
                        {
                            expand: true,
                            src: [
                                'img/**',
                                'cache.manifest',
                                'favicon.ico'
                            ],
                            dest: 'dist/'
                        }
                    ]
                },
                js: {
                    files: [
                        {
                            expand: true,
                            src: '**',
                            dest: 'dist/js'
                        }
                    ]
                }
            },
            cssmin: {
                options: {
                    sourceMap: true
                },
                target: {
                    files: {
                        'dist/css/main.css': ['css/main.css']
                    }
                }
            },
            htmlmin: {
                build: {
                    options: {
                        removeComments: true,
                        collapseWhitespace: true
                    },
                    files: {
                        'dist/index.html': 'index.html'
                    }
                }
            },
            jshint: {
                options: {
                    reporter: require('jshint-stylish'),
                    jshintrc: true
                },
                test: [
                    'js/app/**/*.js',
                    'Gruntfile.js'
                ]
            },
            bootlint: {
                options: {
                    showallerrors: true,
                    stoponerror: false,
                    stoponwarning: false,
                    relaxerror: []
                },
                files: getTestFiles()
            },
            shell: {
                snapshots: {
                    command: makeCommands().join('&&')
                }
            },
            bump: {
                options: {
                    updateConfigs: ['pkg'],
                    commit: true,
                    commitMessage: 'Release v%VERSION%',
                    tagName: 'v%VERSION%',
                    tagMessage: 'Version %VERSION%',
                    push: true,
                    pushTo: 'origin',
                    gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                    globalReplace: false,
                    prereleaseName: false,
                    metadata: '',
                    regExp: false
                }
            },
            mocha_phantomjs: {
                all: {
                    options: {
                        reporter: 'nyan',
                        urls: [testPath]
                    }
                }
            },
            connect: {
                server: {
                    options: {
                        port: 8000,
                        base: 'dist'
                    }
                }
            },
            clean: {
                dist: {
                    src: [
                        'dist/**'
                    ]
                }
            },
            watch: {
                options: {
                    atBegin: true
                },
                build: {
                    files: watchedFiles,
                    tasks: [
                        'default'
                    ]
                },
                mocha: {
                    files: [
                        'js/app/**/*',
                        'test/**/*',
                        'Gruntfile.js',
                        'test.html'
                    ],
                    tasks: [
                        'mocha'
                    ]
                }
            }
        });

        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        grunt.loadNpmTasks('grunt-contrib-htmlmin');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-contrib-connect');
        grunt.loadNpmTasks('grunt-mocha-phantomjs');
        grunt.loadNpmTasks('grunt-shell');
        grunt.loadNpmTasks('grunt-bootlint');
        grunt.loadNpmTasks('grunt-bump');

        /**
         * Alias tasks
         */

        grunt.registerTask('default', ['build']);

        grunt.registerTask('build', [
            'clean',
            'copy:build',
            'cssmin',
            'htmlmin:build'
        ]);

        grunt.registerTask('markup', ['shell:snapshots','bootlint']);

        grunt.registerTask('test', ['jshint']);

        grunt.registerTask('mocha', [
            'copy:chai',
            'copy:mocha'
        ]);

        grunt.registerTask('test', [
            'jshint'
        ]);

    };

}());
