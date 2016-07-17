'use strict';

angular.module('appealAssistant')
  .controller('MainCtrl', function ($scope, $log,$uibModal,DTOptionsBuilder,TemplateService) {
    $scope.data = [];
   /*
    $scope.barData = [{
      key: "Cumulative Return",
      values: [
        { "label" : "A" , "value" : -29.765957771107 },
        { "label" : "B" , "value" : 0 },
        { "label" : "C" , "value" : 32.807804682612 },
        { "label" : "D" , "value" : 196.45946739256 },
        { "label" : "E" , "value" : 0.19434030906893 },
        { "label" : "F" , "value" : -98.079782601442 },
        { "label" : "G" , "value" : -13.925743130903 },
        { "label" : "H" , "value" : -5.1387322875705 }
      ]
    }];

    $scope.pieData = [
      {
        key: "One",
        y: 5
      },
      {
        key: "Two",
        y: 2
      },
      {
        key: "Three",
        y: 9
      },
      {
        key: "Four",
        y: 7
      },
      {
        key: "Five",
        y: 4
      },
      {
        key: "Six",
        y: 3
      },
      {
        key: "Seven",
        y: .5
      }
    ];
*/
    $scope.pieOptions = {
      chart: {
        type: 'pieChart',
        height: 500,
        x: function(d){return d.key;},
        y: function(d){return d.y;},
        showLabels: true,
        duration: 500,
        labelThreshold: 0.01,
        labelSunbeamLayout: true,
        legend: {
          margin: {
            top: 5,
            right: 35,
            bottom: 5,
            left: 0
          }
        }
      }
    };

    $scope.barOptions = {
      chart: {
        type: 'discreteBarChart',
        height: 450,
        margin : {
          top: 20,
          right: 20,
          bottom: 60,
          left: 55
        },
        x: function(d){ return d.label; },
        y: function(d){ return d.value; },
        showValues: true,
        valueFormat: function(d){
          return d3.format(',.4f')(d);
        },
        transitionDuration: 500,
        xAxis: {
          axisLabel: 'X Axis'
        },
        yAxis: {
          axisLabel: 'Y Axis',
          axisLabelDistance: 30
        }
      }
    };
    $scope.update = function () {

      if($scope.item){
        $scope.codeValue=$scope.item.code;
        console.log("Calling getTemplates "+$scope.item);
        TemplateService.getTemplates($scope.item.code).then(function(data){
          $scope.pieData = data;
          console.log("Calling getTemplates "+JSON.stringify($scope.exampleData));
        })
      }else {
        $scope.exampleData = [];
      }
    }

    $scope.templateTypes = [ {code: 'BAR', name: 'BAR CHART'}, {code: 'PIE', name: 'PIE CHART'}];

  })
  .controller('ModalInstanceCtrl', function($scope,letterId,$log,$window,uuid,TemplateService) {
    $scope.letterId = letterId;
    $scope.cancel = function () {
      $scope.$dismiss('cancel');
    };
    $scope.submitActionForm = function () {
      $scope.error = '';
      $scope.submitted = true;

      $log.debug($scope.appealLebelForm);
      if ($scope.appealLebelForm.$valid) {
        $scope.wait = true;
        var uid = uuid.newuuid();
        $scope.appealLebel.AppealType = $scope.letterId;
        TemplateService.downloadTemplate(uid,$scope.appealLebel).then(function(data){
          $window.open(data.path);
          $scope.$dismiss('cancel');
        },function(error){

          $scope.wait = false;
          $scope.error =  error.message;
        })
      }else {
        alert("Please correct errors!");
      }
    };
  })
  .controller('UploadModalInstanceCtrl', function($scope,$q,$log,uuid,Upload) {
    $scope.cancel = function () {
      $scope.$dismiss('cancel');
    };

    $scope.submitActionForm = function () {
      $scope.error = '';
      $scope.submitted = true;
      var file = $scope.uploadAppelFile.file;
      if (file) {

        $scope.uploadAppelFile(file,uuid.newuuid(),$q).then(function(data){
          console.log("Data"+data);
          $scope.$dismiss('cancel');
        },function(error){
          $log.debug('Error Upload: ' + error);
          $scope.error = error;
        })
      }else {
        alert("File is empty");
      }
    };



    $scope.uploadAppelFile = function (file,id,$q) {
      $log.debug("Coming to upload method...."+id);
      var deferred = $q.defer();
      Upload.upload({
        url: '/api/uploadAppealLevel/'+id,
        method: 'POST',
        file:file
      }).then(function (resp) {
        deferred.resolve(resp);
      }, function (resp) {
        $log.debug('Error status: ' + resp.data);
        deferred.reject(resp.data);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        $log.debug('progress: ' + progressPercentage + '% ');
      });
      return deferred.promise;
    };

  });
