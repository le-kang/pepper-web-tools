(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .factory('qi', qi);

  /** @ngInject **/
  function qi(QiSession, _, $window, $rootScope, $interval, $log) {
    var moduleList = [
      'ServiceDirectory',
      'LogManager',
      'PackageManager',
      'ALServiceManager',
      'ALCloudToken',
      'ALFileManager',
      'ALMemory',
      'ALLogger',
      'ALPreferences',
      'ALConnectionManager',
      'ALPreferenceManager',
      'ALFrameManager',
      'ALDebug',
      'ALNotificationManager',
      'DCM',
      'ALTabletService',
      'ALResourceManager',
      'ALRobotModel',
      'ALTactileGesture',
      'SBREEMCommService',
      'ALDiagnosis',
      'SolitaryManagerService',
      'FannyPoseService',
      'ALSonar',
      'ALFsr',
      'ALSensors',
      'ACSPresence',
      'ALBodyTemperature',
      'SBRYTPCommService',
      'FourSeasonsService',
      'KpiLib',
      'ACSMessage',
      'ALMotion',
      'ALTouch',
      'ALRobotPosture',
      'ALMotionRecorder',
      'ALLeds',
      'ALWorldRepresentation',
      'ALVideoDevice',
      'ALColorBlobDetection',
      'ALRedBallDetection',
      'ALFaceDetection',
      'ALVisionRecognition',
      'ALLandMarkDetection',
      'ALDarknessDetection',
      'ALBacklightingDetection',
      'ALPhotoCapture',
      'ALVideoRecorder',
      'ALVisualCompass',
      'ALVisualSpaceHistory',
      'ALSystem',
      'ALKnowledgeManager',
      'ALKnowledge',
      'ALPhotoStorage',
      'ALModularity',
      'AudioFilterLoader',
      'ALAudioDevice',
      'ALAudioRecorder',
      'ALAudioPlayer',
      'ALTextToSpeech',
      'ALSpeechRecognition',
      'ALVoiceEmotionAnalysis',
      'ALBattery',
      'ALChestButton',
      'ALMecaLogger',
      'ALPythonBridge',
      'ALLauncher',
      'ALLaser',
      'ALBehaviorManager',
      'ALAnimationPlayer',
      'ALSpeakingMovement',
      'ALAnimatedSpeech',
      'ALStore',
      'ALMemoryWatcher',
      'ALNavigation',
      'ALTelepathe',
      'ALTracker',
      'ALLocalization',
      'ALPanoramaCompass',
      'ALRobotHealthMonitor',
      'ALSegmentation3D',
      'ALBarcodeReader',
      'ALMovementDetection',
      'ALPeoplePerception',
      'ALEngagementZones',
      'ALSittingPeopleDetection',
      'ALGazeAnalysis',
      'ALWavingDetection',
      'ALFaceCharacteristics',
      'ALCloseObjectDetection',
      'ALSoundDetection',
      'ALSoundLocalization',
      'ALAudioSourceLocalization',
      'ALUserInfo',
      'ALUserSession',
      'ALThinkingExpression',
      'ALBasicAwareness',
      'OTDialogContext',
      'ALAutonomousBlinking',
      'ALBackgroundMovement',
      'ALListeningMovement',
      'ALAutonomousMoves',
      'ALExpressionWatcher',
      'ALSignsAndFeedback',
      'ALAutonomousLife',
      'ALGoToSleep',
      'ALDialog',
      'ALPodDetection',
      'QuietModeService',
      'ALRecharge',
      'ALRALManagerModule',
      'ALMood',
      'OTDialogInterface',
      'OTDialogInterface_sub',
      'PyPepperServer',
      'SBRRHCCommService',
      'SBRCGMYCommService'
    ];
    var modules = {};
    var loaded = 0;
    var totalModules = moduleList.length;

    var progress = $interval(function() {
      $rootScope.$emit('qi-loading-progress', ((loaded/totalModules)*100).toFixed(2));
    }, 100);

    QiSession(function(session) {
      _.forEach(moduleList, function(module) {
        session.service(module).then(function(m) {
          if (_.has(m, 'getMethodList')) {
            m.getMethodList().then(function(list) {
              for(var property in m) {
                if (_.indexOf(list, property) == -1) {
                  _.unset(m, property);
                }
              }
              modules[module] = m;
            });
          }
          loaded++;
          if (loaded == totalModules) {
            $rootScope.$emit('qi-loading-progress', ((loaded/totalModules)*100).toFixed(2));
            $rootScope.$emit('qi-loaded');
            $interval.cancel(progress);
          }
        }, function(error) {
          $log.error('An error occurred:', error)
        })
      });
    }, function() {
      $window.location.reload();
    }, '138.25.61.104:80');

    return modules;
  }
})();
