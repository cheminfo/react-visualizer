#!/usr/bin/env node

const { parseArgs } = require('node:util');
const makeVisualizerPage = require('../src/makeVisualizerPage');
const { writeFileSync } = require('node:fs');
const assert = require('node:assert');
const fs = require('node:fs');

let argv = process.argv.slice(2);
const startIndex = argv.findIndex((arg) => arg === 'makeVisualizerPage');
if (startIndex > -1) {
  argv = argv.slice(startIndex + 1);
}

const { values: args } = parseArgs({
  args: argv,
  options: {
    help: {
      type: 'boolean',
      short: 'h',
    },
    out: {
      type: 'string',
      default: 'visualizer.html',
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
    scriptUrl: {
      type: 'string',
      multiple: true,
    },
    queryType: {
      type: 'string',
      default: 'query',
    },
    config: {
      type: 'string',
    },
  },
});

const { help, config, scriptUrl = [], ...options } = args;

const scripts = scriptUrl.map((url) => ({
  url,
}));
if (help) {
  printHelp();
  process.exit(0);
}

let fileConfig = {};
if (config) {
  const str = fs.readFileSync(args.config, 'utf-8');
  try {
    fileConfig = JSON.parse(str);
  } catch {
    console.error('Could not parse config file as JSON');
    process.exit(1);
  }
}

const page = makeVisualizerPage({ scripts, ...fileConfig, ...options });

writeFileSync(args.out, page, 'utf-8');

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

  --scriptUrl <string>
      Script source url. You can specify this option multiple times to include multiple URLs.

  --out <string>
      Output file path to which to write the html file
      Default: visualizer.html

  --queryType <'fragment' | 'query'>
      Where the search parameters should be read from.
        'query': Uses the regular query string of the URL
        'fragment': Uses the fragment identifier (aka hash) of the URL as query string
      Default: query
      
  --config <string>
      Path to a configuration file.
      Via the configuration file, you can specify additional options which should be passed to makeVisualizerPage generator.
      The "out" parameter must always be specified via the command line options.
`);
}
