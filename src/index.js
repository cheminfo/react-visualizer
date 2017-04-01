'use strict';

var React = require('react');
var Component = React.Component;
var urlNode = require('url');

var jquery = require('./jquery');
var loader = require('./loader');
var page = require('./visualizer-html');
var configs = new Map();

function addScript(doc, script) {
    const scriptElement = doc.createElement('script');
    scriptElement.textContent = script;
    doc.body.appendChild(scriptElement);
}

class ReactVisualizer extends Component {
    componentDidMount() {
        const window = this.refs.iframe.contentWindow;
        window.location = this.refs.iframe.src;
        const document = window.document;
        document.body.parentNode.innerHTML = page;
        debugger;
        addScript(document, jquery);
        addScript(document, this.loader);
    }

    render() {
        var currentHref = window.location.href;
        var cdn = this.props.cdn ? this.props.cdn.replace(/\/$/, '') : 'https://www.lactame.com/visualizer';
        cdn = urlNode.resolve(currentHref, cdn);
        var fallbackVersion = this.props.fallbackVersion || 'latest';
        var h = loader.replace(/\{\{ cdn }}/g, cdn);
        h = h.replace(/\{\{ fallbackVersion }}/g, fallbackVersion);
        var scripts = this.props.scripts || [];
        var scriptsStr = scripts.reduce(function (value, script) {
            if (script.url || typeof script === 'string') {
                var url = script.url;
                if (url) {
                    url = urlNode.resolve(currentHref, url);
                }
                return value + `<script src="${url || script}"></script>\n`;
            } else if (script.content) {
                return value + `<script>${script.content}</script>\n`;
            } else {
                throw new Error('script must have url or content');
            }
        }, '');
        h = h.replace('{{scripts}}', scriptsStr);
        this.loader = h;

        var viewURL = this.props.viewURL || '';
        if (viewURL) viewURL = urlNode.resolve(currentHref, viewURL);
        var dataURL = this.props.dataURL || '';
        if (dataURL) dataURL = urlNode.resolve(currentHref, dataURL);
        var config = this.props.config || '';
        var version = this.props.version || 'latest';

        if(typeof config === 'object' && config !== null) {
            if (config.header && config.header.elements) {
                config = JSON.parse(JSON.stringify(config));
                var els = config.header.elements;
                for (var i = 0; i < els.length; i++) {
                    if (els[i].url) els[i].url = urlNode.resolve(currentHref, els[i].url);
                }
            }
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


        if (version !== 'auto' || !viewURL) { // Force version to be loaded
            var v = version === 'auto' ? 'latest' : version;
            query += '&v=' + v;
        }
        else {
            query += '&loadversion=true';
        }
        return <iframe ref="iframe" allowFullScreen="true" src={window.location.origin + '/react-visualizer/index.html#?' + query} style={style}/>;
    }
}

module.exports = ReactVisualizer;
