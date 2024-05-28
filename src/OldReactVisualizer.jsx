'use strict';

const React = require("react");

const makeVisualizerPage = require("./makeVisualizerPage");
const ReactVisualizer = require("./ReactVisualizer");

const urls = new Map();

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

    return (
      <ReactVisualizer
        url={url}
        viewURL={this.props.viewURL}
        dataURL={this.props.dataURL}
        config={this.props.config}
        version={this.props.version}
        style={this.props.style}
      />
    );
  }
}

module.exports = OldReactVisualizer;
