// Libs
var InstaFollowers = require('../../libs/InstaFollowers');

// Views
var LoaderComponent = require('../misc/loader.jsx'),
SelectComponent = require('../misc/select.jsx'),
FollowersCollectionView = require('./collection.jsx');

var FollowersContainerView = React.createClass({
  getInitialState: function() {
    
    InstaFollowers.fetch().then(function() {
      this.setState({
        ready: true
      });
    }.bind(this));

    return {
      ready: false,
      list: null
    };
  },
  calculate: function(){
    if (this.state.ready) {
      var A = InstaFollowers.followers,
        B = InstaFollowers.following,
        method = this._select.$_select.val() || 'difference';

      this.setState({
        list: InstaFollowers.toUserclass(_[method](A, B))
      });
    }
  },
  reset: function(){
    this.setState({
      list: null
    });
  },
  render: function(){
    if (!this.state.ready) {
      return (
        <LoaderComponent size="big"/>
      );
    } else {
      return (
        <div>
          <div className="row">
            <div>Followers</div>
            <SelectComponent className="col s3" defaultValue="1" ref={(c) => this._select = c}>
              <option value="" disabled>Choose your option</option>
              <option value="difference">Diff</option>
              <option value="union">Union</option>
              <option value="intersection">Intersection</option>
            </SelectComponent>
            <div>Following</div>
            <button className="btn waves-effect waves-light" type="submit" name="action" onClick={this.calculate}>Calculate</button>
            <button className="btn waves-effect waves-light" type="submit" name="reset" onClick={this.reset}>Reset</button>
          </div>
          <div className="content">
            { this.state.list !== null ?
              <FollowersCollectionView collection={this.state.list}/>
              : null
            }
          </div>
        </div>
      )
    }
  }
});

module.exports = FollowersContainerView;