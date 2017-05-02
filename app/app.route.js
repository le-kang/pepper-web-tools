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
        controllerAs: 'home'
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
      .state('behavior-launcher', {
        url: '/behavior-launcher',
        templateUrl: 'views/behavior-manager.html',
        controller: 'BehaviorManagerController',
        controllerAs: 'behaviorManager'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
