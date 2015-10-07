'use strict';

/**
 * @ngdoc overview
 * @name tweetSearch
 * @description
 * # tweetSearch
 *
 * Main module of the application.
 */
angular
  .module('tweetSearch', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angularMoment'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/twitter/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        resolve: {
          searches: function($http) {
            return $http.get('/twitter/saved-searches/');
          }
        }
      })
      .otherwise({
        redirectTo: '/twitter/'
      });
    // $locationProvider.html5Mode(true);
  });
