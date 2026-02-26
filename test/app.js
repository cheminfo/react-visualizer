'use strict';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { OldVisualizer, Visualizer } from '../src';

const oldElement = React.createElement(OldVisualizer, {
  //cdn: '//www.lactame.com/visualizer',
  fallbackVersion: 'HEAD',
  loadversion: 'latest-major',
  queryParameters: {
    // Add key-value query parameters here to test the override of build parameters.
    // v: 'v2.150.0',
  },
  scripts: [
    'https://www.lactame.com/lib/ml/HEAD/ml.js',
    { url: 'https://www.lactame.com/lib/semver/4.3.1/semver.js' },
    { content: 'var TEST = 42;' },
  ],
  viewURL:
    'https://couch.cheminfo.org/cheminfo-public/16e029673e68d05b6df709e2970dbdc5/view.json',
  //config: "https://www.lactame.com/visualizer/HEAD/usr/config/default.json"
  //dataURL: '',
  //config: ''
});

const newElement = React.createElement(Visualizer, {
  url: 'visualizer.html',
  queryParameters: {
    // Add key-value query parameters here to test the override of build parameters.
    // v: 'v2.150.0',
  },
  viewURL:
    'https://couch.cheminfo.org/cheminfo-public/16e029673e68d05b6df709e2970dbdc5/view.json',
});
console.log(
  window.location.search.includes('old')
    ? 'Using old visualizer react component'
    : 'Using new visualizer react component',
);
ReactDOM.createRoot(document.getElementById('visualizer')).render(
  window.location.search.includes('old') ? oldElement : newElement,
);
