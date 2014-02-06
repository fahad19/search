/*global angular, _ */
(function (angular, _) {
	'use strict';

	var API_URL = 'https://bower-component-list.herokuapp.com';

	var module = angular.module('BowerComponents', []);

	module.filter('formatDate', function () {
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

	module.controller('IndexController', [
		'$scope',
		'$http',
		'$location',
		'$window',
		function ($scope, $http, $location, $window) {

			// data
			var items = [];

			var matchedResults = [];

			$scope.results = [];

			// pagination
			$scope.q = '';

			$scope.qParams = {
				keyword: '',
				owner: null
			};

			$scope.sortField = 'stars';

			$scope.sortReverse = true;

			$scope.limit = 30;

			$scope.page = 1;

			$scope.count = 0;

			$scope.pagesCount = 1;

			// matchers
			var matchesByName = function (item) {
				if (item.name.indexOf($scope.qParams.keyword.toLowerCase()) > -1) {
					return true;
				}

				return false;
			};

			var matchesByKeyword = function (item) {
				if (_.isArray(item.keywords) && item.keywords.length > 0) {
					for (var k in item.keywords) {
						var keyword = item.keywords[k];
						if (keyword.toLowerCase().indexOf($scope.qParams.keyword.toLowerCase()) > -1) {
							return true;
						}
					}
				}

				return false;
			};

			var matchesByOwner = function (item) {
				if (!$scope.qParams.owner || $scope.qParams.owner.length === 0) {
					return true;
				}

				if (item.owner && item.owner.length > 0) {
					if (item.owner.toLowerCase().indexOf($scope.qParams.owner.toLowerCase()) > -1) {
						return true;
					}
				}

				return false;
			};

			// queries
			var find = function (items) {
				return _.filter(items, function(item) {
					if ($scope.q.length === 0) {
						return true;
					}

					if ((matchesByName(item) || matchesByKeyword(item)) && matchesByOwner(item)) {
						return true;
					}

					return false;
				});
			};

			var sort = function (matchedResults) {
				matchedResults = _.sortBy(matchedResults, function(item) {
					return item[$scope.sortField];
				});

				if ($scope.sortReverse) {
					matchedResults = matchedResults.reverse();
				}

				return matchedResults;
			};

			var limit = function (matchedResults) {
				var from = ($scope.page - 1) * $scope.limit;
				return _.clone(matchedResults).splice(from, $scope.limit);
			};

			var count = function (matchedResults) {
				$scope.count = matchedResults.length;
				$scope.pagesCount = Math.ceil($scope.count / $scope.limit);

				return $scope.count;
			};

			// search
			$scope.search = function () {
				if ($scope.loading) {
					return false;
				}

				var keywords = [];
				var owner = null;
				var qSplit = $scope.q.split(' ');
				for (var k in qSplit) {
					var v = qSplit[k];
					if (v.indexOf('owner:') === 0) {
						owner = v.replace('owner:', '');
					} else {
						keywords.push(v);
					}
				}

				$scope.qParams = {
					keyword: keywords.join(' '),
					owner: owner
				};

				$scope.page = 1;
				$location.search({
					q: $scope.q
				});

				matchedResults = find(items);
				matchedResults = sort(matchedResults);
				$scope.results = limit(matchedResults);
				count(matchedResults);
			};

			$scope.sortResults = function (field) {
				if ($scope.sortField === field) {
					$scope.sortReverse = !$scope.sortReverse;
				} else {
					$scope.sortReverse = false;
				}

				$scope.sortField = field;
				matchedResults = sort(matchedResults);
				$scope.results = limit(matchedResults);
			};

			$scope.goToPrev = function () {
				if ($scope.hasPrev()) {
					$scope.page--;
					$scope.results = limit(matchedResults);
				}
			};

			$scope.goToNext = function () {
				if ($scope.hasNext()) {
					$scope.page++;
					$scope.results = limit(matchedResults);
				}
			};

			// checkers
			$scope.hasPrev = function () {
				if ($scope.page === 1) {
					return false;
				}

				return true;
			};

			$scope.hasNext = function () {
				if ($scope.page === $scope.pagesCount) {
					return false;
				}

				return true;
			};

			// key bindings for prev/next
			angular.element($window).on('keydown', function (e) {
				if (typeof document.activeElement.id !== 'undefined' && document.activeElement.id === 'q') {
					return true;
				}

				if (e.keyCode === 37) {
					if (!$scope.$$phase) {
						$scope.$apply(function() {
							$scope.goToPrev();
						});
					}
				} else if (e.keyCode === 39) {
					if (!$scope.$$phase) {
						$scope.$apply(function() {
							$scope.goToNext();
						});
					}
				}
			});

			// init
			$scope.loading = true;
			$scope.loadingError = false;

			var promise = $http.get(API_URL);
			promise.then(function (res) {
				if (res.status !== 200) {
					$scope.loadingError = true;
					return false;
				}

				items = res.data;
				$scope.loading = false;

				var urlParams = $location.search();
				if (_.isObject(urlParams) && typeof urlParams.q !== 'undefined') {
					$scope.q = urlParams.q;
				}

				$scope.search();
			});

		}
	]);

})(angular, _);
