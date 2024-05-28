'use strict';

const fs = require('node:fs');

const makeVisualizerPage = require('../src/makeVisualizerPage');

const html = makeVisualizerPage({
  scripts: [
    { url: 'https://www.lactame.com/lib/jcampconverter/9.6.4/jcampconverter.min.js' },
    { content: 'console.log("Script from content");' },
  ],
  fallbackVersion: 'HEAD',
});

fs.writeFileSync(__dirname + '/visualizer.html', html);
