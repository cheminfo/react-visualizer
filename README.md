# react-visualizer
The Visualizer in a react component

## Properties

* `cdn` - URL of the CDN that will serve the Visualizer. Default: https://www.lactame.com/visualizer
* `fallbackVersion` - Visualizer fallback version used if no valid version is found. Default: 'latest'.
* `scripts` - Array of scripts to load in the iframe before the Visualizer
* `viewURL`
* `dataURL`
* `config` - URL to the config or object
* `version` - version to load or `auto` to select it automatically based on the view. Default: latest
* `style` - style object to apply to the iframe. Default: `{width: '100%', height: '100%', position: 'absolute', border: 'none'}`
