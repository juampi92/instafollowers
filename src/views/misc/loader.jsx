var LoaderComponent = React.createClass({
  render: function(){
    return (
      <div className="center" style={{'margin': '20px 0'}}>
        <div className={"preloader-wrapper active " + this.props.size}>
          <div className="spinner-layer spinner-blue-only">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div><div className="gap-patch">
              <div className="circle"></div>
            </div><div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = LoaderComponent;