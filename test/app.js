'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Visualizer from '../src/index';

let element = React.createElement(Visualizer, {
    //cdn: '//www.lactame.com/visualizer',
    fallbackVersion: 'HEAD',
    version: 'auto',
    viewURL: 'https://mydb.cheminfo.org/db/visualizer/entry/a27d59b20df929892c57461a030640a5/view.json',
    scripts: [
        'http://www.lactame.com/lib/ml/HEAD/ml.js',
        {url: 'http://www.lactame.com/lib/semver/4.3.1/semver.js'},
        {content: 'var TEST = 42;'}
    ]
    //config: "http://www.lactame.com/visualizer/HEAD/usr/config/default.json"
    //dataURL: '',
    //config: ''
});
ReactDOM.render(element, document.getElementById('visualizer'));
