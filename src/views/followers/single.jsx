var User = React.createClass({
  render: function(){
    var attrs = this.props.attrs;
    return (
      <div>
        <a href={'https://instagram.com/' + attrs.username} target="_blank">
          <img src={attrs.profile_picture} className="circle"/>
        </a>
        <span className="title">{attrs.username}</span>
        <p>{attrs.full_name}</p>
        <a href={'https://instagram.com/' + attrs.username} target="_blank" className="secondary-content"><i className="material-icons">send</i></a>
      </div>
    )
  }
});

module.exports = User;