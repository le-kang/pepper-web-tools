(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .controller('HomeController', HomeController);

  /** @ngIngect */
  function HomeController(qi, toolList, _, $interval, $q, $state, $log) {
    var vm = this;
    vm.tools = toolList;
    vm.widgets = {
      tablet: {
        brightness: 0,
        url: ''
      },
      speech: {
        volume: 0,
        words: ''
      },
      basicAwareness: {
        isEnabled: false,
        stimulus: {
          People: false,
          Touch: false,
          TabletTouch: false,
          Sound: false,
          Movement: false,
          NavigationMotion: false
        },
        trackingMode: '',
        engagementMode: ''
      },
      initialized: false
    };

    vm.setBrightness = setBrightness;
    vm.showWebsite = showWebsite;
    vm.showLogos = showLogos;
    vm.hideWebView = hideWebView;
    vm.setVolume = setVolume;
    vm.say = say;
    vm.setBasicAwareness = setBasicAwareness;
    vm.setStimulusDetectionEnabled = setStimulusDetectionEnabled;
    vm.setTrackingMode = setTrackingMode;
    vm.setEngagementMode = setEngagementMode;
    vm.start = start;

    $interval(updateWidgets, 3000);

    function updateWidgets() {
      if (_.isEmpty(qi)) {
        return;
      }
      var promises = [];
      promises.push(qi.ALTabletService.getBrightness().then(function(data) {
        vm.widgets.tablet.brightness = data * 100;
      }));
      promises.push(qi.ALTextToSpeech.getVolume().then(function(data) {
        vm.widgets.speech.volume = data * 100;
      }));
      promises.push(qi.ALBasicAwareness.isEnabled().then(function(data) {
        vm.widgets.basicAwareness.isEnabled = data
      }));
      _.forEach(_.keys(vm.widgets.basicAwareness.stimulus), function(stimulus) {
        promises.push(qi.ALBasicAwareness.isStimulusDetectionEnabled(stimulus).then(function(data) {
          vm.widgets.basicAwareness.stimulus[stimulus] = data;
        }));
      });
      promises.push(qi.ALBasicAwareness.getTrackingMode().then(function(data) {
        vm.widgets.basicAwareness.trackingMode = data;
      }));
      promises.push(qi.ALBasicAwareness.getEngagementMode().then(function(data) {
        vm.widgets.basicAwareness.engagementMode = data;
      }));

      $q.all(promises).then(function() {
        vm.widgets.initialized = true;
      }, function(error) {
        $log.error("An error occurred: ", error);
      })
    }

    function showWebsite($event) {
      if (qi.ALTabletService || $event.keyCode != 13) {
        return;
      }
      qi.ALTabletService.showWebView().then(function() {
        qi.ALTabletService.loadUrl(vm.widgets.tablet.url);
      });
    }

    function showLogos() {
      if (qi.ALTabletService) {
        return;
      }
      qi.ALTabletService.showImage('http://198.18.0.1:8888/assets/images/logos.jpg');
    }

    function hideWebView() {
      if (qi.ALTabletService) {
        return;
      }
      qi.ALTabletService.hideWebView();
    }

    function setBrightness() {
      if (qi.ALTabletService) {
        return;
      }
      qi.ALTabletService.setBrightness(vm.widgets.tablet.brightness);
    }

    function setVolume() {
      if (qi.AlTabletService) {
        return;
      }
      qi.AlTabletService.setVolume(vm.widgets.speech.volume);
    }

    function say($event) {
      if (qi.ALTextToSpeech || $event.keyCode != 13) {
        return;
      }
      qi.ALTextToSpeech.say(vm.speech.words);
    }

    function setBasicAwareness() {
      if (qi.ALBasicAwareness) {
        return;
      }
      if (vm.widgets.basicAwareness.isEnabled) {
        qi.ALBasicAwareness.resumeBasicAwareness().then(function() {
          
        });
      } else {
        qi.ALBasicAwareness.pauseBasicAwareness().then(function() {

        });
      }
    }

    function setStimulusDetectionEnabled(stimulus) {
      var enabled = vm.widgets.basicAwareness.stimulus[stimulus];
      if (qi.ALBasicAwareness) {
        return;
      }
      qi.ALBasicAwareness.setStimulusDetectionEnabled(stimulus, enabled).then(function() {
        qi.ALTextToSpeech.say('Stimulus detection of ' + stimulus + ' is ' + (enabled ? ' enabled' : ' disabled'));
      });
    }

    function setTrackingMode() {
      if (qi.ALBasicAwareness) {
        return;
      }
      qi.ALBasicAwareness.setTrackingMode(vm.widgets.basicAwareness.trackingMode).then(function() {
        qi.ALTextToSpeech.say('Set tracking mode to ' + vm.widgets.basicAwareness.trackingMode);
      });
    }

    function setEngagementMode() {
      if (qi.ALBasicAwareness) {
        return;
      }
      qi.ALBasicAwareness.setEngagementMode().then(function() {
        qi.ALTextToSpeech.say('Set engagement mode to ' + vm.widgets.basicAwareness.engagementMode);
      });
    }

    function start(tool) {
      $state.go(tool.toLowerCase().split(' ').join('-'))
    }
  }

})();