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
    loadversion: {
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

  --loadversion <'none' | 'exact' | 'major-latest'>
      What version to load based on the version referenced by the view.
        'exact': load exactly the version of the view.
        'latest-major': use the major version of the view, but its latest version. 
        'none': do not use the view to decide which version to load.
      Default: 'none'
      
  --cdn <string>
      CDN base URL for visualizer assets

  --out <string>
      Output file path to which to write the html file
      Default: visualizer.html

  --queryType <'fragment' | 'query'>
      Where the search parameters should be read from.
        'query': Uses the regular query string of the URL
        'fragment': Uses the fragment identifier (aka hash) of the URL as query string
      Default: query
`);
}

const page = makeVisualizerPage(args);

writeFileSync(args.out, page, 'utf-8');
