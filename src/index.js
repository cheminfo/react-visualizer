/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var component = React.createClass({

    render: function() {

        //var viewUrl = this.props.viewUrl;
        //var dataUrl = this.props.dataUrl;
        //
        //var completed = +this.props.completed;
        //if (completed < 0) {completed = 0};
        //if (completed > 100) {completed = 100};
        //
        //var style = {
        //    backgroundColor: this.props.color || '#0BD318',
        //    width: completed + '%',
        //    transition: "width 200ms",
        //    height: this.props.height || 10
        //};

        return (
            <iframe src="//google.com" width="600" height="600"/>
        );
    }
});

module.exports = component;
