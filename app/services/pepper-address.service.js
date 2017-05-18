(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .factory('pepperAddress', pepperAddress);

  /** @ngInject **/
  function pepperAddress($location) {
    return $location.host();
  }
})();
