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
        code: '=',
        context: '='
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
          defs.push(scope.context);
          ternServer = new CodeMirror.TernServer({
            defs: defs,
            ecmaVersion: 5
          });
          editor.setOption('extraKeys', {
            'Alt-Space': function(cm) { ternServer.complete(cm); }
          })
        });

        editor.on('change', function(cm) {
          scope.code = cm.getValue();
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

      return $q.all(promises).then(function() {
        resolve(defs);
      }, function(error) {
        $log.error("An error occurred: ", error);
      })
    }
  }

})();
