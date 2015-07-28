/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var page = require('./visualizer.js');
var url;

var component = React.createClass({

    render: function () {

        var cdn = this.props.cdn ? this.props.cdn.replace(/\/$/, '') : 'https://www.lactame.com/visualizer';
        var h = page.replace('{{ cdn }}', cdn);
        var scripts = this.props.scripts || [];
        var scriptsStr = scripts.reduce(function (value, script) {
            return value + `<script src="${script}"></script>\n`;
        }, '');
        h = h.replace('{{scripts}}', scriptsStr);
        if(!url) url = URL.createObjectURL(new Blob([h], {type: 'text/html'}));
        var viewURL = this.props.viewURL || '';
        var dataURL = this.props.dataURL || '';
        var config = this.props.config || '';
        var version = this.props.version || 'latest';
        var width = this.props.width || '100%';
        var height = this.props.height || '100%';

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
        return <iframe src={url + '#?' + query} style={style}/>;
    },

    getInitialState() {
        return {
            version: null
        }
    }

});

module.exports = component;
