import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';
import TSWorker from 'url:monaco-editor/esm/vs/language/typescript/ts.worker.js';
import EditorWorker from 'url:monaco-editor/esm/vs/editor/editor.worker.js';

self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'typescript' || label === 'javascript') {
      return TSWorker;
    } else {
      return EditorWorker;
    }
  },
};

import('monaco-themes/themes/Tomorrow-Night.json').then((data) => {
  monaco.editor.defineTheme('tommorow-night', data);
  monaco.editor.setTheme('tommorow-night');
});

module.exports = monaco.editor.create(document.getElementById('editor'), {
  value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
  language: 'javascript',
  fontSize: '16px',
  lineHeight: '24px',
  EndOfLinePreference: 1,
  automaticLayout: true,
});
