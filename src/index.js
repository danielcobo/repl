require.config({
  paths: {
    vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.32.1/min/vs',
  },
});
require(['vs/editor/editor.main'], async () => {
  const jsEditor = monaco.editor.create(document.getElementById('editor'), {
    value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
    language: 'javascript',
    fontSize: '16px',
    lineHeight: '24px',
    EndOfLinePreference: 1,
    automaticLayout: true,
  });

  const template = await fetch(
    'https://unpkg.com/monaco-themes@0.4.0/themes/Tomorrow-Night.json'
  );
  const templateJSON = await template.json();
  monaco.editor.defineTheme('monokai', templateJSON);
  monaco.editor.setTheme('monokai');

  const evaluate = await import('./evaluate.js').then(
    (module) => module.default
  ); //To-do: fix leaky globals
  const jstree = await import(
    'https://cdn.jsdelivr.net/npm/@danielcobo/jstree@1/dist/esm/jstree.min.js'
  ).then((module) => module.default);

  jsEditor.onDidScrollChange(function (e) {
    document.getElementById('results').style.top = -e.scrollTop + 'px';
  });

  jsEditor.getModel().onDidChangeContent(async function onEditorVal(event) {
    const val = jsEditor.getValue();
    const results = await evaluate(val);

    //Generate HTML and return
    const html = results
      .map(function (result) {
        if (result.hide) {
          result.html = '';
        } else if (result.err) {
          result.html = `<span style="font-style:italic">${result.display}</span>`;
        } else {
          result.html = jstree(result.val);
        }

        return result;
      })
      .map(function (result) {
        return `<pre data-line="${result.line}"><code class="language-javascript">${result.html}</code></pre>`;
      })
      .join('');

    document.getElementById('results').innerHTML = html;
  });
});
