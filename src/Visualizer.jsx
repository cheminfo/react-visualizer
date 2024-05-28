'use strict';

const React = require('react');

const configs = new Map();

function relativeUrl(from, to) {
  return new URL(to, from).href;
}

function Visualizer(props) {
  const currentHref = window.location.href;

  let viewURL = props.viewURL || '';
  if (viewURL) viewURL = relativeUrl(currentHref, viewURL);
  let dataURL = props.dataURL || '';
  if (dataURL) dataURL = relativeUrl(currentHref, dataURL);
  let config = props.config || '';
  const version = props.version || 'latest';

  if (typeof config === 'object' && config !== null) {
    if (config.header && config.header.elements) {
      config = JSON.parse(JSON.stringify(config));
      const els = config.header.elements;
      for (let i = 0; i < els.length; i++) {
        if (els[i].url) els[i].url = relativeUrl(currentHref, els[i].url);
      }
    }
    const configJson = JSON.stringify(config);
    if (!configs.has(configJson))
      configs.set(
        configJson,
        URL.createObjectURL(
          new Blob([configJson], { type: 'application/json' })
        )
      );
    config = configs.get(configJson);
  }

  const style = props.style || {
    width: '100%',
    height: '100%',
    position: 'absolute',
    border: 'none'
  };

  let query = ['viewURL', viewURL, 'dataURL', dataURL, 'config', config];
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
    const v = version === 'auto' ? 'latest' : version;
    query += '&v=' + v;
  } else {
    query += '&loadversion=true';
  }

  return (
    <iframe allowFullScreen src={props.url + '#?' + query} style={style} />
  );
}

module.exports = React.memo(Visualizer);
