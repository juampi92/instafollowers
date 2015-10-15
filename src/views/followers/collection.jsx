var User = require('./single.jsx');

var UserCollection = React.createClass({
  getInitialState: function(){
    return {q: ''};
  },
  filter: function(event) {
    var query = event.target.value;
    this.setState({
      q: query
    });
  },
  render: function(){
    var collection = this.props.collection,
      filter = this.state.q.toLowerCase();
    return (
      <ul className="collection">
        <li className="collection-header">
          <h4>Total: <b>{collection.length}</b></h4>
          <div className="input-field col s12">
            <input id="filter_field" type="text" onChange={this.filter}/>
            <label className="active" htmlFor="filter_field">Filter by username</label>
          </div>
        </li>
        {collection.map(function(user) {
          if (!filter || user.username.toLowerCase().includes(filter)) {
            return <li className="collection-item avatar" key={user.username}>
              <User attrs={user}/>
            </li>;
          } else {
            return null;
          }          
        })}
      </ul>
    )
  }
});

module.exports = UserCollection;

