'use strict';

module.exports = function(grunt) {
    //load plugins
    [
        'grunt-contrib-less',
        'grunt-contrib-cssmin',
        'grunt-contrib-watch',
        'grunt-contrib-clean',
        'grunt-hashres'
    ].forEach(function(task) {
        grunt.loadNpmTasks(task);
    });

    //configure plugins
    grunt.initConfig({
        less: {
            development: {
                options: {
                    sourceMap: true
                },
                files: {
                    'public/css/stylesheet.css': 'src/app/less/stylesheet.less'
                }
            }
        },
        clean: {
            style: ['public/css/**/*.css']
        },
        cssmin: {
            minify: {
                src: 'public/css/stylesheet.css',
                dest: 'public/css/stylesheet.min.css'
            }
        },
        hashres: {
            options: {
                fileNameFormat: '${name}.${hash}.${ext}'
            },
            all: {
                src: ['public/css/stylesheet.min.css'],
                dest: ['public/build/index.hbs']
            }
        },
        watch: {
            css: {
                files: ['src/app/less/**/*.less'],
                tasks: ['clean:style', 'less'],
                options: {
                    livereload: true
                }
            },
            prettier: {
                files: ['src/app/container/Breadcrumb.js'],
                tasks: ['prettier']
            }
        }
    });

    //register tasks
    grunt.registerTask('production', ['clean', 'less', 'cssmin', 'hashres']);
};
