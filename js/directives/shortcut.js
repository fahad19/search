/*global */
module.exports = function (App) {
	'use strict';

	App.directive('shortcut', [
		'$document',
		function ($document) {
			return {
				link: function (scope, element, attrs) {
					attrs.$observe('shortcut', function(value) {
						var keycode = parseInt(value, 10);
						$document.on('keydown', function (e) {
							if (e.keyCode !== keycode) {
								return;
							}

							element.triggerHandler('click');
						});
					});
				}
			}
		}
	]);

};
