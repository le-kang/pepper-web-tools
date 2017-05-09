(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .run(loadQiModules);

  /** @ngInject */
  function loadQiModules($rootScope, $state, $timeout, qi, $mdDialog) {
    var checkQiLoadingProgress = $rootScope.$on('$stateChangeStart', function(event, next) {
      event.preventDefault();
      $mdDialog.show({
        template:
          '<md-dialog aria-label="Loading Qi Modules">' +
          '  <md-dialog-content class="md-dialog-content">' +
          '    <h2 class="md-title">Loading Qi Modules</h2>' +
          '    <md-progress-linear md-mode="determinate" value="{{ $root.qiLoadingProgress }}"></md-progress-linear>' +
          '  </md-dialog-content>' +
          '</md-dialog>',
        controller: function($rootScope) {
          $rootScope.$on('qi-loading-progress', function(e, data) {
            $rootScope.qiLoadingProgress = data;
          });
        }
      });

      $rootScope.$on('qi-loaded', function() {
        $timeout(function() {
          $mdDialog.hide();
          checkQiLoadingProgress();
          $state.go(next.name);
        }, 500)
      });
    });
  }
})();
