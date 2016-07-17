'use strict';
angular.module('appealAssistant')
  .factory('TemplateService', ['$http','$q','$log', function ($http, $q, $log) {
    return {
      getTemplates: function (type) {
        var deferred = $q.defer();
        var obj = [];
        console.log("Type is "+type);
       if(type === 'BAR') {
         console.log("Calling /api/getBarChartData");
         $http.get('/api/getBarChartData').success(function (data) {
           obj = data.graphdata;
           deferred.resolve(obj);
         });
       }else if(type === 'PIE'){
         console.log("Calling /api/getPieChartData");
         $http.get('/api/getPieChartData').success(function (data) {
           obj = data.graphdata;
           deferred.resolve(obj);
         });
       }else{
         deferred.resolve(obj);
       }
        return deferred.promise;
      },
      downloadTemplate: function (InstanceID,appealLebel) {
        var deferred = $q.defer();
        var obj = [];
        console.log("downloadTemplate Service");
          $http.post('/api/downloadAppealLevel/'+InstanceID,
            appealLebel
          ).success(function (data) {
            console.log("Girija Success...");
            obj = data;
            deferred.resolve(obj);
          }).error(function (data, status, headers, config) {
            console.log("Girija Error...");
            deferred.reject(data);
            $log.error(data);
          });
        return deferred.promise;
      }
    };
  }]);
