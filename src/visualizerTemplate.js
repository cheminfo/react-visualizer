'use strict';

const head = `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Visualizer</title>
    <style>
        #ci-visualizer {
            min-height: 100vh;
        }

        body {
            margin: 0;
        }
    </style>

    `;

const tail = `
{{ scripts }} 

</head>
<body>
<script type="module">
window.onload = function () {
  function checkVersion(v) {
    if (typeof v === 'string') {
      if (v[0] >= '0' && v[0] <= '9') {
        return 'v' + v;
      }
    }
    return v;
  }
  
  const queryType = '{{ queryType }}';
  const query = queryType === 'fragment' ? window.location.hash : window.location.search;
  const search = new URLSearchParams(query.startsWith("#") ? query.slice(1) : query);
  const viewURL = search.get('viewURL') || '{{ viewURL }}';
  const v = search.get('v');
  const loadversion = search.get('loadversion') || '{{ loadversion }}';
  const fallbackVersion = search.get('fallbackVersion') || '{{ fallbackVersion }}';
  if (v) {
    addVisualizer(checkVersion(v));
    return;
  }

  if (loadversion === 'none' || !viewURL) {
    addVisualizer(fallbackVersion);
  } else {
    const viewReg = new RegExp('/view.json$');
    const docUrl = viewURL.replace(viewReg, '');
    fetchUrl(docUrl)
      .then(function (data) {
        if (!data.version && (!data.$content || !data.$content.version))
          throw new Error('The view document does not have a version');
        return data;
      })
      .catch(function () {
        // Try fetching the view.json if it did not work with the document
        return fetchUrl(viewURL);
      })
      .then(function (data) {
        let version = checkVersion(data.version || data.$content.version);
        if(loadversion === 'latest-major') {
          version = version.replace(/^(v\\d+).*$/, '$1-latest');
        }
        addVisualizer(version);
      })
      .catch(function () {
        console.error('Could not load version');
      });
  }

  function addVisualizer(version) {
    const cdn = '{{ cdn }}';
    let configURL = '';
    const config = {{ config }};
    if(typeof config === 'string') {
      configURL = config;
    } else if(typeof config === 'object' && config !== null) {
      configURL = createBlobConfig(config);
    }
    
    const visualizer = document.createElement('script');
    const datamain = cdn + '/' + version + '/init';
    const requirejs = cdn + '/' + version + '/components/requirejs/require.js';
    
    const visualizerDiv = document.getElementById('ci-visualizer');
    

    visualizer.setAttribute('data-main', datamain);
    if(viewURL) {
      visualizerDiv.setAttribute('data-ci-view', viewURL);
    }
    if(configURL) {
      visualizerDiv.setAttribute('data-ci-config', configURL);
    }
    visualizer.setAttribute('src', requirejs);
    document.head.appendChild(visualizer);
  }
  
  function createBlobConfig(config) {
    if (typeof config === 'object' && config !== null) {
      let processedConfig = config;
      if (config.header?.elements) {
        processedConfig = structuredClone(config);
        const elements = processedConfig.header.elements;
        for (let i = 0; i < elements.length; i++) {
          // Transform relative URLs to absolute urls using the parent's location
          // Parent points to self if called on the top window
          if (elements[i].url) elements[i].url = new URL(elements[i].url, window.parent.location.href).href;
        }
      }
      const configJson = JSON.stringify(processedConfig);
      return URL.createObjectURL(
        new Blob([configJson], { type: 'application/json' }),
      );
    }
    return null;
  }

  async function fetchUrl(url) {
    const response = await fetch(url, {credentials: 'include'});
    return response.json();
  }
 }

</script>
<div id="ci-visualizer"></div>
</body>
</html>`;

module.exports = head + tail;
