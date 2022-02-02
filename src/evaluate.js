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
module.exports = async function evaluate(sourceCode) {
  revertToDefaultGlobals();
  return await eval(sourceCode);
};
