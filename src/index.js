/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var component = React.createClass({

    render: function () {
        var cdn = this.props.cdn ? this.props.cdn.replace(/\/$/, '') : '//www.lactame.com/visualizer';
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
            return <iframe src={cdn + '/' + version + '/index.html?' + query} style={style}/>;
        }
        return <iframe src={cdn + '/load.html?' + query} style={style}/>;
    },

    getInitialState() {
        return {
            version: null
        }
    }

});

module.exports = component;
