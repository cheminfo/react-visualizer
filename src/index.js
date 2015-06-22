/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var superagent = require('superagent');

var component = React.createClass({

    render: function () {
        if (!this.state.version && this.props.version === 'auto' && this.props.viewURL) {
            this.getVersion();
            return <div/>;
        }


        var version;
        if (this.props.viewURL)
            version = this.state.version || this.props.version || 'latest';
        else
            version = 'latest';

        var cdn = this.props.cdn || '//www.lactame.com/visualizer';
        var viewURL = this.props.viewURL || '';
        var dataURL = this.props.dataURL || '';
        var config = this.props.config || '';
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
                return query[i-1] + '=' + encodeURIComponent(query[i]);
        }).filter(function(v) {
            return v !== undefined
        });
        query = query.join('&');

        return (
            <iframe src={cdn + '/' + version + '/index.html?' + query} style={style}/>
        );
    },

    getVersion() {
        setTimeout(() => {
            this.setState({
                version: 'v2.20.1'
            });
        }, 1000)
    },

    getInitialState() {
        return {
            version: null
        }
    }

});

module.exports = component;
