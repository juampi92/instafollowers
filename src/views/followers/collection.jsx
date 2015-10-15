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
          <form class="forms forms-inline input-field s12">
            <input type="text" class="input-big width-50" id="query" onChange={this.filter}/>
            <label htmlFor="query">Filter</label>
          </form>
        </li>
        {collection.map(function(user) {
          if (filter && !user.username.toLowerCase().includes(filter)) {
            return null;
          }
          return (
            <li className="collection-item avatar" key={user.username}>
              <User attrs={user}/>
            </li>
          );
        })}
      </ul>
    )
  }
});

module.exports = UserCollection;

