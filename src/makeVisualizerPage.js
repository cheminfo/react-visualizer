'use strict';

const template = require('./visualizerTemplate');

/**
 * @typedef {Object} MakeVisualizerPageOptions
 * @property {string} cdn - cdn URL for static visualizer assets
 * @property {string} fallbackVersion - Fallback version of the visualizer to use if it is not specified in the serach params and not loaded from the view.
 * @property {'exact' | 'latest-major' | 'none'} loadversion - How to load the visualizer version based on the version of the view. 'exact': load exactly the version of the view. 'major-latest': use the major version of the view, but its latest version. undefined: do not use the view to decide which version to load.
 * @property {string} viewURL - URL to pass to the visualizer's data-ci-view attribute.
 * @property {string} configURL - URL to pass to the visualizer's data-ci-config attribute.
 * @property {'fragment' | 'query'} queryType - Wether to use a regular query string or to put the query string in a fragment.
 * @property {Array<{url: string}|{content: string}>} scripts - Scripts content or url to inject into the page.
 */

/**
 * Make a page that loads the visualizer.
 * @param {MakeVisualizerPageOptions} [options]
 */
function makeVisualizerPage(options = {}) {
  const {
    cdn = 'https://www.lactame.com/visualizer',
    fallbackVersion = 'latest',
    queryType = 'fragment',
    loadversion = 'none',
    configURL = '',
    viewURL = '',
    scripts = [],
  } = options;

  validateQueryType(queryType);
  validateLoadVersion(loadversion);
  const scriptsStr = scripts.reduce(function (value, script) {
    if (script.url) {
      return value + `<script src="${script.url}"></script>\n`;
    } else if (script.content) {
      return value + `<script>${script.content}</script>\n`;
    } else {
      throw new Error('script must have url or content');
    }
  }, '');

  return template
    .replace('{{ cdn }}', cdn)
    .replace('{{ fallbackVersion }}', fallbackVersion)
    .replace('{{ scripts }}', scriptsStr)
    .replace('{{ queryType }}', queryType)
    .replace('{{ loadversion }}', loadversion)
    .replace('{{ configURL }}', configURL)
    .replace('{{ viewURL }}', viewURL);
}

module.exports = makeVisualizerPage;

const validLoadversion = ['none', 'exact', 'latest-major'];
function validateLoadVersion(loadversion) {
  if (!validLoadversion.includes(loadversion)) {
    throw new Error(
      `Invalid "loadversion" parameter: ${loadversion}. Allowed values: ${validLoadversion.join(', ')}`,
    );
  }
}

const validQueryType = ['fragment', 'query'];
function validateQueryType(queryType) {
  if (!validQueryType.includes(queryType)) {
    throw new Error(
      `Invalid "queryType" parameter: ${queryType}, allowed values: ${validQueryType.join(', ')}`,
    );
  }
}
