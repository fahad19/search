/*global require */
(function () {
	'use strict';

	var App = angular.module('BowerComponents', []);

	require('../directives/shortcut')(App);
	require('../filters/format_date')(App);
	require('../controllers/index_controller')(App);

})();
