#!/usr/bin/env node

const { parseArgs } = require('node:util');
const makeVisualizerPage = require('../src/makeVisualizerPage');
const { writeFileSync } = require('node:fs');

const { values: args } = parseArgs({
  options: {
    help: {
      type: 'boolean',
      short: 'h',
    },
    fallbackVersion: {
      type: 'string',
    },
    cdn: {
      type: 'string',
    },
    out: {
      type: 'string',
      default: 'visualizer.html',
    },
    queryType: {
      type: 'string',
      default: 'query',
    },
  },
});

if (args.help) {
  printHelp();
  process.exit(0);
}

function printHelp() {
  console.log(`
Usage:
  makeVisualizerPage [options]

Options:
  -h, --help
      Show this help message and exit

  --fallbackVersion <string>
      Visualizer version to use if it is not specified in the search url and not loaded from the view

  --cdn <string>
      CDN base URL for visualizer assets

  --out <string>
      Output file path to which to write the html file
      Default: visualizer.html

  --queryType <string>
      Where the search parameters should be read from: 'fragment' or 'query'
      Default: query
`);
}

const page = makeVisualizerPage(args);

writeFileSync(args.out, page, 'utf-8');
