(function () {
  'use strict';

  angular.module('funsha', [
    'ionic',
    'ngMessages',
    'ngResource',
    'ngCordova',
    'ngImgCrop',
    'angular-jwt',
    'AngularGM',
    'ngIOS9UIWebViewPatch',
    'funsha.constants',
    'funsha.controllers',
    'funsha.directives',
    'funsha.factories',
    'funsha.services'
  ])
    .run(runBlock)
    .config(configBlock)
    .service();


  runBlock.$inject = ['$ionicPlatform', '$rootScope', '$state', 'StorageService', 'jwtHelper'];
  function runBlock($ionicPlatform, $rootScope, $state, StorageService, jwtHelper) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }
    });

    /*$rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromStateParams) {
     console.log('$stateChangeStart', toState);

     var idToken = StorageService.getJwtToken();

     if (idToken && !jwtHelper.isTokenExpired(idToken)) {
     if (toState.name === 'intro') {
     console.log('Trying to go to intro page.');
     event.preventDefault();
     }
     console.log('Token exists and not expired');
     } else if (!idToken) {
     //event.preventDefault();
     StorageService.removeAllUserData();
     //$state.go('intro');
     console.log('Token does not exists');
     }
     });*/

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toStateParams, fromState, fromStateParams) {
      //console.log('$stateChangeSuccess', toState);

      var idToken = StorageService.getJwtToken();

      if (idToken && idToken !== null) {
        if (toState.name === 'intro') {
          console.log('Trying to go to intro page success.');
          setTimeout(function () {
            $state.go('app.circles');
          });
        }
        //console.log('$stateChangeSuccess : Token exists and not expired');
      } else if (!idToken) {
        StorageService.removeAllUserData();
        setTimeout(function () {
          $state.go('intro');
        });
        //console.log('$stateChangeSuccess : Token does not exists');
      }
    });

    $rootScope.$on('$stateChangeError', function (event, toState, toStateParams, fromState, fromStateParams) {
      console.log('$stateChangeError');
    });


  }

  configBlock.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider', '$resourceProvider', 'jwtInterceptorProvider', 'ApiUrls'];
  function configBlock($stateProvider, $urlRouterProvider, $httpProvider, $resourceProvider, jwtInterceptorProvider, ApiUrls) {

    $stateProvider
      .state('intro', {
        url: '/intro',
        templateUrl: 'account/intro.html',
        controller: 'AccountCtrl as accountCtrl'
      })

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      .state('app.circles', {
        url: '/circles',
        views: {
          'tab-circles': {
            templateUrl: 'circles/circles-tab.html',
            controller: 'CirclesCtrl as circle'
          }
        }
      })

      .state('app.transactions', {
        url: '/transactions',
        views: {
          'tab-transactions': {
            templateUrl: 'transactions/transactions-tab.html',
            controller: 'TransactionsCtrl as trnx'
          }
        }
      })

      .state('app.conversations', {
        url: '/conversations',
        views: {
          'tab-conversations': {
            templateUrl: 'conversations/conversations-tab.html',
            controller: 'ConversationsCtrl as convs'
          }
        }
      })

      .state('app.notifications', {
        url: '/notifications',
        views: {
          'tab-notifications': {
            templateUrl: 'notifications/notifications-tab.html',
            controller: 'NotificationsCtrl as noti'
          }
        }
      })

      .state('app.more', {
        url: '/more',
        views: {
          'tab-more': {
            templateUrl: 'more/more-tab.html',
            controller: 'MoreController as more'
          }
        }
      })

      .state('app.my-items', {
        url: '/my-items',
        views: {
          'tab-more': {
            templateUrl: 'more/my-items.html',
            controller: 'MoreController as more'
          }
        }
      })

      .state('app.my-wishes', {
        url: '/my-wishes',
        views: {
          'tab-more': {
            templateUrl: 'more/my-wishes.html',
            controller: 'MoreController as more'
          }
        }
      })

      .state('app.settings', {
        url: '/settings',
        views: {
          'tab-more': {
            templateUrl: 'more/settings.html',
            controller: 'MoreController as more'
          }
        }
      })
      .state('app.profile', {
        url: '/profile',
        views: {
          'tab-more': {
            templateUrl: 'more/profile.html',
            controller: 'ProfileController as profile'
          }
        }
      })
      .state('app.account', {
        url: '/account',
        views: {
          'tab-more': {
            templateUrl: 'more/account.html',
            controller: 'MoreAccountController as moreAccount'
          }
        }
      })
      .state('app.pending-email', {
        url: '/pending-email',
        views: {
          'tab-more': {
            templateUrl: 'more/pending-email-change.html',
            controller: 'MoreAccountController as moreAccount'
          }
        }
      })
      .state('app.meetup-locations', {
        url: '/meetup-locations',
        views: {
          'tab-more': {
            templateUrl: 'more/meetup-locations.html',
            controller: 'LocationsController as location'
          }
        }
      })
      .state('app.location-details', {
        url: '/location-details',
        views: {
          'tab-more': {
            templateUrl: 'more/location-details.html',
            controller: 'LocationDetailsController as locDetails'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/intro');

    jwtInterceptorProvider.authPrefix = 'JWT ';
    jwtInterceptorProvider.tokenGetter = ['$http', '$state', 'jwtHelper', 'config', 'StorageService',
      function ($http, $state, jwtHelper, config, StorageService) {
        var idToken = localStorage.getItem('token');
        var refreshToken = localStorage.getItem('refresh_token');

        // Skip authentication for any requests ending in .html
        if (config.url.substr(config.url.length - 5) == '.html') {
          return null;
        }

        if (idToken && jwtHelper.isTokenExpired(idToken)) {
          // This is a promise of a JWT id_token
          return $http({
            url: ApiUrls.baseUrl + ApiUrls.apiTokenDelegation,
            skipAuthorization: true,
            method: 'POST',
            data: {
              client_id: angular.fromJson(localStorage.getItem('user')).id,
              //grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
              refresh_token: refreshToken
            }
          }).then(function (response) {
            console.log('success data from the refresh token', response);
            var id_token = response.data.token;
            localStorage.setItem('token', id_token);
            localStorage.setItem('user', angular.toJson(response.data.user));
            return id_token;
          }, function (error) {
            StorageService.removeAllUserData();
            $state.go('intro');
            console.log('error data from the refresh token', error);
          });
        } else {
          return idToken;
        }
      }];

    $httpProvider.interceptors.push('jwtInterceptor');

    $httpProvider.interceptors.push(function ($q, $injector) {
      return {
        requestError: function (req) {
          if (req.url.indexOf('.html') < 0) {
            cordova.plugins.Keyboard.close();
            //console.log('From request interceptor : ', req);
          }
          return $q.reject(req);
        },
        responseError: function (res) {
          if (res.config.url.indexOf('.html') < 0) {
            var popup = $injector.get('$ionicPopup');

            console.log('From response interceptor : ', res);
            if (res.status === 500) {
              popup.alert({
                title: 'Server Error',
                template: 'Oops! We are sorry that the server has ran into trouble while fulfilling your request. Please try it again at a later time as the investigation is underway.'
              });
            } else if (res.status === 0) {
              popup.alert({
                title: 'Server Error',
                template: 'Unable to connect to the server. Please check your connection and try again.'
              });
            }
          }
          return $q.reject(res);
        }
      };
    });


    //Conversion from camel case to snake case and vice versa
    var nameCase = getNameCase();

    // Converts attribute names from camelCase to snake_case
    var camelToUnderscore = function (req) {
      var isFile = function (obj) {
        return obj.toString() === '[object File]';
      };

      return angular.isObject(req) && !isFile(req) ? nameCase.convertJsonObj(req, nameCase.camelToUnderscore) : req;
    };
    // Converts attribute names from snake_case to camelCase
    var underscoreToCamel = function (resp) {
      return angular.isObject(resp) ? nameCase.convertJsonObj(resp, nameCase.underscoreToCamel) : resp;
    };

    $httpProvider.defaults.transformRequest.unshift(camelToUnderscore);
    $httpProvider.defaults.transformResponse.push(underscoreToCamel);

    // Don't strip trailing slashes off urls used by $resource
    $resourceProvider.defaults.stripTrailingSlashes = false;

    function getNameCase() {
      var camelToUnderscore = function (name) {
        var camelPtn = /([A-Z])/g;
        var replacer = function (match) {
          return _.str.sprintf('_%s', match.toLowerCase());
        };

        return name.replace(camelPtn, replacer);
      };

      var underscoreToCamel = function (name) {
        var underscorePtn = /_([a-z])/g;
        var replacer = function (match) {
          return match.slice(1).toUpperCase();
        };

        return name.replace(underscorePtn, replacer);
      };

      var convertJsonObj = function (obj, convertFn) {
        var newObj;
        if (angular.isArray(obj)) {
          newObj = [];
          angular.forEach(obj, function (val, index) {
            newObj[index] = angular.isObject(val) && !angular.isDate(val) ? convertJsonObj(val, convertFn) : val;
          });
        }
        else {
          newObj = {};
          angular.forEach(obj, function (val, key) {
            newObj[convertFn(key)] = angular.isObject(val) && !angular.isDate(val) ? convertJsonObj(val, convertFn) : val;
          });
        }

        return newObj;
      };

      return {
        camelToUnderscore: camelToUnderscore,
        underscoreToCamel: underscoreToCamel,
        convertJsonObj: convertJsonObj
      };
    }

  }

})();
