/* global moment: false, QiSession:false, nipplejs:false, CodeMirror: false, SandBox: false */
(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .constant('_', window._)
    .constant('moment', moment)
    .constant('QiSession', QiSession)
    .constant('nipplejs', nipplejs)
    .constant('CodeMirror', CodeMirror)
    .constant('Sandbox', SandBox)
    .constant('toolList', ['Joystick', 'Video Stream', 'Behavior Manager', 'Code Editor']);

})();
