/*global require */
(function (window) {
	'use strict';

	window.angular = require('../node_modules/angular/index-browserify');
	window._       = require('../node_modules/lodash/dist/lodash');

	require('./config/bootstrap');

})(window);
