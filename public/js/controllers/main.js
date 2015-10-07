'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('tweetSearch')
  .controller('MainCtrl', function ($scope, $http, searches) {
    $scope.savedSearches = searches.data;

    $scope.getTweets = function() {
      $http.get('/twitter/search?searchTerm=' + $scope.qTerm)
        .then(function(response) {
          $scope.tweets = response.data;
          $scope.qTerm = '';
        });
    };
  });
