'use strict';

const React = require('react');

const page = require('./visualizer.js');
const urls = new Map();
const configs = new Map();

function relativeUrl(from, to) {
  return new URL(to, from).href;
}

class ReactVisualizer extends React.PureComponent {
  render() {
    var currentHref = window.location.href;
    var cdn = this.props.cdn
      ? this.props.cdn.replace(/\/$/, '')
      : 'https://www.lactame.com/visualizer';
    cdn = relativeUrl(currentHref, cdn);
    var fallbackVersion = this.props.fallbackVersion || 'latest';
    var h = page.replace(/\{\{ cdn }}/g, cdn);
    h = h.replace(/\{\{ fallbackVersion }}/g, fallbackVersion);
    var scripts = this.props.scripts || [];
    var scriptsStr = scripts.reduce(function(value, script) {
      if (script.url || typeof script === 'string') {
        var url = script.url;
        if (url) {
          url = relativeUrl(currentHref, url);
        }
        return value + `<script src="${url || script}"></script>\n`;
      } else if (script.content) {
        return value + `<script>${script.content}</script>\n`;
      } else {
        throw new Error('script must have url or content');
      }
    }, '');
    h = h.replace('{{scripts}}', scriptsStr);

    if (!urls.has(h)) {
      urls.set(h, URL.createObjectURL(new Blob([h], { type: 'text/html' })));
    }
    var url = urls.get(h);
    var viewURL = this.props.viewURL || '';
    if (viewURL) viewURL = relativeUrl(currentHref, viewURL);
    var dataURL = this.props.dataURL || '';
    if (dataURL) dataURL = relativeUrl(currentHref, dataURL);
    var config = this.props.config || '';
    var version = this.props.version || 'latest';

    if (typeof config === 'object' && config !== null) {
      if (config.header && config.header.elements) {
        config = JSON.parse(JSON.stringify(config));
        var els = config.header.elements;
        for (var i = 0; i < els.length; i++) {
          if (els[i].url) els[i].url = relativeUrl(currentHref, els[i].url);
        }
      }
      var configJson = JSON.stringify(config);
      if (!configs.has(configJson))
        configs.set(
          configJson,
          URL.createObjectURL(
            new Blob([configJson], { type: 'application/json' })
          )
        );
      config = configs.get(configJson);
    }

    var style = this.props.style || {
      width: '100%',
      height: '100%',
      position: 'absolute',
      border: 'none'
    };

    var query = ['viewURL', viewURL, 'dataURL', dataURL, 'config', config];
    query = query
      .map(function(v, i) {
        if (i % 2 === 1)
          return query[i - 1] + '=' + encodeURIComponent(query[i]);
      })
      .filter(function(v) {
        return v !== undefined;
      });
    query = query.join('&');

    if (version !== 'auto' || !viewURL) {
      // Force version to be loaded
      var v = version === 'auto' ? 'latest' : version;
      query += '&v=' + v;
    } else {
      query += '&loadversion=true';
    }
    return (
      <iframe allowFullScreen src={url + '#?' + query} style={style} />
    );
  }
}

module.exports = ReactVisualizer;
