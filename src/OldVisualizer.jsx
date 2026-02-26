'use strict';

const React = require('react');

const makeVisualizerPage = require('./makeVisualizerPage');
const ReactVisualizer = require('./Visualizer');

const urls = new Map();

function relativeUrl(from, to) {
  return new URL(to, from).href;
}

class OldVisualizer extends React.PureComponent {
  render() {
    const currentHref = window.location.href;
    const {
      cdn,
      viewURL,
      dataURL,
      config,
      style,
      scripts = [],
      loadversion,
      fallbackVersion,
      queryParameters,
    } = this.props;

    let finalCDN = cdn
      ? cdn.replace(/\/$/, '')
      : 'https://www.lactame.com/visualizer';
    finalCDN = relativeUrl(currentHref, finalCDN);

    const finalScripts = scripts.map((script) => {
      if (script.url || typeof script === 'string') {
        return {
          url: relativeUrl(currentHref, script.url || script),
        };
      } else {
        return script;
      }
    });

    const page = makeVisualizerPage({
      cdn: finalCDN,
      scripts: finalScripts,
      loadversion,
      fallbackVersion,
    });

    if (!urls.has(page)) {
      urls.set(
        page,
        URL.createObjectURL(new Blob([page], { type: 'text/html' })),
      );
    }
    const url = urls.get(page);

    return (
      <ReactVisualizer
        url={url}
        viewURL={viewURL}
        dataURL={dataURL}
        config={config}
        queryParameters={queryParameters}
        style={style}
      />
    );
  }
}

module.exports = OldVisualizer;
