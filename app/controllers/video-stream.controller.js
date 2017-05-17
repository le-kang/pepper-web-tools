(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .controller('VideoStreamController', VideoStreamController);

  /** @ngIngect */
  function VideoStreamController($scope, $window, pepperAddress) {
    var vm = this;
    vm.showTop = true;
    vm.showBottom = true;
    vm.showExtra = [];
    vm.pepperAddress = pepperAddress;
    vm.headMovingDirection = '';
    vm.moveHead = moveHead;
    vm.stopMovingHead = stopMovingHead;

    $window.addEventListener('keydown', function(e) {
      $scope.$emit('set-direction', e);
    });

    $window.addEventListener('keyup', function(e) {
      if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
        $scope.$emit('unset-direction');
      }
    });

    $scope.$on('set-direction', function(e, event) {
      if (event.keyCode == 38) {
        moveHead('up');
      } else if (event.keyCode == 37) {
        moveHead('left');
      } else if (event.keyCode == 40) {
        moveHead('down');
      } else if (event.keyCode == 39) {
        moveHead('right');
      }
    });

    $scope.$on('unset-direction', function() {
      vm.headMovingDirection = '';
    });

    function moveHead(direction) {
      vm.headMovingDirection = direction;
    }

    function stopMovingHead() {
      vm.headMovingDirection = '';
    }
  }

})();