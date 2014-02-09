/*global */
module.exports = function (App) {
	'use strict';

	App.filter('formatDate', function () {
		return function (timestamp) {
			var date = new Date((timestamp || '').replace(/-/g,'/').replace(/[TZ]/g,' '));
			var diff = (((new Date()).getTime() - date.getTime()) / 1000);
			var dayDiff = Math.floor(diff / 86400);

			if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
				return;
			}

			return dayDiff === 0 && (
					diff < 60 && 'just now' ||
					diff < 120 && '1 minute ago' ||
					diff < 3600 && Math.floor( diff / 60 ) + ' minutes ago' ||
					diff < 7200 && '1 hour ago' ||
					diff < 86400 && Math.floor( diff / 3600 ) + ' hours ago') ||
				dayDiff === 1 && 'Yesterday' ||
				dayDiff < 7 && dayDiff + ' days ago' ||
				dayDiff < 31 && Math.ceil( dayDiff / 7 ) + ' weeks ago';
		};
	});

};
