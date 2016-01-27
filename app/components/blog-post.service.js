(function() {
  'use strict';

  angular
    .module('myApp.services', [])
    .factory('blogPost', blogPost);

  function blogPost($http) {
    var service = {
      getRandom: getRandom
    };

    return service;

    function getRandom() {
      // between 1 to 10, inclusive.
      var randomId = Math.floor(Math.random() * (10 - 1 + 1)) + 1;

      return $http.get('http://jsonplaceholder.typicode.com/posts/' + randomId);
    }
  }
})();
