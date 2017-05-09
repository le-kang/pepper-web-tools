(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .controller('CodeEditorController', CodeEditorController);

  /** @ngIngect */
  function CodeEditorController(Sandbox, qi) {
    var vm = this;
    vm.code = '';
    vm.sandbox = null;
    vm.output = null;
    vm.context = { qi : qi };
    vm.runCode = runCode;

    function runCode() {
      if (vm.sandbox) {
        vm.sandbox.frame.parentNode.removeChild(vm.sandbox.frame);
        vm.sandbox = null;
      }
      vm.sandbox = new Sandbox({
        context: vm.context
      }, function(sb) {
        vm.output.clear();
        sb.run(vm.code, vm.output);
      })
    }
  }

})();