module.exports = function(grunt) {
    'use strict';



    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        env: process.env,
        clean: {
            dist: {
                options: {
                    force: true
                },
                src: ['dist']
            },
            
        },
        
        concat: {
            dist: {
                src: [
                    'src/utils.js',
                    'src/jsonFormValidator.js'
                ],
                dest: 'dist/jsonFormValidator.js'
            },
            
        },
        
        uglify: {
            options: {
                banner: '/*! jsonFormValidator <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
             dist: {
                 src: 'dist/jsonFormValidator.js',
                 dest: 'dist/jsonFormValidator.min.js'

             },
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['babel/preset-env']
            },
            dist: {
                files: {
                    'dist/jsonFormValidator.js': 'dist/jsonFormValidator.js'
                }
            }
        }
    });

    



   

    grunt.registerTask('build', [
        'clean:dist',
        'concat:dist',
        'babel:dist',
        'uglify:dist',
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

};
