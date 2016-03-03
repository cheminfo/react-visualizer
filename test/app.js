'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Visualizer from '../src/index';

let element = React.createElement(Visualizer, {
    //cdn: '//www.lactame.com/visualizer',
    fallbackVersion: 'HEAD',
    version: 'auto',
    viewURL: 'http://127.0.0.1:5984/myviews/1a978de7ca7383a6854f5eb1280b8ce1/view.json',
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
