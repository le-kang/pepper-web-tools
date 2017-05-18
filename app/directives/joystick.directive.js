(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .directive('joystick', joystick);

  /** @ngInject */
  function joystick($timeout, nipplejs, qi, $interval, $log) {
    var directive = {
      restrict: 'A',
      link: link
    };
    var moving = false;

    return directive;

    function link(scope, el) {
      var radianPerRotate = Math.PI/9;
      var distancePerMove = 0.2;
      var distance, radian, direction, moveTimer;

      $timeout(function() {

        var joystick = nipplejs.create({
          zone: el[0],
          mode: 'static',
          size: 200,
          position: {left: '50%', top: '50%'},
          color: 'blue'
        });

        joystick
          .on('start', function() {
            if (!qi.ALMotion) {
              return;
            }
            $log.log('start');
            moveTimer = $interval(function() {
              if (!moving && distance > 50) {
                moveRobot(qi.ALMotion, distancePerMove * Math.sin(radian), -(distancePerMove * Math.cos(radian)), 0);
              } else if (!moving && distance > 15 && direction) {
                moveRobot(qi.ALMotion, 0, 0, direction == "right" ? -radianPerRotate: radianPerRotate);
              }
            }, 100)
          })
          .on('move', function(e, data) {
            distance = data.distance;
            radian = data.angle.radian;
            direction = data.direction ? data.direction.x : null;
          })
          .on('end', function() {
            $log.log('end');
            if (moveTimer) {
              $interval.cancel(moveTimer);
            }
          });
      }, 1000)
    }

    function moveRobot(motion, x, y, r) {
      moving = true;
      motion.moveTo(x, y, r).then(function() {
        moving = false;
      }, function(error) {
        moving = false;
        $log.error("An error occurred: ", error);
      });
    }
  }

})();
