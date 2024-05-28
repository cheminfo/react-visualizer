'use strict';

const React = require("react");

const makeVisualizerPage = require("./makeVisualizerPage");

const urls = new Map();
const configs = new Map();

function relativeUrl(from, to) {
  return new URL(to, from).href;
}

class OldReactVisualizer extends React.PureComponent {
  render() {
    const currentHref = window.location.href;

    let cdn = this.props.cdn
      ? this.props.cdn.replace(/\/$/, '')
      : 'https://www.lactame.com/visualizer';
    cdn = relativeUrl(currentHref, cdn);

    let scripts = this.props.scripts || [];
    scripts = scripts.map((script) => {
      if (script.url || typeof script === 'string') {
        return {
          url: relativeUrl(currentHref, script.url || script),
        };
      } else {
        return script;
      }
    })

    const page = makeVisualizerPage({
      cdn,
      fallbackVersion: this.props.fallbackVersion,
      scripts,
    });

    if (!urls.has(page)) {
      urls.set(page, URL.createObjectURL(new Blob([page], { type: 'text/html' })));
    }
    const url = urls.get(page);
    let viewURL = this.props.viewURL || '';
    if (viewURL) viewURL = relativeUrl(currentHref, viewURL);
    let dataURL = this.props.dataURL || '';
    if (dataURL) dataURL = relativeUrl(currentHref, dataURL);
    let config = this.props.config || '';
    const version = this.props.version || 'latest';

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

module.exports = OldReactVisualizer;
