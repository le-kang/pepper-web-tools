(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .controller('HomeController', HomeController);

  /** @ngIngect */
  function HomeController($rootScope, qi, toolList, _, $interval, $q, $state, $log, $mdDialog, $timeout) {
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
    vm.startMonitorApp = startMonitorApp;
    vm.hideWebView = hideWebView;
    vm.setVolume = setVolume;
    vm.say = say;
    vm.stopAllBehaviors = stopAllBehaviors;
    vm.setBasicAwareness = setBasicAwareness;
    vm.setStimulusDetectionEnabled = setStimulusDetectionEnabled;
    vm.setTrackingMode = setTrackingMode;
    vm.setEngagementMode = setEngagementMode;
    vm.start = start;

    $interval(updateWidgets, 1000);

    function updateWidgets() {
      if (_.isEmpty(qi)) {
        return;
      }
      var promises = [];
      promises.push(qi.ALTabletService.getBrightness().then(function(data) {
        vm.widgets.tablet.brightness = data * 100;
      }));
      promises.push(qi.ALAudioDevice.getOutputVolume().then(function(data) {
        vm.widgets.speech.volume = data;
      }));
      promises.push(qi.ALBasicAwareness.isRunning().then(function(data) {
        vm.widgets.basicAwareness.isRunning = data
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
      if (!qi.ALTabletService || $event.keyCode != 13) {
        return;
      }
      qi.ALTabletService.showWebview().then(function() {
        qi.ALTabletService.loadUrl(vm.widgets.tablet.url);
      });
    }

    function startMonitorApp() {
      if (!qi.ALTabletService) {
        return;
      }
      qi.ALTabletService.showWebview().then(function() {
        qi.ALTabletService.loadUrl('http://198.18.0.1:9000');
      });
    }

    function hideWebView() {
      if (!qi.ALTabletService) {
        return;
      }
      qi.ALTabletService.hideWebview();
    }

    function setBrightness() {
      if (!qi.ALTabletService) {
        return;
      }
      qi.ALTabletService.setBrightness(vm.widgets.tablet.brightness / 100);
    }

    function setVolume() {
      if (!qi.ALAudioDevice) {
        return;
      }
      qi.ALAudioDevice.setOutputVolume(vm.widgets.speech.volume);
    }

    function say($event) {
      if (!qi.ALTextToSpeech || $event.keyCode != 13) {
        return;
      }
      qi.ALTextToSpeech.say(vm.widgets.speech.words);
    }

    function stopAllBehaviors() {
      var steps = [
          {
            name: 'Disable autonomous life',
            started: true,
            finished: false
          },
          {
            name: 'Wake up robot',
            started: false,
            finished: false
          },
          {
            name: 'Enable basic awareness',
            started: false,
            finished: false
          },
          {
            name: 'Pause basic awareness',
            started: false,
            finished: false
          }
      ];
      $mdDialog.show({
        template:
        '<md-dialog aria-label="Stopping all behaviors">' +
        '  <md-dialog-content class="md-dialog-content">' +
        '    <h2 class="md-title">Stopping all behaviors</h2>' +
        '    <div layout="row" ng-repeat="step in $root.steps">' +
        '      <p flex style="margin: 5px 30px 5px 0;">{{ step.name }}</p>' +
        '      <md-icon class="material-icons" ng-class="{ spin: step.started }">' +
        '        {{ step.started ? "loop" : (step.finished ? "check" : "") }}' +
        '      </md-icon>' +
        '    </div>' +
        '  </md-dialog-content>' +
        '</md-dialog>',
        controller: function($rootScope) {
          $rootScope.steps = steps;
          $rootScope.$on('behaviors-stopping-progress', function(e, step) {
            $rootScope.steps[step - 1].started = false;
            $rootScope.steps[step - 1].finished = true;
            if (step < 4) {
              $rootScope.steps[step].started = true;
            } else {
              $timeout(function() {
                $mdDialog.hide()
              }, 1000)
            }
          });
        }
      });

      qi.ALAutonomousLife.setState('disabled').then(function() {
        $rootScope.$emit('behaviors-stopping-progress', 1);
        qi.ALMotion.wakeUp().then(function() {
          $rootScope.$emit('behaviors-stopping-progress', 2);
          qi.ALBasicAwareness.setEnabled(true).then(function() {
            $rootScope.$emit('behaviors-stopping-progress', 3);
            qi.ALBasicAwareness.pauseAwareness().then(function() {
              $rootScope.$emit('behaviors-stopping-progress', 4);
            })
          })
        });
      });
    }

    function setBasicAwareness() {
      if (!qi.ALBasicAwareness) {
        return;
      }
      if (vm.widgets.basicAwareness.isRunning) {
        qi.ALBasicAwareness.resumeAwareness();
      } else {
        qi.ALBasicAwareness.pauseAwareness();
      }
    }

    function setStimulusDetectionEnabled(stimulus) {
      if (!qi.ALBasicAwareness) {
        return;
      }
      var enabled = vm.widgets.basicAwareness.stimulus[stimulus];
      qi.ALBasicAwareness.setStimulusDetectionEnabled(stimulus, enabled).then(function() {
        qi.ALTextToSpeech.say('Stimulus detection of ' + stimulus + ' is ' + (enabled ? ' enabled' : ' disabled'));
      });
    }

    function setTrackingMode() {
      if (!qi.ALBasicAwareness) {
        return;
      }
      qi.ALBasicAwareness.setTrackingMode(vm.widgets.basicAwareness.trackingMode).then(function() {
        qi.ALTextToSpeech.say('Set tracking mode to ' + vm.widgets.basicAwareness.trackingMode);
      });
    }

    function setEngagementMode() {
      if (!qi.ALBasicAwareness) {
        return;
      }
      qi.ALBasicAwareness.setEngagementMode(vm.widgets.basicAwareness.engagementMode).then(function() {
        qi.ALTextToSpeech.say('Set engagement mode to ' + vm.widgets.basicAwareness.engagementMode);
      });
    }

    function start(tool) {
      $state.go(tool.toLowerCase().split(' ').join('-'))
    }
  }

})();