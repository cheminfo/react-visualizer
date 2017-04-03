'use strict';

module.exports = `
'use strict';
function checkVersion(versions, version) {
    version = version.toLowerCase();
    if(version === 'head') return 'HEAD';
    if(version === 'head-min') return 'HEAD-min';
    if(version === 'latest') return 'latest';
    if (!version.startsWith('v')) version = 'v' + version;
    var idx = versions.indexOf(version);
    if (idx > -1) return version;
    else return '{{ fallbackVersion }}';
}
(function () {
    $.getJSON('{{ cdn }}/versions.json').then(function (versions) {
        versions = versions || [];
        versions = versions.map(function(v) {
            return v.toLowerCase();
        });
                    
        var url;
        var uri = new URI(window.location.href);
        var search = uri.fragment(true);
        console.log(window.location);
        var version;
        if (search.viewURL) {
            url = search.viewURL;
        }
        if (search.v) {
            version = addVisualizer(checkVersion(versions, search.v));
            return;
        }
        if (!version) {
            version = '{{ fallbackVersion }}';
        }
        if (!search.loadversion || !url) {
            addVisualizer(version, search);
        } else {
            var docUrl = url.replace(/\\/view\\.json$/, '');
            tryAjax(docUrl)
                .then(function (data) {
                    if (!data.version && (!data.$content || !data.$content.version)) throw new Error();
                    return data;
                })
                .catch(function () {
                    return tryAjax(url)
                })
                .then(function (data) {
                    addVisualizer(checkVersion(versions, data.version || data.$content.version), search);
                })
                .catch(function () {
                    console.error('Could not load version');
                });
            }
        });
        
        function addVisualizer(version, search) {
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
                        }
                    });
                },
                xhrFields: {withCredentials: true}
            });
        });
    }
})();
`;
