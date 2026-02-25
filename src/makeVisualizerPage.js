'use strict';

const template = require('./visualizerTemplate');

/**
 * @typedef {Object} MakeVisualizerPageOptions
 * @property {string} - cdn URL for static visualizer assets
 * @property {string} - Fallback version of the visualizer to use if it is not specified in the serach params and not loaded from the view.
 * @property {'fragment' | 'query'} - queryType
 * @property {Array<{url: string}|{content: string}>} - Scripts content or url to inject into the page.
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
    scripts = [],
  } = options;

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
    .replaceAll('{{ cdn }}', cdn)
    .replaceAll('{{ fallbackVersion }}', fallbackVersion)
    .replace('{{ scripts }}', scriptsStr)
    .replace('{{ queryType }}', queryType);
}

module.exports = makeVisualizerPage;
