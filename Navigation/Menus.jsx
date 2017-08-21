import React from 'react';
require("../sass/Navigation/menu.scss");
class Menus extends React.Component {
  constructor(props) {
    super(props);
  
  }
static propTypes={
  style:React.PropTypes.object,
  className:React.PropTypes.string,
}
static defaultProps={
  style:{},
  className:""
}
  render() {
    return <div style={this.props.style} className={"wasabi-menu "+this.props.className}>
       {this.props.children}
      </div>;
  }

}

module.exports= Menus;
