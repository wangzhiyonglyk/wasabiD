import React, { Component } from 'react';
import PropTypes from "prop-types";
import "./menu.css";
class Menus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandIndex: 0,
    },
      this.expandHandler = this.expandHandler.bind(this);
  }
  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
  }

  expandHandler(index) {
    this.setState({
      expandIndex: index === this.state.expandIndex ? null : index
    })
  }
  render() {
    return <div style={this.props.style} className={"wasabi-menu " + (this.props.className || "") + " " + (this.props.theme||"black")+" "+(this.props.colorTheme||"primary")}>
      {
        React.Children.map(this.props.children, (child, index) => {
          if (child && typeof child.type !== "function") {//非react组件
            return child;
          } else if (child) {
            return React.cloneElement(child, { expandHandler: this.expandHandler.bind(this, index), expand: this.state.expandIndex === index ? true : false, key: index, ref: child.ref ? child.ref : index })
          }
          else {
            return child;
          }

        })
      }
    </div>;
  }

}
Menus.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf([//主题
    "white",
    "black",
  ]),
  colorTheme: PropTypes.oneOf([//主题
    "primary",
    "success",
    "warning",
    "danger"
  ]),
};
Menus.defaultProps = {
  theme: "white",
  colorTheme:"primary"
};

export default Menus;
