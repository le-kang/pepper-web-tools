(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .directive('sandboxOutput', sandboxOutput);

  /** @ngInject */
  function sandboxOutput(Sandbox) {
    var directive = {
      restrict: 'A',
      scope: {
        output: '='
      },
      link: link
    };

    return directive;

    function link(scope, el) {
      scope.output = new Sandbox.Output(el[0]);
    }
  }

})();
