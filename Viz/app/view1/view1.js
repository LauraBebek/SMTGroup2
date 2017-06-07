'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($scope, $http) {

  $scope.init = function () {
    $http.get('data/reply_tweets.json').success(function(file) {

      var reader = new FileReader();
      reader.onload = function(progressEvent){
        // Entire file
        console.log(this.result);

        // By lines
        var lines = this.result.split('\n');
        for(var line = 0; line < lines.length; line++){
          console.log(lines[line]);
        }
      };
      reader.readAsText(file);

    });

  }

  $scope.init();
});