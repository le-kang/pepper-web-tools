(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .controller('HomeController', HomeController);

  /** @ngIngect */
  function HomeController($state) {
    var vm = this;
    vm.tools = ['Joystick', 'Video Stream', 'Behavior Launcher'];
    vm.start = start;

    function start(tool) {
      $state.go(tool.toLowerCase().split(' ').join('-'))
    }
  }

})();