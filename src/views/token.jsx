var TokenView = React.createClass({
  render: function(){
    var _class = this.props.error ? 'invalid' : '';
    
    return (
      <div className="row">
        <div className="input-field col s12">
          <input id="token_field" type="text" className={_class} onChange={this.props.onChange}/>
          <label className="active" htmlFor="token_field" data-error="Invalid token">Paste your token</label>
        </div>
        {this.props.loading ? 
          <div className="progress">
              <div className="indeterminate"></div>
          </div> : <div></div>
        }
      </div>
    )
  }
});

module.exports = TokenView;