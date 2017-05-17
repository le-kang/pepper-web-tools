(function() {
  'use strict';

  angular
    .module('pepperWebTools')
    .directive('codeEditor', codeEditor);

  /** @ngInject */
  function codeEditor(CodeMirror, $timeout, $http, $q, $log) {
    var directive = {
      restrict: 'A',
      scope: {
        defs: '@',
        code: '='
      },
      link: link
    };

    return directive;

    function link(scope, el) {
      $timeout(function() {
        var ternServer;
        var editor = CodeMirror.fromTextArea(el[0], {
          code: scope.code,
          mode: 'javascript',
          lineNumbers: true,
          lineWrapping: true,
          gutters: ["CodeMirror-lint-markers"],
          lint: true,
          lintOnChange: false
        });

        loadTernDefinitions(scope.defs, function(defs) {
          ternServer = new CodeMirror.TernServer({
            defs: defs,
            ecmaVersion: 5
          });
          editor.setOption('extraKeys', {
            'Tab': function(cm) { ternServer.complete(cm); },
            'Ctrl-I': function(cm) { ternServer.showType(cm); },
            'Ctrl-O': function(cm) { ternServer.showDocs(cm); },
            'Alt-.': function(cm) { ternServer.jumpToDef(cm); },
            'Alt-,': function(cm) { ternServer.jumpBack(cm); },
            'Ctrl-Q': function(cm) { ternServer.rename(cm); },
            'Ctrl-.': function(cm) { ternServer.selectName(cm); }
          });
        });

        editor.on('change', function(cm) {
          scope.code = cm.getValue();
        });

        editor.on("cursorActivity", function(cm) {
          ternServer.updateArgHints(cm);
        });

        scope.$on('set-code', function(e, code) {
          editor.setValue(code);
        });
      }, 1000);
    }

    function loadTernDefinitions(names, resolve) {
      var defNames = names.split(' ');
      var defs = [];
      var promises = [];
      defNames.forEach(function(def) {
        var promise = $http.get('assets/tern-defs/' + def + '.json')
          .then(function(res) {
            defs.push(res.data);
          });
        promises.push(promise);
      });

      $q.all(promises).then(function() {
        resolve(defs);
      }, function(error) {
        $log.error("An error occurred: ", error);
      })
    }
  }

})();
