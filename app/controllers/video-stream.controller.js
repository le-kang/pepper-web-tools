(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .controller('VideoStreamController', VideoStreamController);

  /** @ngIngect */
  function VideoStreamController($scope, $window, $interval, pepperAddress, qi, $log) {
    var vm = this;
    vm.showTop = true;
    vm.showBottom = true;
    vm.showExtra = false;
    vm.extraTopic = '';
    vm.pepperAddress = pepperAddress;
    vm.headMovingDirection = '';
    vm.startMovingHead = startMovingHead;
    vm.stopMovingHead = stopMovingHead;
    var moving = false;
    var moveTimer;

    $window.addEventListener('keydown', function(e) {
      if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
        $scope.$emit('start-moving-head', e);
      }
    });

    $window.addEventListener('keyup', function(e) {
      if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
        $scope.$emit('stop-moving-head');
      }
    });

    $scope.$on('start-moving-head', function(e, event) {
      if (vm.headMovingDirection !== '') {
        return;
      }
      if (event.keyCode == 38) {
        startMovingHead('up');
      } else if (event.keyCode == 37) {
        startMovingHead('left');
      } else if (event.keyCode == 40) {
        startMovingHead('down');
      } else if (event.keyCode == 39) {
        startMovingHead('right');
      }
    });

    $scope.$on('stop-moving-head', function() {
      if (vm.headMovingDirection === '') {
        return;
      }
      stopMovingHead();
    });

    function startMovingHead(direction) {
      vm.headMovingDirection = direction;
      moveHead();
      moveTimer = $interval(function() {
        if (!moving) moveHead();
      }, 100)
    }

    function stopMovingHead() {
      vm.headMovingDirection = '';
      $interval.cancel(moveTimer);
    }

    function moveHead() {
      var change = 0.2;
      if (qi.ALMotion) {
        moving = true;
        qi.ALMotion.setStiffnesses("Head", 1.0).then(function() {
          switch(vm.headMovingDirection) {
            case 'up':
              qi.ALMotion.changeAngles("HeadPitch", -change, 0.05).then(function() {
                moving = false;
              }, function(error) {
                moving = false;
                $log.error("An error occurred: ", error);
              });
              break;
            case 'down':
              qi.ALMotion.changeAngles("HeadPitch", change, 0.05).then(function() {
                moving = false;
              }, function(error) {
                moving = false;
                $log.error("An error occurred: ", error);
              });
              break;
            case 'left':
              qi.ALMotion.changeAngles("HeadYaw", change, 0.05).then(function() {
                moving = false;
              }, function(error) {
                moving = false;
                $log.error("An error occurred: ", error);
              });
              break;
            case 'right':
              qi.ALMotion.changeAngles("HeadYaw", -change, 0.05).then(function() {
                moving = false;
              }, function(error) {
                moving = false;
                $log.error("An error occurred: ", error);
              });
              break;
          }
        })
      }
    }
  }

})();