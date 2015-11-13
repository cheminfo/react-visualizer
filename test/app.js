'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Visualizer from '../src/index';

let element = React.createElement(Visualizer, {
    //cdn: '//www.lactame.com/visualizer',
    version: 'auto',
    viewURL: 'http://couch.cheminfo.org/cheminfo/65f84b002399eb79ec0f8bf145fa63cc/view.json',
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
