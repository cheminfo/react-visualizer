'use strict';

import React from 'react';
import ReactDOM from 'react-dom/client';
import Visualizer from '../src';

let element = React.createElement(Visualizer, {
    //cdn: '//www.lactame.com/visualizer',
    fallbackVersion: 'HEAD',
    version: 'auto',
    viewURL: 'https://myviews.cheminfo.org/db/visualizer/entry/a27d59b20df929892c57461a030640a5/view.json',
    scripts: [
        'https://www.lactame.com/lib/ml/HEAD/ml.js',
        {url: 'https://www.lactame.com/lib/semver/4.3.1/semver.js'},
        {content: 'var TEST = 42;'}
    ]
    //config: "https://www.lactame.com/visualizer/HEAD/usr/config/default.json"
    //dataURL: '',
    //config: ''
});

ReactDOM.createRoot(document.getElementById('visualizer')).render(element);
