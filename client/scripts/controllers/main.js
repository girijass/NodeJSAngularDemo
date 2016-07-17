'use strict';

angular.module('appealAssistant')
  .controller('MainCtrl', function ($scope, $log,$uibModal,DTOptionsBuilder,TemplateService) {
    $scope.medicareTemplateForms = [];
    $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withDisplayLength(10)
      .withOption('bLengthChange', true);

    $scope.update = function () {
      if($scope.item){
        TemplateService.getTemplates($scope.item.code).then(function(data){
          $scope.medicareTemplateForms = data;
        })
      }else {
        $scope.medicareTemplateForms = [];
      }
    }
    $scope.uploadFile = function () {
      var uploadModalInstance = $uibModal.open({
        backdrop: false,
        templateUrl: 'uplodModalContent.html',
        controller: 'UploadModalInstanceCtrl'
      });
      uploadModalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.debug('Modal dismissed at: ' + new Date());
      });

    };
    $scope.templateTypes = [ {code: 'MC', name: 'Managed Care'}, {code: 'MD', name: 'Medicare'}];
    $scope.openLetter = function (letterId) {
      var modalInstance = $uibModal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          letterId: function () {
            return letterId;
          }
        }
      });
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.debug('Modal dismissed at: ' + new Date());
      });
    };
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
