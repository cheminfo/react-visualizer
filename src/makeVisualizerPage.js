'use strict';

const template = require('./visualizerTemplate');

/**
 * @typedef {Object} MakeVisualizerPageOptions
 * @property {string} [cdn]
 * @property {string} [fallbackVersion]
 * @property {Array<{url: string}|{content: string}>} [scripts]
 */

/**
 * Make a page that loads the visualizer.
 * @param {MakeVisualizerPageOptions} [options]
 */
function makeVisualizerPage(options = {}) {
  const {
    cdn = 'https://www.lactame.com/visualizer',
    fallbackVersion = 'latest',
    scripts = [],
  } = options;

  const scriptsStr = scripts.reduce(function(value, script) {
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
    .replace('{{ scripts }}', scriptsStr);
}

module.exports = makeVisualizerPage;
