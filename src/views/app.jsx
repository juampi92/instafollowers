// Libs
var InstagramAPI = require('../libs/InstaAPI'),
  InstaFollowers = require('../libs/InstaFollowers'),
  InstaUsers = require('../libs/InstaUsers');

// Views
var NavbarView = require('./navbar.jsx'),
  TokenView = require('./token.jsx'),
  FollowersContainerView = require('./followers/container.jsx');


var AppView = React.createClass({
  getInitialState: function() {
    return {
      logged: false,
      username: '',
      invalid: false,
      loading: false
    };
  },
  setToken: function(event) {
    var token = event.target.value;
    if (token) {
      this.token = token;
      this.validateToken();
    }
  },
  logOut: function() {
    InstagramAPI.setToken(null);
    this.setState({
      logged: false,
      invalid: false,
      username: '',
      loading: false
    });
  },
  validateToken: function() {
    var self = this;

    InstagramAPI.setToken(this.token);

    self.setState({
      loading: true,
      invalid: false
    });

    InstaUsers.fetch('self').then(function(user) {

      self.setState({
        logged: true,
        invalid: false,
        username: user.username,
        loading: false
      });

    }).fail(function() {

      self.setState({
        logged: false,
        invalid: true,
        loading: false
      });

    });
  },
  render: function() {
    return (
      <div className="content">
        <NavbarView loggedIn={this.state.logged} user={this.state.username} onLogout={this.logOut}/>
        <div className="container">
          { !this.state.logged ? 
            <TokenView onChange={_.debounce(this.setToken,1000)} error={this.state.invalid} loading={this.state.loading}/>
            :
            <div>
              <FollowersContainerView/>
            </div>
          }
        </div>
      </div>
    )
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

/*InstaUsers.search('self').then(function(user) {
  console.log(user);
}).fail(function() {
  console.error('That username does not exist');
});*/

module.exports = AppView;