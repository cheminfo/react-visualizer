/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var page = require('./visualizer.js');
var urls = new Map();
var configs = new Map();

var component = React.createClass({

    render: function () {

        var cdn = this.props.cdn ? this.props.cdn.replace(/\/$/, '') : 'https://www.lactame.com/visualizer';
        var h = page.replace('{{ cdn }}', cdn);
        var scripts = this.props.scripts || [];
        var scriptsStr = scripts.reduce(function (value, script) {
            return value + `<script src="${script}"></script>\n`;
        }, '');
        h = h.replace('{{scripts}}', scriptsStr);

        if(!urls.has(h)) {
            urls.set(h, URL.createObjectURL(new Blob([h], {type: 'text/html'})));
        }
        var url = urls.get(h);
        var viewURL = this.props.viewURL || '';
        var dataURL = this.props.dataURL || '';
        var config = this.props.config || '';
        var version = this.props.version || 'latest';
        var width = this.props.width || '100%';
        var height = this.props.height || '100%';

        if(typeof config === 'object') {
            var configJson = JSON.stringify(config);
            if(!configs.has(configJson))
                configs.set(configJson, URL.createObjectURL(new Blob([configJson], {type: 'application/json'})));
            config = configs.get(configJson);
        }

        var style = {
            width: width,
            height: height,
            position: 'absolute',
            border: 'none'
        };

        var query = ['viewURL', viewURL, 'dataURL', dataURL, 'config', config];
        query = query.map(function (v, i) {
            if (i % 2 === 1)
                return query[i - 1] + '=' + encodeURIComponent(query[i]);
        }).filter(function (v) {
            return v !== undefined
        });
        query = query.join('&');


        if (this.props.version !== 'auto') { // Force version to be loaded
            query += '&v=' + version;
            return (
                <iframe src={url + '#?' + query} style={style}>
                    <div/>
                </iframe>
                );
        }
        query += '&loadversion=true';
        console.log(query);
        return <iframe src={url + '#?' + query} style={style}/>;
    },

    getInitialState() {
        return {
            version: null
        }
    }

});

module.exports = component;
