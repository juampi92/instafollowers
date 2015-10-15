var InstagramAPI = require('./InstaAPI');

var InstaFollowers = (function() {
  return {
    /**
     * @property userid
     * @type {Number | String}
     * @default 'self'
     */
    userid: 'self',
    /**
     * @property followers
     * @type {Array}
     */
    followers: null,
    /**
     * @property following
     * @type {Array}
     */
    following: null,
    /**
     * @property users
     * @type {Object}
     */
    users: {},
    /**
     * Fetches followers
     * @method fetchFollowers
     * @return {Promise}
     */
    fetchFollowers: function() {
      var self = this,
        def = jQuery.Deferred();

      self.followers = [];

      InstagramAPI.req('users/' + this.userid + '/follows', function(resp, next) {
        self.followers = self.followers.concat(self.convertUsers(resp));
        next();
      }, def.resolve.bind());

      return def;
    },
    /**
     * Fetches following users
     * @method fetchFollowing
     * @return {Promise}
     */
    fetchFollowing: function() {
      var self = this,
        def = jQuery.Deferred();

      self.following = [];

      InstagramAPI.req('users/' + this.userid + '/followed-by', function(resp, next) {
        self.following = self.following.concat(self.convertUsers(resp));
        next();
      }, def.resolve.bind());

      return def;
    },
    /**
     * Fetchers following and then followers
     * @method fetch
     * @return {Promise}
     */
    fetch: function() {
      return this.fetchFollowing().then(this.fetchFollowers.bind(this));
    },
    /**
     * Converts an array of users into an array of userids, and adds the user into the users object
     * @method convertUsers
     * @param  {Array of Users} array
     * @return {Array of IDs}
     */
    convertUsers: function(array) {
      var self = this;
      return _.map(array, function(element) {
        if (!self.users[element.id]) {
          self.users[element.id] = element;
        }
        return element.id;
      });
    },
    /**
     * Transforms an array of IDs into an array of Users
     * @method toUserclass
     * @param  {Array of IDs} array
     * @return {Array of Users}
     */
    toUserclass: function(array) {
      var self = this;
      return _.map(array, function(id) {
        return self.users[id];
      });
    }
  };
})();

module.exports = InstaFollowers;