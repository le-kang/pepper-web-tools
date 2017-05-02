(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .factory('qi', qi);

  /** @ngInject **/
  function qi(QiSession, $log) {
    return {
      useService: function(service, resolve, reject) {
        $log.info('connected');
        QiSession(function(session) {
          session.service(service).then(function(serviceProxy) {
            resolve(serviceProxy)
          }, function(error) {
            reject();
            $log.error("An error occurred: ", error);
          })
        }, function() {
          $log.info('disconnected');
        }, 'pepper.local:80')
      }
    }
  }
})();
