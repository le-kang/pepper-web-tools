(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .factory('qi', qi);

  /** @ngInject **/
  function qi(pepperAddress, QiSession, _, $window, $rootScope, $http, $interval, $log, $mdDialog, $mdToast) {
    var serviceDict = {};
    var services = {};
    var loaded = 0;
    var totalModules = 0;
    var progress = null;

    $http
      .get('assets/tern-defs/qi.json')
      .then(function(res) {
        serviceDict = res.data.qi;
        totalModules = _.keys(serviceDict).length;
        initQiServices();
        progress = $interval(function() {
          $rootScope.$emit('qi-loading-progress', ((loaded/totalModules)*100).toFixed(2));
        }, 100);
      });

    function initQiServices() {
      QiSession(function(session) {
        _.forEach(_.keys(serviceDict), function(serviceName) {
          session.service(serviceName).then(function(service) {
            for (var property in service) {
              var methodList = _.keys(serviceDict[serviceName]);
              if (_.indexOf(methodList, property) === -1) {
                _.unset(service, property);
              }
            }
            services[serviceName] = service;
            loaded++;
            if (loaded === totalModules) {
              $rootScope.$emit('qi-loading-progress', ((loaded/totalModules)*100).toFixed(2));
              $rootScope.$emit('qi-loaded');
              $interval.cancel(progress);
            }
          }, function(error) {
            $log.error('An error occurred:', error);
            loaded++;
            if (loaded === totalModules) {
              $rootScope.$emit('qi-loading-progress', ((loaded/totalModules)*100).toFixed(2));
              $rootScope.$emit('qi-loaded');
              $interval.cancel(progress);
            }
          })
        });
      }, function() {
        services = {};
        var confirm = $mdDialog.confirm()
          .title('Connection to pepper lost!')
          .textContent('Please refresh this page to reconnect to the robot.')
          .ok('Refresh now')
          .cancel('Wait, I need to save my work!');
        $mdDialog.show(confirm).then(function() {
          $window.location.reload();
        }, function() {
          var toast = $mdToast.simple()
            .textContent('No connection to pepper. Refresh page to reconnect.')
            .action('Refresh')
            .highlightAction(true)
            .hideDelay(false);
          $mdToast.show(toast).then(function() {
            $window.location.reload();
          });
        });
      }, pepperAddress + ':80');
    }

    return services;
  }
})();
