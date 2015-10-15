var SelectComponent = React.createClass({
  render: function(){
    var {className, label, children, ref, ...props} = this.props;
    return (
      <div className={"input-field " + className}>
        <select ref={(c) => this.$_select = $(c)} {...props}>
          {children}
        </select>
        <label>{label || ''}</label>
      </div>
    )
  },
  componentDidMount: function(){
    this.$_select.material_select();
  },
  componentWillUnmount: function(){
    this.$_select.material_select('destroy');
  }
});

module.exports = SelectComponent;