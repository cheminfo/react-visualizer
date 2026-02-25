'use strict';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { OldVisualizer, Visualizer } from '../src';

const oldElement = React.createElement(OldVisualizer, {
  //cdn: '//www.lactame.com/visualizer',
  fallbackVersion: 'HEAD',
  scripts: [
    'https://www.lactame.com/lib/ml/HEAD/ml.js',
    { url: 'https://www.lactame.com/lib/semver/4.3.1/semver.js' },
    { content: 'var TEST = 42;' },
  ],
  version: 'auto',
  viewURL:
    'https://couch.cheminfo.org/cheminfo-public/16e029673e68d05b6df709e2970dbdc5/view.json',
  //config: "https://www.lactame.com/visualizer/HEAD/usr/config/default.json"
  //dataURL: '',
  //config: ''
});

const newElement = React.createElement(Visualizer, {
  url: 'visualizer.html',
  version: 'auto',
  viewURL:
    'https://couch.cheminfo.org/cheminfo-public/16e029673e68d05b6df709e2970dbdc5/view.json',
});
console.log(
  window.location.search.includes('new')
    ? 'Using new visualizer react component'
    : 'Using old visualizer react component',
);
ReactDOM.createRoot(document.getElementById('visualizer')).render(
  window.location.search.includes('new') ? newElement : oldElement,
);
