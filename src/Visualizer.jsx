'use strict';

const React = require('react');

const configs = new Map();

function relativeUrl(from, to) {
  return new URL(to, from).href;
}

/**
 * @typedef {Object} VisualizerProps
 * @property {string} url - The URL of the visualizer iframe.
 * @property {string} viewURL - The view to load. Set as a query param on the visualizer iframe URL.
 * @property {string} dataURL - The view to load. Set as a query param on the visualizer iframe URL.
 * @property {Object} config - The visualizer config object. URLs in the object are normalized to be absolute. Serialized as JSON and converted to a blob URL which is passed as a query param to the visualizer iframe URL.
 * @property {Record<string, string>} queryParameters - Key-value pairs to add to the query string of the visualizer iframe URL.
 * @property {import('react').CSSProperties} - CSS properties to style the iframe.
 */

/**
 * @param {VisualizerProps} props
 * @returns {JSX.Element}
 */
function Visualizer(props) {
  const currentHref = window.location.href;

  let viewURL = props.viewURL || '';
  let dataURL = props.dataURL || '';
  let config = props.config || '';

  if (viewURL) {
    viewURL = relativeUrl(currentHref, viewURL);
  }
  if (dataURL) {
    dataURL = relativeUrl(currentHref, dataURL);
  }

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
          new Blob([configJson], { type: 'application/json' }),
        ),
      );
    config = configs.get(configJson);
  }

  const style = props.style || {
    width: '100%',
    height: '100%',
    position: 'absolute',
    border: 'none',
  };

  const search = new URLSearchParams();
  const query = {
    viewURL,
    dataURL,
    config,
    ...props.queryParameters,
  };

  for (let [key, value] of Object.entries(query)) {
    if (value) {
      search.set(key, value);
    }
  }

  return (
    <iframe
      allowFullScreen
      src={props.url + '#?' + search.toString()}
      style={style}
    />
  );
}

module.exports = React.memo(Visualizer);
