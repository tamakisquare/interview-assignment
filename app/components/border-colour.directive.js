(function() {
  'use strict';

  angular
    .module('myApp.directives', [])
    .directive('borderColour', borderColour);

  function borderColour() {
    var directive = {
      restrict: 'A',
      controller: controllFn,
      link: linkFn
    };

    return directive;

    function controllFn() {

    }

    function linkFn() {

    }
  }
})();
