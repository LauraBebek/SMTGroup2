'use strict';

angular.module('myApp.view1', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
      templateUrl: 'view1/view1.html',
      controller: 'View1Ctrl'
    });
  }])

  .controller('View1Ctrl', function($scope, $http) {

    $scope.android_count = $scope.iphone_count = $scope.web_client_count = $scope.other_count = $scope.windows_count = 0;
    $scope.processed_chunks = 0;
    $scope.file_chunks = 0;

    //Read File after User selects .txt Daten File
    //Parse the data line for line and call process Data function
    document.getElementById('file').onchange = function(){

      var file = this.files[0];
     $scope.findColumnLength(file, function (chunks) {

       var reader = new FileReader();
       reader.onload = function(progressEvent){
         // Entire file
         //console.log(this.result);

         // By lines
         var lines = this.result.split('\n');
         var data = [];
         for(var line = 0; line < lines.length - 1; line++){
           console.log(lines[line]);
           if(lines[line].length != 0)
             data.push(JSON.parse(lines[line]));
         }
         $scope.countDevices(data, function () {
           $scope.processed_chunks = $scope.processed_chunks + 1;
           if($scope.processed_chunks === $scope.file_chunks)
             $scope.createChart($scope.android_count,$scope.windows_count, $scope.windows_count, $scope.web_client_count, $scope.other_count)
         })
       };
       chunks.forEach(function (chunk) {
         setTimeout(reader.readAsText(chunk), 3000);
       });
     })
    };


    $scope.countDevices = function (data, callback_) {
      for(var index = 0; index < data.length; index++){
       if(data[index].src.indexOf("Android") != -1)
        $scope.android_count = $scope.android_count + 1;
       else if(data[index].src.indexOf("iPhone") != -1)
         $scope.iphone_count = $scope.iphone_count + 1;
       else if(data[index].src.indexOf("Windows") != -1)
         $scope.windows_count = $scope.windows_count + 1;
       else if(data[index].src.indexOf("Web Client") != -1)
         $scope.web_client_count = $scope.web_client_count + 1;
       else
         $scope.other_count = $scope.other_count + 1;
      };
      callback_();
    }

    $scope.createChart = function (android_count, iphone_count, windows_count, web_client, other_count) {
      var ctx = document.getElementById("myChart");
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["Android", "Iphone", "Windows", "Web Client","Other"],
          datasets: [{
            label: '# of Device',
            data: [android_count, iphone_count, windows_count, web_client, other_count],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(245, 22, 32, 0.2)',
              'rgba(67, 182, 235, 0.2)',
              'rgba(88, 142, 215, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(162,132,132,1)',
              'rgba(132, 132, 162, 1)',
              'rgba(48, 12, 115, 0.2)'
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
      var CHUNK_SIZE = 50000000;
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

        var slices = [];
        $scope.file_chunks = Math.ceil(file.size/CHUNK_SIZE);
        for(var index = 0; index <$scope.file_chunks; index++) {
          slices.push(file.slice(offset, offset + CHUNK_SIZE))
          offset = offset + CHUNK_SIZE;

        }
        callback(slices);
      }
    }


  });