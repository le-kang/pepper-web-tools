(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .run(loadQiModules);

  /** @ngInject */
  function loadQiModules($rootScope, $state, $timeout, qi, $window, $mdDialog, $mdToast) {
    var checkQiLoadingProgress = $rootScope.$on('$stateChangeStart', function(event, next) {
      event.preventDefault();
      $mdDialog.show({
        template:
          '<md-dialog aria-label="Loading Qi Services">' +
          '  <md-dialog-content class="md-dialog-content">' +
          '    <h2 class="md-title">Loading Qi Modules</h2>' +
          '    <md-progress-linear md-mode="determinate" value="{{ $root.qiLoadingProgress }}"></md-progress-linear>' +
          '  </md-dialog-content>' +
          '</md-dialog>',
        controller: function($rootScope) {
          $rootScope.qiLoadingProgress = 0;
          $rootScope.$on('qi-loading-progress', function(e, data) {
            $rootScope.qiLoadingProgress = data;
          });
        }
      });

      var timeout = $timeout(function() {
        $mdDialog.hide();
        var confirm = $mdDialog.confirm()
          .title('Failed to connect to pepper')
          .textContent('Tools and widget will not work. Try to refresh to reconnect to the robot.')
          .ok('Refresh now')
          .cancel('I will refresh later');
        $mdDialog.show(confirm).then(function() {
          $window.location.reload();
        }, function() {
          checkQiLoadingProgress();
          $state.go(next.name);
          var toast = $mdToast.simple()
            .textContent('Not connected to pepper.')
            .action('Reconnect')
            .highlightAction(true)
            .hideDelay(false);
          $mdToast.show(toast).then(function() {
            $window.location.reload();
          });
        });
      }, 30000);

      $rootScope.$on('qi-loaded', function() {
        $timeout.cancel(timeout);
        $timeout(function() {
          $mdDialog.hide();
          checkQiLoadingProgress();
          $state.go(next.name);
        }, 500)
      });
    });
  }
})();
