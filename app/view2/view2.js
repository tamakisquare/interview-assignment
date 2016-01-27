'use strict';

angular.module('myApp.view2', ['ngRoute', 'myApp.services', 'myApp.directives'])

.config(function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl',
    controllerAs: 'postVm'
  });
})

.controller('View2Ctrl', function(blogPost) {
  var vm = this;

  vm.colour = '';
  vm.currentPost = blogPost.getRandom();
});
