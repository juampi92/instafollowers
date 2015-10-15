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
      var A, B,
        method = this._operation.$_select.val() || 'difference';

      if (this._order.$_select.val() === '1') {
        A = InstaFollowers.followers;
        B = InstaFollowers.following;
      } else {
        A = InstaFollowers.following;
        B = InstaFollowers.followers;
      }

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
  presets: function(event){
    var val = event.target.value;

    switch(val){
      case "1":
        // Users that dont follow you back
        this._order.$_select.val('1').material_select('update');
        this._operation.$_select.val('difference').material_select('update');
      break;
      case "2":
        // Following and Followers combined
        this._order.$_select.val('1').material_select('update');
        this._operation.$_select.val('union').material_select('update');
      break;
      case "3":
        // Users that follow you but you dont follow them
        this._order.$_select.val('2').material_select('update');
        this._operation.$_select.val('difference').material_select('update');
      break;
      case "4":
        // Users that you follow and they follow you back
        this._order.$_select.val('1').material_select('update');
        this._operation.$_select.val('intersection').material_select('update');
      break;
    }
    this.calculate();

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
            <SelectComponent className="col s12" defaultValue="0" onChange={this.presets}>
              <option value="0" disabled>Choose a preset</option>
              <option value="1">Users that dont follow you back</option>
              <option value="2">Following and Followers combined</option>
              <option value="3">Users that follow you but you dont follow them</option>
              <option value="4">Users that you follow and they follow you back</option>
            </SelectComponent>
          </div>
          <div className="row">
            <SelectComponent className="col s4" defaultValue="1" ref={(c) => this._order = c}>
              <option value="1">Followers - Following</option>
              <option value="2">Following - Followers</option>
            </SelectComponent>
            <SelectComponent className="col s4" defaultValue="1" ref={(c) => this._operation = c}>
              <option value="" disabled>Choose your option</option>
              <option value="difference">Diff</option>
              <option value="union">Union</option>
              <option value="intersection">Intersection</option>
            </SelectComponent>
            <div className="row s4">
              <button className="btn waves-effect waves-light btn-large" type="submit" name="action" onClick={this.calculate}>Calculate</button>
              <a onClick={this.reset} href="#">Reset</a>
            </div>
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