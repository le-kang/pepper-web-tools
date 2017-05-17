(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .controller('HeaderController', HeaderController);

  /** @ngIngect */
  function HeaderController($rootScope, $scope, toolList, $interval, qi) {
    var vm = this;
    vm.tools = toolList;
    vm.batteryLevel = 0;

    $rootScope.$on('qi-loaded', function() {
      getBatteryLevel();
    });

    $interval(getBatteryLevel, 1000*60);

    function getBatteryLevel() {
      if (qi.ALBattery) {
        qi.ALBattery.getBatteryCharge().then(function(data) {
          vm.batteryLevel = data;
          $scope.$apply();
        });
      }
    }
  }

})();