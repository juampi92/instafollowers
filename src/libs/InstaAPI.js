var InstagramAPI = (function() {

  // Private variables
  var token = null,
    version = 'v1';

  return {
    setToken: function(_token) {
      token = _token;
    },
    setVersion: function(v) {
      version = v;
    },
    req: function(url, callback, doneCallback) {
      var def = $.Deferred(),
        _url = !url.match(/^https:\/\/.*/) ? 'https://api.instagram.com/' + version + '/' + url : url;

      $.ajax(_url, {
          data: {
            'access_token': token
          },
          dataType: "jsonp",
          jsonp: "callback",
          jsonpCallback: "jsonpcallback"
        })
        .then(function(res) {
          if (res.meta.code != 200) {
            def.reject(res.meta);
            return;
          }

          var next;
          if (res.pagination && res.pagination.next_url) {
            next = InstagramAPI.req.bind(InstagramAPI, res.pagination.next_url, callback, doneCallback);
          } else {
            next = doneCallback;
          }
          def.resolve(res.data, next);
          callback(res.data, next);

        })
        .fail(def.reject.bind(def));
      return def;
    }
  };
})();

module.exports = InstagramAPI;