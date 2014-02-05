/*global module */
module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		less: {
			app: {
				options: {
					paths: [
						'css',
						'vendors'
					]
				},
				files: {
					'dist/app.css': 'css/app.less'
				}
			}
		},
		cssmin: {
			app: {
				files: {
					'dist/app.css': ['dist/app.css']
				}
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			app: ['js/*.js']
		},
		concat: {
			app: {
				src: [
					'vendors/angular/angular.js',
					'vendors/underscore/underscore.js',
					'js/app.js'
				],
				dest: 'dist/app.js'
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			app: {
				files: {
					'dist/app.js': ['dist/app.js']
				}
			}
		},
		connect: {
			app: {
				options: {
					port: 9001,
					base: '.',
					keepalive: true
				}
			}
		},
		watch: {
			app: {
				files: [
					'css/app.less',
					'js/app.js'
				],
				tasks: ['default']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('default', [
		'less:app',
		'jshint:app',
		'concat:app',
		'cssmin:app',
		'uglify:app'
	]);
	grunt.registerTask('serve', [
		'default',
		'connect:app',
	]);
};
