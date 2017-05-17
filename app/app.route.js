(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'HomeController',
        controllerAs: 'pepper'
      })
      .state('joystick', {
        url: '/joystick',
        templateUrl: 'views/joystick.html',
        controller: 'JoystickController',
        controllerAs: 'joystick'
      })
      .state('video-stream', {
        url: '/video-stream',
        templateUrl: 'views/video-stream.html',
        controller: 'VideoStreamController',
        controllerAs: 'video'
      })
      .state('behavior-manager', {
        url: '/behavior-manager',
        templateUrl: 'views/behavior-manager.html',
        controller: 'BehaviorManagerController',
        controllerAs: 'behaviorManager'
      })
      .state('code-editor', {
        url: '/code-editor',
        templateUrl: 'views/code-editor.html',
        controller: 'CodeEditorController',
        controllerAs: 'editor'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
