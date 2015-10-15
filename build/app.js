(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var AppView = require('./views/app.jsx');

ReactDOM.render(React.createElement(AppView, null), document.getElementById('app'));

},{"./views/app.jsx":5}],2:[function(require,module,exports){
'use strict';

var InstagramAPI = (function () {

  // Private variables
  var token = null,
      version = 'v1';

  return {
    setToken: function setToken(_token) {
      token = _token;
    },
    setVersion: function setVersion(v) {
      version = v;
    },
    req: function req(url, callback, doneCallback) {
      var def = $.Deferred(),
          _url = !url.match(/^https:\/\/.*/) ? 'https://api.instagram.com/' + version + '/' + url : url;

      $.ajax(_url, {
        data: {
          'access_token': token
        },
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "jsonpcallback"
      }).then(function (res) {
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
      }).fail(def.reject.bind(def));
      return def;
    }
  };
})();

module.exports = InstagramAPI;

},{}],3:[function(require,module,exports){
'use strict';

var InstagramAPI = require('./InstaAPI');

var InstaFollowers = (function () {
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
    fetchFollowers: function fetchFollowers() {
      var self = this,
          def = jQuery.Deferred();

      self.followers = [];

      InstagramAPI.req('users/' + this.userid + '/follows', function (resp, next) {
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
    fetchFollowing: function fetchFollowing() {
      var self = this,
          def = jQuery.Deferred();

      self.following = [];

      InstagramAPI.req('users/' + this.userid + '/followed-by', function (resp, next) {
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
    fetch: function fetch() {
      return this.fetchFollowing().then(this.fetchFollowers.bind(this));
    },
    /**
     * Converts an array of users into an array of userids, and adds the user into the users object
     * @method convertUsers
     * @param  {Array of Users} array
     * @return {Array of IDs}
     */
    convertUsers: function convertUsers(array) {
      var self = this;
      return _.map(array, function (element) {
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
    toUserclass: function toUserclass(array) {
      var self = this;
      return _.map(array, function (id) {
        return self.users[id];
      });
    }
  };
})();

module.exports = InstaFollowers;

},{"./InstaAPI":2}],4:[function(require,module,exports){
'use strict';

var InstagramAPI = require('./InstaAPI');

var InstaFollowers = (function () {
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
      full_name: ''

    },

    /**
     * Fetches user
     * @method fetch
     * @param {Number | String} userID
     * @return {Promise}
     */
    fetch: function fetch(userID) {
      var self = this;

      return InstagramAPI.req('users/' + userID, function (resp) {
        self.attrs = _.extend({}, resp);
      });
    },

    /**
     * Search for a user id
     * @method search
     * @param  {String} username
     * @return {Promise}
     */
    search: function search(username) {
      var def = $.Deferred();

      InstagramAPI.req('users/search?count=1&q=' + username, function (resp) {
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

},{"./InstaAPI":2}],5:[function(require,module,exports){
// Libs
'use strict';

var InstagramAPI = require('../libs/InstaAPI'),
    InstaFollowers = require('../libs/InstaFollowers'),
    InstaUsers = require('../libs/InstaUsers');

// Views
var NavbarView = require('./navbar.jsx'),
    TokenView = require('./token.jsx'),
    FollowersContainerView = require('./followers/container.jsx');

var AppView = React.createClass({
  displayName: 'AppView',

  getInitialState: function getInitialState() {
    return {
      logged: false,
      username: '',
      invalid: false,
      loading: false
    };
  },
  setToken: function setToken(event) {
    var token = event.target.value;
    if (token) {
      this.token = token;
      this.validateToken();
    }
  },
  logOut: function logOut() {
    InstagramAPI.setToken(null);
    this.setState({
      logged: false,
      invalid: false,
      username: '',
      loading: false
    });
  },
  validateToken: function validateToken() {
    var self = this;

    InstagramAPI.setToken(this.token);

    self.setState({
      loading: true,
      invalid: false
    });

    InstaUsers.fetch('self').then(function (user) {

      self.setState({
        logged: true,
        invalid: false,
        username: user.username,
        loading: false
      });
    }).fail(function () {

      self.setState({
        logged: false,
        invalid: true,
        loading: false
      });
    });
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'content' },
      React.createElement(NavbarView, { loggedIn: this.state.logged, user: this.state.username, onLogout: this.logOut }),
      React.createElement(
        'div',
        { className: 'container' },
        !this.state.logged ? React.createElement(TokenView, { onChange: _.debounce(this.setToken, 1000), error: this.state.invalid, loading: this.state.loading }) : React.createElement(
          'div',
          null,
          React.createElement(FollowersContainerView, null)
        )
      )
    );
  }
});

/*InstaUsers.fetch('selfa').then(function(){
  console.log(InstaUsers.attrs);
}).fail(function(){
  console.error('That username does not exist');
});*/

/*InstaFollowers.fetch().then(function() {
  InstaFollowers.renderProfiles(InstaFollowers.toUserclass(_.difference(InstaFollowers.followers, InstaFollowers.following)));
});*/

InstaUsers.search('self').then(function (user) {
  console.log(user);
}).fail(function () {
  console.error('That username does not exist');
});

module.exports = AppView;

},{"../libs/InstaAPI":2,"../libs/InstaFollowers":3,"../libs/InstaUsers":4,"./followers/container.jsx":7,"./navbar.jsx":11,"./token.jsx":12}],6:[function(require,module,exports){
'use strict';

var User = require('./single.jsx');

var UserCollection = React.createClass({
  displayName: 'UserCollection',

  getInitialState: function getInitialState() {
    return { q: '' };
  },
  filter: function filter(event) {
    var query = event.target.value;
    this.setState({
      q: query
    });
  },
  render: function render() {
    var collection = this.props.collection,
        filter = this.state.q.toLowerCase();
    return React.createElement(
      'ul',
      { className: 'collection' },
      React.createElement(
        'li',
        { className: 'collection-header' },
        React.createElement(
          'h4',
          null,
          'Total: ',
          React.createElement(
            'b',
            null,
            collection.length
          )
        ),
        React.createElement(
          'div',
          { className: 'input-field col s12' },
          React.createElement('input', { id: 'filter_field', type: 'text', onChange: this.filter }),
          React.createElement(
            'label',
            { className: 'active', htmlFor: 'filter_field' },
            'Filter by username'
          )
        )
      ),
      collection.map(function (user) {
        if (!filter || user.username.toLowerCase().includes(filter)) {
          return React.createElement(
            'li',
            { className: 'collection-item avatar', key: user.username },
            React.createElement(User, { attrs: user })
          );
        } else {
          return null;
        }
      })
    );
  }
});

module.exports = UserCollection;

},{"./single.jsx":8}],7:[function(require,module,exports){
// Libs
'use strict';

var InstaFollowers = require('../../libs/InstaFollowers');

// Views
var LoaderComponent = require('../misc/loader.jsx'),
    SelectComponent = require('../misc/select.jsx'),
    FollowersCollectionView = require('./collection.jsx');

var FollowersContainerView = React.createClass({
  displayName: 'FollowersContainerView',

  getInitialState: function getInitialState() {

    InstaFollowers.fetch().then((function () {
      this.setState({
        ready: true
      });
    }).bind(this));

    return {
      ready: false,
      list: null
    };
  },
  calculate: function calculate() {
    if (this.state.ready) {
      var A = InstaFollowers.followers,
          B = InstaFollowers.following,
          method = this._select.$_select.val() || 'difference';

      this.setState({
        list: InstaFollowers.toUserclass(_[method](A, B))
      });
    }
  },
  reset: function reset() {
    this.setState({
      list: null
    });
  },
  render: function render() {
    var _this = this;

    if (!this.state.ready) {
      return React.createElement(LoaderComponent, { size: 'big' });
    } else {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            null,
            'Followers'
          ),
          React.createElement(
            SelectComponent,
            { className: 'col s3', defaultValue: '1', ref: function (c) {
                return _this._select = c;
              } },
            React.createElement(
              'option',
              { value: '', disabled: true },
              'Choose your option'
            ),
            React.createElement(
              'option',
              { value: 'difference' },
              'Diff'
            ),
            React.createElement(
              'option',
              { value: 'union' },
              'Union'
            ),
            React.createElement(
              'option',
              { value: 'intersection' },
              'Intersection'
            )
          ),
          React.createElement(
            'div',
            null,
            'Following'
          ),
          React.createElement(
            'button',
            { className: 'btn waves-effect waves-light', type: 'submit', name: 'action', onClick: this.calculate },
            'Calculate'
          ),
          React.createElement(
            'button',
            { className: 'btn waves-effect waves-light', type: 'submit', name: 'reset', onClick: this.reset },
            'Reset'
          )
        ),
        React.createElement(
          'div',
          { className: 'content' },
          this.state.list !== null ? React.createElement(FollowersCollectionView, { collection: this.state.list }) : null
        )
      );
    }
  }
});

module.exports = FollowersContainerView;

},{"../../libs/InstaFollowers":3,"../misc/loader.jsx":9,"../misc/select.jsx":10,"./collection.jsx":6}],8:[function(require,module,exports){
"use strict";

var User = React.createClass({
  displayName: "User",

  render: function render() {
    var attrs = this.props.attrs;
    return React.createElement(
      "div",
      null,
      React.createElement(
        "a",
        { href: 'https://instagram.com/' + attrs.username, target: "_blank" },
        React.createElement("img", { src: attrs.profile_picture, className: "circle" })
      ),
      React.createElement(
        "span",
        { className: "title" },
        attrs.username
      ),
      React.createElement(
        "p",
        null,
        attrs.full_name
      ),
      React.createElement(
        "a",
        { href: 'https://instagram.com/' + attrs.username, target: "_blank", className: "secondary-content" },
        React.createElement(
          "i",
          { className: "material-icons" },
          "send"
        )
      )
    );
  }
});

module.exports = User;

},{}],9:[function(require,module,exports){
'use strict';

var LoaderComponent = React.createClass({
  displayName: 'LoaderComponent',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'center', style: { 'margin': '20px 0' } },
      React.createElement(
        'div',
        { className: "preloader-wrapper active " + this.props.size },
        React.createElement(
          'div',
          { className: 'spinner-layer spinner-blue-only' },
          React.createElement(
            'div',
            { className: 'circle-clipper left' },
            React.createElement('div', { className: 'circle' })
          ),
          React.createElement(
            'div',
            { className: 'gap-patch' },
            React.createElement('div', { className: 'circle' })
          ),
          React.createElement(
            'div',
            { className: 'circle-clipper right' },
            React.createElement('div', { className: 'circle' })
          )
        )
      )
    );
  }
});

module.exports = LoaderComponent;

},{}],10:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var SelectComponent = React.createClass({
  displayName: 'SelectComponent',

  render: function render() {
    var _this = this;

    var _props = this.props;
    var className = _props.className;
    var label = _props.label;
    var children = _props.children;
    var ref = _props.ref;

    var props = _objectWithoutProperties(_props, ['className', 'label', 'children', 'ref']);

    return React.createElement(
      'div',
      { className: "input-field " + className },
      React.createElement(
        'select',
        _extends({ ref: function (c) {
            return _this.$_select = $(c);
          } }, props),
        children
      ),
      React.createElement(
        'label',
        null,
        label || ''
      )
    );
  },
  componentDidMount: function componentDidMount() {
    this.$_select.material_select();
  },
  componentWillUnmount: function componentWillUnmount() {
    this.$_select.material_select('destroy');
  }
});

module.exports = SelectComponent;

},{}],11:[function(require,module,exports){
"use strict";

var NavbarView = React.createClass({
  displayName: "NavbarView",

  render: function render() {
    var loggedInOptions;
    if (this.props.loggedIn) {
      loggedInOptions = React.createElement(
        "ul",
        { id: "nav-mobile", className: "right hide-on-med-and-down" },
        React.createElement(
          "li",
          null,
          React.createElement(
            "b",
            null,
            this.props.user
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "a",
            { href: "#", onClick: this.props.onLogout },
            "Log out"
          )
        )
      );
    }

    return React.createElement(
      "nav",
      null,
      React.createElement(
        "div",
        { className: "nav-wrapper container" },
        React.createElement(
          "a",
          { href: "#", className: "brand-logo" },
          "InstaFollowers"
        ),
        loggedInOptions
      )
    );
  }
});

module.exports = NavbarView;

},{}],12:[function(require,module,exports){
'use strict';

var TokenView = React.createClass({
  displayName: 'TokenView',

  render: function render() {
    var _class = this.props.error ? 'invalid' : '';

    return React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'div',
        { className: 'input-field col s12' },
        React.createElement('input', { id: 'token_field', type: 'text', className: _class, onChange: this.props.onChange }),
        React.createElement(
          'label',
          { className: 'active', htmlFor: 'token_field', 'data-error': 'Invalid token' },
          'Paste your token'
        )
      ),
      this.props.loading ? React.createElement(
        'div',
        { className: 'progress' },
        React.createElement('div', { className: 'indeterminate' })
      ) : React.createElement('div', null)
    );
  }
});

module.exports = TokenView;

},{}]},{},[1]);