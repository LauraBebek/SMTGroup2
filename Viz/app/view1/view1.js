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
     $scope.findColumnLength(file, function () {
       console.log("Here we ho");
     })
      var reader = new FileReader();
      reader.onload = function(progressEvent){
        // Entire file
        //console.log(this.result);

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
      var users = [];var tweets = [];var android_count = 0; var iphone_count = 0; var windows_count = 0; var other_count = 0;
      for(var index = 0; index < data.length; index++){
       if(data[index].src.indexOf("Android") != -1)
        android_count = android_count + 1;
      else if(data[index].src.indexOf("iPhone") != -1)
        iphone_count = iphone_count + 1;
       else if(data[index].src.indexOf("Windows") != -1)
         iphone_count = windows_count + 1;
       else
         iphone_count = other_count + 1;
      };

      $scope.createChart(android_count, iphone_count, windows_count, other_count);
    }

    $scope.createChart = function (android_count, iphone_count, windows_count, other_count) {
      var ctx = document.getElementById("myChart");
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["Android", "Iphone", "Windows", "Other"],
          datasets: [{
            label: '# of Device',
            data: [android_count, iphone_count, windows_count, other_count],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(245, 22, 32, 0.2)',
              'rgba(67, 182, 235, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(162,132,132,1)',
              'rgba(132, 132, 162, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero:true
              }
            }]
          }
        }
      });
    }

    $scope.findColumnLength = function(file, callback) {
      // 1 KB at a time, because we expect that the column will probably small.
      var CHUNK_SIZE = 1000000;
      var offset = 0;
      var fr = new FileReader();
      fr.onload = function() {
        var view = new Uint8Array(fr.result);
        for (var i = 0; i < view.length; ++i) {
          if (view[i] === 10 || view[i] === 13) {
            // \n = 10 and \r = 13
            // column length = offset + position of \r or \n
            callback(offset + i);
            return;
          }
        }
        // \r or \n not found, continue seeking.
        offset += CHUNK_SIZE;
        seek();
      };
      fr.onerror = function() {
        // Cannot read file... Do something, e.g. assume column size = 0.
        callback(0);
      };
      seek();

      function seek() {
        if (offset >= file.size) {
          // No \r or \n found. The column size is equal to the full
          // file size
          callback(file.size);
          return;
        }
        var slice = file.slice(offset, offset + CHUNK_SIZE);
        var test = fr.readAsArrayBuffer(slice);

        fr.onload
        console.log(test)
      }
    }


  });