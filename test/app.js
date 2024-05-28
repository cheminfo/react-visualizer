'use strict';

import React from 'react';
import ReactDOM from 'react-dom/client';
import {OldVisualizer, Visualizer} from '../src';

const oldElement = React.createElement(OldVisualizer, {
    //cdn: '//www.lactame.com/visualizer',
    fallbackVersion: 'HEAD',
    scripts: [
        'https://www.lactame.com/lib/ml/HEAD/ml.js',
        {url: 'https://www.lactame.com/lib/semver/4.3.1/semver.js'},
        {content: 'var TEST = 42;'}
    ],
    version: 'auto',
    viewURL: 'https://myviews.cheminfo.org/db/visualizer/entry/a27d59b20df929892c57461a030640a5/view.json',
    //config: "https://www.lactame.com/visualizer/HEAD/usr/config/default.json"
    //dataURL: '',
    //config: ''
});

const newElement = React.createElement(Visualizer, {
    url: 'visualizer.html',
    version: 'auto',
    viewURL: 'https://myviews.cheminfo.org/db/visualizer/entry/a27d59b20df929892c57461a030640a5/view.json',
});

ReactDOM.createRoot(document.getElementById('visualizer')).render(window.location.search.includes('new') ? newElement : oldElement);
