//https://instagram.com/oauth/authorize/?response_type=token&redirect_uri=https://juampi92.github.io/instafollowers&client_id=1fb234f05ed1496a9eb35458be5d2c5c
var TokenView = React.createClass({
  requestToken: function(){

    $(this._modal).openModal();
  },
  render: function(){
    var _class = this.props.error ? 'invalid' : '';
    
    return (
      <div className="row">
        <div className="modal modal-fixed-footer" ref={(c) => this._modal = c}>
          <div className="modal-content">
            <h4>Request Access Token</h4>
            <p>{'If you don\'t have a token you could get one using the Apigee App'}</p>
            <p>Go to <a href='https://instagram.com/oauth/authorize/?response_type=code&redirect_uri=https://apigee.com/oauth_callback/instagram/oauth2CodeCallback&client_id=1fb234f05ed1496a9eb35458be5d2c5c' target="_blank">this link</a> and Authorize the access</p>
            <p>Then you will be redirected to Apigee Instagram Console, so now you need to get the <b>access_token</b>.<br/>
              Click on the orange <b>Send</b> button on the right, and after it is finished working, you will get a NOT FOUND response.<br/>
              {'On the left, you should see the Request box with a text that says ../?'}<b>access_token</b>{'=... Copy the string that\'s after the \'=\', dots included.'}</p>
            <p>{'You should have something like this: 1637702140.1fa209f.fb331aad3541469abd5076de4d876800'}</p>
            <p></p>
            <p>If you would like to remove the access, go to <a href="https://instagram.com/accounts/manage_access" target="_blank">instagram.com/accounts/manage_access</a></p>
          </div>
          <div className="modal-footer">
            <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat ">Close</a>
          </div>
        </div>
        <div className="input-field col s10">
          <input id="token_field" type="text" className={_class} onChange={this.props.onChange}/>
          <label className="active" htmlFor="token_field" data-error="Invalid token">Paste your token</label>
        </div>
        <div className="col s2">
          <button className="btn waves-effect waves-light btn-large" type="button" onClick={this.requestToken}>Request</button>
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