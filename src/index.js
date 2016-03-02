'use strict';

var React = require('react');

var page = require('./visualizer.js');
var urls = new Map();
var configs = new Map();

var component = React.createClass({

    render: function () {
        var cdn = this.props.cdn ? this.props.cdn.replace(/\/$/, '') : 'https://www.lactame.com/visualizer';
        var fallbackVersion = this.props.fallbackVersion || 'latest';
        var h = page.replace(/\{\{ cdn }}/g, cdn);
        h = h.replace(/\{\{ fallbackVersion }}/g, fallbackVersion);
        var scripts = this.props.scripts || [];
        var scriptsStr = scripts.reduce(function (value, script) {
            if (script.url || typeof script === 'string') {
                return value + `<script src="${script.url || script}"></script>\n`;
            } else if (script.content) {
                return value + `<script>${script.content}</script>\n`;
            } else {
                throw new Error('script must have url or content');
            }
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

        if(typeof config === 'object') {
            var configJson = JSON.stringify(config);
            if(!configs.has(configJson))
                configs.set(configJson, URL.createObjectURL(new Blob([configJson], {type: 'application/json'})));
            config = configs.get(configJson);
        }

        var style = this.props.style || {
            width: '100%',
            height: '100%',
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


        if (this.props.version !== 'auto' || !this.props.viewURL) { // Force version to be loaded
            console.log('not auto or no viewURL', version);
            var v = this.props.version === 'auto' ? 'latest' : version;
            console.log(v);
            query += '&v=' + v;
        }
        else {
            query += '&loadversion=true';
        }
        return <iframe allowFullScreen="true" src={url + '#?' + query} style={style}/>;
    },

    getInitialState() {
        return {
            version: null
        }
    }

});

module.exports = component;
