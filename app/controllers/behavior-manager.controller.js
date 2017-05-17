(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .controller('BehaviorManagerController', BehaviorManagerController);

  /** @ngIngect */
  function BehaviorManagerController($scope, qi, _, $log, $interval) {
    var vm = this;
    vm.loading = true;
    vm.installedBehaviors = [];
    vm.builtInBehaviors = [];
    vm.filter = '';
    vm.runningBehaviors = [];
    vm.clearFilter = clearFilter;
    vm.play = play;
    vm.stop = stop;
    vm.isRunning = isRunning;

    loadBehaviors();

    function loadBehaviors() {
      if (!qi.ALBehaviorManager) {
        return;
      }
      qi.ALBehaviorManager.getBehaviorNames().then(function(behaviors) {
        behaviors = _.uniq(behaviors);
        vm.installedBehaviors = _.filter(behaviors, function(behavior) {
          // filter out of .lastUploadedChoregrapheBehavior
          return behavior.startsWith('User/') && !behavior.startsWith('User/.');
        });
        vm.builtInBehaviors = _.filter(behaviors, function(behavior) {
          return behavior.startsWith('System/animations/Stand/');
        });
        vm.loading = false;
        $scope.$apply();
        $interval(checkRunningBehaviors, 1000)
      }, function(error) {
        $log.error("An error occurred: ", error);
      });

    }

    function clearFilter() {
      vm.filter = '';
    }

    function play(behaviorName) {
      if (!isRunning(behaviorName)) {
        vm.runningBehaviors.push(behaviorName);
        qi.ALBehaviorManager.runBehavior(behaviorName);
      }
    }

    function stop(behaviorName) {
      if (isRunning(behaviorName)) {
        qi.ALBehaviorManager.stopBehavior(behaviorName);
      }
    }

    function isRunning(behaviorName) {
      return _.indexOf(vm.runningBehaviors, behaviorName.replace(/User[\/]|System[\/]/g, '')) != -1;
    }

    function checkRunningBehaviors() {
      qi.ALBehaviorManager.getRunningBehaviors().then(function(behaviors) {
        vm.runningBehaviors = behaviors;
        $scope.$apply();
      }, function(error) {
        $log.error("An error occurred: ", error);
      });
    }
  }

})();