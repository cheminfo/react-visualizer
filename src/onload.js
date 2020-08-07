// The contents of this file should be copied to visualizer.js as a string if modified
// It is not used directly in the project

'use strict';

window.onload = function () {
  function checkVersion(v) {
    if (typeof v === 'string') {
      if (v[0] >= '0' && v[0] <= '9') {
        return 'v' + v;
      }
    }
    return v;
  }
  var url;
  var uri = new URI(window.location.href);
  var search = uri.fragment(true);
  if (search.viewURL) {
    url = search.viewURL;
  }
  if (search.v) {
    addVisualizer(checkVersion(search.v));
    return;
  }

  if (!search.loadversion || !url) {
    addVisualizer('{{ fallbackVersion }}');
  } else {
    const viewReg = new RegExp('/view.json$');
    var docUrl = url.replace(viewReg, '');
    tryAjax(docUrl)
      .then(function (data) {
        if (!data.version && (!data.$content || !data.$content.version))
          throw new Error();
        return data;
      })
      .catch(function () {
        return tryAjax(url);
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

  function tryAjax(url) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: url,
        dataType: 'json',
        type: 'GET',
        success: function (data) {
          resolve(data);
        },
        error: function () {
          $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            success: function (data) {
              resolve(data);
            },
            error: function (err) {
              console.error('load version error', err);
              reject(err);
            },
          });
        },
        xhrFields: { withCredentials: true },
      });
    });
  }
};
