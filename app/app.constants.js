/* global QiSession:false, nipplejs:false */
(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .constant('_', window._)
    .constant('QiSession', QiSession)
    .constant('nipplejs', nipplejs);

})();
