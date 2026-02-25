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
  const url = search.get('viewURL');
  const v = search.get('v');
  const loadversion = search.get('loadversion');
  if (v) {
    addVisualizer(checkVersion(v));
    return;
  }

  if (!loadversion || !url) {
    addVisualizer('{{ fallbackVersion }}');
  } else {
    const viewReg = new RegExp('/view.json$');
    var docUrl = url.replace(viewReg, '');
    fetchUrl(docUrl)
      .then(function (data) {
        if (!data.version && (!data.$content || !data.$content.version))
          throw new Error();
        return data;
      })
      .catch(function () {
        return fetchUrl(url);
      })
      .then(function (data) {
        addVisualizer(checkVersion(data.version || data.$content.version));
      })
      .catch(function () {
        console.error('Could not load version');
      });
  }

  function addVisualizer(version) {
    var cdn = '{{ cdn }}';
    var visualizer = document.createElement('script');
    var prefix = cdn;
    var datamain = prefix + '/' + version + '/init';
    var requirejs = prefix + '/' + version + '/components/requirejs/require.js';

    visualizer.setAttribute('data-main', datamain);
    visualizer.setAttribute('src', requirejs);
    document.head.appendChild(visualizer);
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
