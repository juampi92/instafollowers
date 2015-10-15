var InstagramAPI = require('./InstaAPI');

var InstaFollowers = (function() {
  return {
    attrs: {
      /**
       * @attribute id
       * @type {Number}
       */
      id: null,
      /**
       * @attribute username
       * @type {String}
       * @default ''
       */
      username: '',
      /**
       * @attribute profile_picture
       * @type {String}
       */
      profile_picture: '',
      /**
       * @attribute full_name
       * @type {String}
       */
      full_name: '',

    },

    /**
     * Fetches user
     * @method fetch
     * @param {Number | String} userID
     * @return {Promise}
     */
    fetch: function(userID) {
      var self = this;

      return InstagramAPI.req('users/' + userID, function(resp) {
        self.attrs = _.extend({}, resp);
      });
    },

    /**
     * Search for a user id
     * @method search
     * @param  {String} username
     * @return {Promise}
     */
    search: function(username) {
      var def = $.Deferred();

      InstagramAPI.req('users/search?count=1&q=' + username, function(resp) {
        if (resp.length > 0) {
          def.resolve(resp[0]);
        } else {
          def.reject();
        }
      });
      return def;
    }
  };
})();

module.exports = InstaFollowers;