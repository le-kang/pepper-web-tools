/* global QiSession:false, nipplejs:false, CodeMirror: false, SandBox: false */
(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .constant('_', window._)
    .constant('QiSession', QiSession)
    .constant('nipplejs', nipplejs)
    .constant('CodeMirror', CodeMirror)
    .constant('Sandbox', SandBox);

})();
