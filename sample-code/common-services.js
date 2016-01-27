(function () {
  'use strict';

  angular.module('funsha.services', [])
    .service('CommonServices', CommonServices);

  CommonServices.$inject = ['$ionicPopup', '$ionicLoading'];
  function CommonServices($ionicPopup, $ionicLoading) {

    this.newUserCreated = false;

    this.isOnline = function () {
      return window.navigator.onLine;
    };

    this.isEmptyObject = function (obj) {
      return JSON.stringify(obj) === '{}';
    };

    this.isAnyFieldUndefined = function (obj) {
      var undefinedField = false;
      angular.forEach(Object.keys(obj), function (val, key) {
        if (!obj[val]) {
          undefinedField = true;
        }
      });
      return undefinedField;
    };

    this.showAlert = function (title, template) {
      title = title || 'Error';
      template = (template || template == '') ? template : 'There was some error.';

      var alertPopup = $ionicPopup.alert({
        title: title,
        template: template
      });
      alertPopup.then(function (res) {
        console.log('Alert closed');
      });
    };

    this.showConfirm = function (title, template, btn1, btn2, cb) {
      title = title || 'Confirm';
      template = (template || template == '') ? template : 'Confirm template.';
      btn1 = btn1 || 'Cancel';
      btn2 = btn2 || 'Save';

      var confirmPopup = $ionicPopup.confirm({
        title: title,
        template: template,
        buttons: [
          {
            text: btn1,
            type: 'button-positive',
            onTap: function (e) {
              cb(false);
            }
          },
          {
            text: '<b>' + btn2 + '</b>',
            type: 'button-positive',
            onTap: function (e) {
              cb(true);
            }
          }
        ]
      });
      confirmPopup.then(function (res) {
        console.log('Tapped!', res);
      });
    };


    this.showLoader = function (template) {
      var template = template || 'Please wait..';
      $ionicLoading.show({
        template: template
      });
    };

    this.hideLoader = function () {
      $ionicLoading.hide();
    };

    this.showKeyboard = function () {
      try {
        cordova.plugins.Keyboard.show();
      } catch (e) {
        console.log('Error while trying to access the keyboard');
      }
    };
    this.hideKeyboard = function () {
      try {
        cordova.plugins.Keyboard.close();
      } catch (e) {
        console.log('Error while trying to access the keyboard');
      }
    };

    this.userCreated = function(val){
      this.newUserCreated = val;
    };

    this.isUserCreated = function(val){
      return this.newUserCreated;
    };


  }

})();
