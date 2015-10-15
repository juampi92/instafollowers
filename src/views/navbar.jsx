var NavbarView = React.createClass({
  render: function(){
    var loggedInOptions;
    if (this.props.loggedIn) {
      loggedInOptions = (
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li><b>{this.props.user}</b></li>
        <li><a href="#" onClick={this.props.onLogout}>Log out</a></li>
      </ul>
      );
    }

    return (
      <nav>
        <div className="nav-wrapper container">
          <a href="#" className="brand-logo">InstaFollowers</a>
          {loggedInOptions}
        </div>
      </nav>
    )
  }
});

module.exports = NavbarView;