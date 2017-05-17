(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .controller('CodeEditorController', CodeEditorController);

  /** @ngIngect */
  function CodeEditorController($scope, Sandbox, qi, localStorageService, _, moment, $mdPanel, $mdDialog) {
    var DATE_FORMAT = 'DD/MM/YYYY HH:mm';
    var vm = this;
    vm.code = '';
    vm.showScriptList = false;
    vm.sandbox = null;
    vm.output = null;
    vm.currentScript = '';
    vm.focusedTab = 0;
    vm.context = { qi : qi };
    vm.scripts = localStorageService.get('scripts') || [];
    vm.newScript = newScript;
    vm.loadScript = loadScript;
    vm.saveScript = saveScript;
    vm.deleteScript = deleteScript;
    vm.runCode = runCode;
    vm.showHelp = showHelp;

    function newScript(e) {
      if (vm.code) {
        var confirm = $mdDialog.confirm()
          .title('Would you like to start a new script?')
          .textContent('Any unsaved code will be lost.')
          .targetEvent(e)
          .ok('Yes')
          .cancel('No');
        $mdDialog.show(confirm).then(function() {
          vm.currentScript = '';
          vm.code = '';
          $scope.$broadcast('set-code', vm.code);
        });
      }
    }

    function loadScript(name, code) {
      vm.currentScript = name;
      vm.code = code;
      $scope.$broadcast('set-code', vm.code);
      this.focusedTab = (this.focusedTab + 1) % 2;
    }

    function saveScript() {
      var prompt = $mdDialog.prompt()
        .title('What would you name your script?')
        .textContent('Use a new name if you don\'t want to overwrite a saved script.')
        .placeholder('Script name')
        .initialValue(vm.currentScript)
        .ok('Save')
        .cancel('Cancel');
      $mdDialog.show(prompt).then(function(name) {
        if (!name) {
          rejectSavingScript(name);
          return;
        }
        var scriptWithSameName = _.find(vm.scripts, { name: name });
        if (scriptWithSameName) {
          if (vm.currentScript && vm.currentScript === name) {
            scriptWithSameName.time = moment().format(DATE_FORMAT);
            scriptWithSameName.code = vm.code;
          } else {
            rejectSavingScript(name)
          }
        } else {
          vm.scripts.push({
            name: name,
            time: moment().format(DATE_FORMAT),
            code: vm.code
          });
          localStorageService.set('scripts', vm.scripts);
          vm.currentScript = name;
        }
      });
    }

    function rejectSavingScript(name) {
      var reason;
      if (name) {
        reason = 'Duplicate script name found, please rename it.'
      } else {
        reason = 'Script name cannot be empty.'
      }
      $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(false)
          .title('Script is not saved')
          .textContent(reason)
          .ok('Got it!')
      ).then(function() {
        saveScript();
      });
    }

    function deleteScript(e, name) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure to delete this script?')
        .textContent('You cannot retrieve deleted script.')
        .targetEvent(e)
        .ok('Yes')
        .cancel('No');
      $mdDialog.show(confirm).then(function() {
        _.remove(vm.scripts, function(script) {
          return script.name === name;
        });
        localStorageService.set('scripts', vm.scripts);
      });
    }

    function runCode() {
      if (vm.sandbox) {
        vm.sandbox.frame.parentNode.removeChild(vm.sandbox.frame);
        vm.sandbox = null;
      }
      vm.sandbox = new Sandbox({
        context: vm.context
      }, function(sb) {
        vm.output.clear();
        sb.run(vm.code, vm.output);
      })
    }

    function showHelp(e) {
      var _mdPanel = $mdPanel;
      var position = _mdPanel.newPanelPosition()
        .relativeTo('.editor-help')
        .addPanelPosition(_mdPanel.xPosition.ALIGN_START, _mdPanel.yPosition.ABOVE);
      var config = {
        attachTo: angular.element(document.body),
        template:
          '<div class="editor-help-panel md-whiteframe-2dp">' +
          '  <strong>Key Maps:</strong>' +
          '  <hr/>' +
          '  <dl>' +
          '    <dt>Tab</dt><dd>Auto-complete</dd>' +
          '    <dt>Ctrl-O</dt><dd>Find docs for the expression at the cursor</dd>' +
          '    <dt>Ctrl-I</dt><dd>Find type at cursor</dd>' +
          '    <dt>Alt-.</dt><dd>Jump to definition (Alt-, to jump back)</dd>' +
          '    <dt>Ctrl-Q</dt><dd>Rename variable</dd>' +
          '    <dt>Ctrl-.</dt><dd>Select all occurrences of a variable</dd>' +
          '  </dl>' +
          '</div>',
        panelClass: 'editor-help-panel',
        position: position,
        openFrom: e,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: false,
        zIndex: 5
      };
      _mdPanel.open(config);
    }
  }

})();