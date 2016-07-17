'use strict';

angular.module('appealAssistant', ['ngRoute',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ngAria',
    'ngMessages',
    'ngTouch',
    'ui.bootstrap',
    'validation.match',
    'ngFileUpload',
    'ncy-angular-breadcrumb',
    'datatables',
    'datatables.buttons',
    'dcbClearInput',
    'angularSpinner',
    'nvd3ChartDirectives'
])
 /*
  .service('$flash', function($rootScope) {
    this.show = function(message) {
      $rootScope.flash = message;
    };

    this.clear = function() {
      $rootScope.flash = '';
    };
  })

  .factory('$session', function() {
    return {
      get: function(key) {
        return sessionStorage.getItem(key);
      },
      set: function(key, value) {
        return sessionStorage.setItem(key, value);
      },
      unset: function(key) {
        return sessionStorage.removeItem(key);
      },
      clear: function() {
        return sessionStorage.clear();
      }
    };
  })
  .service('AuthenticationService', function($http, $timeout, $q, $session, $flash) {
    this.login = function(credentials) {
      var login = $http.post('/login', credentials);
      login.success(function(user) {
        $session.set('user', user);
        $flash.clear();
      }).error(function(error) {
        error = error.error ? error.error : error;
        $flash.show(error.message || error);
      });
      return login;
    };

    this.logout = function() {
      var logout = $http.get('/logout');
      logout.success(function() {
        $session.clear();
      });
      return logout;
    };

    this.user = function() {
      var user = $session.get('user');
      if (user) {
        var deferred = $q.defer();
        $timeout(function() {
          deferred.resolve(user);
        }, 0);
        return deferred.promise;
      } else {
        return $http.get('/user');
      }
    };
  })
  .config(function($httpProvider) {
    var logsOutUserOn401 = function($location, $q, $session) {
      var success = function(response) {
        return response;
      };

      var error = function(response) {
        if (response.status === 401) {
          $session.unset('user');
          $location.path('/login');
          return $q.reject(response);
        } else {
          return $q.reject(response);
        }
      };

      return function(promise) {
        return promise.then(success, error);
      };
    };

    $httpProvider.responseInterceptors.push(logsOutUserOn401);
  })

  .run(function($rootScope, $location, AuthenticationService) {
    $rootScope.logout = function () {
      var logout = AuthenticationService.logout();
      logout.then(function() {
        $location.path('/login');
      });
      return logout;
    };
  })
  .run(function($rootScope, $location, AuthenticationService) {
    var publicRoutes = ['/login'];

    $rootScope.$on('$routeChangeStart', function() {
      if (publicRoutes.indexOf($location.path()) === -1) {
        AuthenticationService.user(); // http responseInterceptor will redirect to /login if this call fails
      }
    });
  }) */
  .config(function($routeProvider,$locationProvider,$httpProvider) {
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }).otherwise(
      {
      redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
  })
  .config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
  }])
  .factory('authInterceptor', function($q, $injector) {
    var state;
    return {
      request: function (config) {
        config.headers = config.headers || {};
        return config;
      },
      responseError: function(response) {
        if (response.status === 401) {
          (state || (state = $injector.get('$state'))).go('login');
          // remove any stale tokens
          //CookieService.removeTokenCookie();
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  });
