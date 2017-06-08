'use strict';

angular.module('myApp.view1', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
      templateUrl: 'view1/view1.html',
      controller: 'View1Ctrl'
    });
  }])

  .controller('View1Ctrl', function($scope, $http) {

    //Read File after User selects .txt Daten File
    //Parse the data line for line and call process Data function
    document.getElementById('file').onchange = function(){

      var file = this.files[0];

      var reader = new FileReader();
      reader.onload = function(progressEvent){
        // Entire file
        console.log(this.result);

        // By lines
        var lines = this.result.split('\n');
        var data = [];
        for(var line = 0; line < lines.length; line++){
          console.log(lines[line]);
          if(lines[line].length != 0)
            data.push(JSON.parse(lines[line]));
        }
        $scope.processData(data)
      };
      reader.readAsText(file);
    };


    $scope.processData = function (data) {
      var users = [];

      data.forEach(function (line) {
        users.push(line.usr);
      });


    }
  });