(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .controller('HomeController', HomeController);

  /** @ngIngect */
  function HomeController($state) {
    var vm = this;
    vm.tools = ['Joystick', 'Video Stream', 'Behavior Manager', 'Code Editor'];
    vm.start = start;

    function start(tool) {
      $state.go(tool.toLowerCase().split(' ').join('-'))
    }
  }

})();