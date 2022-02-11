/**
 * Store default globals
 */
const defaultGlobals = Object.assign({}, window);

/**
 * Deletes non-default globals
 */
const revertToDefaultGlobals = function revertToDefaultGlobals() {
  Object.keys(window)
    .filter(function (key) {
      return defaultGlobals[key] === undefined;
    })
    .forEach(function (key) {
      delete window[key];
    });
};

/**
 * Evaluate source code
 * @param {string} sourceCode
 * @returns {Promise} - expression result
 */
const evaluateExpression = async function evaluateExpression(sourceCode) {
  //revertToDefaultGlobals();
  return await eval(sourceCode);
};

/**
 * @typedef Result
 * @property {*} val - exprssion result
 * @property {string} display - display value
 * @property {boolean} hide - true/false if result should be displayed
 * @property {Error} [err] - error object
 */

/**
 * Evaluate REPL input, line by line
 * @param {string} val - REPL input value
 * @returns {Array.Result}
 */
export default async function evaluate(val) {
  const lines = val.split(/\r?\n/g);
  const partials = lines.map(function (current, line) {
    return lines.slice(0, line + 1).join('\n');
  });

  let results = [];
  for (let i = 0; i < partials.length; i++) {
    const partial = partials[i];
    const result = {
      line: i + 1,
    };
    result.val = await evaluateExpression(partial).catch(function (e) {
      result.err = e;
    });
    result.display = result.err?.message || result.val;
    results.push(result);
  }
  let firstErr = true;
  return results
    .map(function (result, i) {
      result.eventualSuccess = results.slice(i).find(function (result) {
        return !result.err;
      });
      return result;
    })
    .map(function (result, i) {
      const line = lines[i];
      const isEmptyLine = !/\S/.test(line);
      const isComment = /^\s*\/\//.test(line);
      const isMultiLineComment = /\*\/\s*$/.test(line) && !result.err; //err is */ */

      if (isEmptyLine || isComment || isMultiLineComment) {
        result.display = '';
        result.hide = true;
      }

      if (result.err) {
        if (result.eventualSuccess || !firstErr) {
          result.display = '';
          result.hide = true;
        } else {
          firstErr = false;
        }
      }

      return result;
    });
}
