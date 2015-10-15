var SelectComponent = React.createClass({
  change: function(){
    console.log('cacaaa');
  },
  render: function(){
    var {className, label, children, ref, onChange, ...props} = this.props;
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
    if (this.props.onChange) {
      this.$_select.change(this.props.onChange);
    }
  },
  componentWillUnmount: function(){
    this.$_select.material_select('destroy');
  }
});

module.exports = SelectComponent;