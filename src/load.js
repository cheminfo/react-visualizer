'use strict';

window.onload = function () {
  var url;
  var uri = new URI(window.location.href);
  var search = uri.fragment(true);
  var version;
  if (search.viewURL) {
    url = search.viewURL;
  }
  if (search.v) {
    version = addVisualizer(search.v);
    return;
  }
  if (!version) {
    version = '{{ fallbackVersion }}';
  }
  if (!search.loadversion || !url) {
    addVisualizer(version);
  } else {
    var docUrl = url.replace(/\/view\.json$/, '');
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
        addVisualizer(data.version || data.$content.version);
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
