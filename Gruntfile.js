/*global module */
module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		less: {
			app: {
				options: {
					paths: [
						'css',
						'bower_components'
					]
				},
				files: {
					'dist/app.css': 'css/app.less'
				}
			}
		},
		autoprefixer: {
			app: {
				src: 'dist/app.css',
				dest: 'dist/app.css'
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
					'bower_components/angular/angular.js',
					'bower_components/lodash/dist/lodash.js',
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
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('default', [
		'jshint:app',
		'concat:app',
		'less:app',
		'autoprefixer:app',
		'cssmin:app',
		'uglify:app'
	]);
	grunt.registerTask('serve', [
		'default',
		'connect:app',
	]);
};
