'use strict';

angular.module('myApp.view1', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
      templateUrl: 'view1/view1.html',
      controller: 'View1Ctrl'
    });
  }])

  .controller('View1Ctrl', function($scope) {

    $scope.android_count = $scope.iphone_count = $scope.web_client_count = $scope.other_count = $scope.windows_count = 0;
    $scope.processed_chunks = 0;
    $scope.file_chunks = 0;
    $scope.index = 0;

    //Read File after User selects .txt Daten File
    //Parse the data line for line and call process Data function
    document.getElementById('file').onchange = function(){

      var file = this.files[0];
      $scope.findColumnLength(file, function (chunks) {

       var reader = new FileReader();
       reader.onload = function(progressEvent){
         var lines = this.result.split('\n');
         var data = [];
         for(var line = 1; line < lines.length - 1; line++){
           if(lines[line].length != 0)
             data.push(JSON.parse(lines[line]));
         }
        //-------DEVICE CHART-------------------------------------------------------------------------------------------
         $scope.countDevices(data, function () {
           $scope.processed_chunks = $scope.processed_chunks + 1;
           if($scope.processed_chunks === $scope.file_chunks)
           {
             clearInterval($scope.loading_id);
             var labels = ["Android", "Iphone", "Windows", "Web Client","Other"];
             var counts = [$scope.android_count,$scope.iphone_count, $scope.windows_count, $scope.web_client_count, $scope.other_count];
             $scope.createBarChart(labels, counts)
           }
         })
         //-------------------------------------------------------------------------------------------------------------
       };
       reader.onloadend = function () {
         $scope.start_time = new Date();
         if($scope.index < $scope.file_chunks) reader.readAsText(chunks[$scope.index++]);

       }
        reader.readAsText(chunks[$scope.index++]);
     })
    };


    ///---------------------------------------------------------------------------------------------------
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
      if($scope.index == 2)
      {
        $scope.end_time = new Date();
        var timeDiff = $scope.end_time - $scope.start_time;
        $scope.startProgressBar(timeDiff);
      }
      callback_();
    }

    $scope.createBarChart = function (labels, counts) {
      var ctx = document.getElementById("myChart");
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: '# of Device',
            data: counts,
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
      var CHUNK_SIZE = 10000000;
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

    $scope.startProgressBar = function(timeDiff) {
        var elem = document.getElementById("myBar");
        var little_bit = 100/$scope.file_chunks;
        var width = 1;
        $scope.loading_id = setInterval(frame, (timeDiff- 50));
        function frame() {
          if (width >= 100) {
            clearInterval($scope.loading_id);
          } else {
            width = width + little_bit;
            elem.style.width = width + '%';
          }
        }
      }
  });