import React from 'react';
import PropTypes from "prop-types";
class MenuPanel extends React.Component {
  constructor(props) {
    super(props);

    this.activeChange = this.activeChange.bind(this);

    this.state = {
      expand: this.props.expand,
      activeIndex: null,
    }
  }
  static propTypes = {
    iconCls: PropTypes.string,//图标
    title: PropTypes.any.isRequired,//标题是必须，可以是组件
    expand: PropTypes.bool //是否展开
  }
  activeChange(index) {
    this.setState({
      activeIndex: index
    })
  }
  render() {
    return <div className={"dropdown " + (this.props.className || "") + " " + (this.props.expand ? "expand" : "")}>
      <label htmlFor={this.props.title || ""} onClick={React.Children.count(this.props.children) > 0 ? this.props.expandHandler : this.props.onClick} >
        <i className={this.props.iconCls || "icon-bars"} style={{ marginRight: 10 }}></i> {this.props.title}
        {React.Children.count(this.props.children) > 0 ? <i style={{ float: "right", marginRight: 10, marginTop: 20 }} className={this.props.expand ? "icon-arrow-down" : "icon-arrow-up"} onClick={this.props.expandHandler} ></i> : null}
      </label>
      {this.props.children ? <ul className="" style={{ display: this.props.expand ? "block" : "none" }}>
        {this.props.children}
      </ul> : null}
    </div>
  }


}
MenuPanel.propTypes = {
  className: PropTypes.string,
  iconCls: PropTypes.string,

};
MenuPanel.defaultProps = {
  iconCls: "icon-bars",
};

export default MenuPanel;
