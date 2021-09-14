/*
 create by wangzhiyong
 date:2021-01-14
 desc:标签组件,从button独立出来
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import func from "../../libs/func.js";
import('./index.css');
class Tag extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.onClick = this.onClick.bind(this);
    this.onRemove = this.onRemove.bind(this)
  }

  onClick(event) {
    event.preventDefault();
    if (this.props.disabled == true) {
      return;
    }
    this.props.onClick && this.props.onClick(this.props.name, this.props.title, event);
  }
  onRemove(event) {
    event.preventDefault();
    if (this.props.disabled == true) {
      return;
    }
    this.props.onRemove && this.props.onRemove(this.props.name, this.props.title, event);
  }
  render() {

    return <span title={this.props.title} className={"wasabi-tag " + (this.props.theme||"primary")+ " " + (this.props.className||"")+ (this.props.disabled ? " disabled" : "")} style={this.props.style}>{this.props.children}
      {
        this.props.removeAble ? <i className="icon-close" onClick={this.onRemove}></i> : null
      }</span>
  }
}
Tag.propTypes = {
  name: PropTypes.string, //标签名称
  title: PropTypes.string, //标签提示信息
  theme: PropTypes.oneOf([
    //主题
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ]),
  style: PropTypes.object, //样式
  className: PropTypes.string, //自定义样式
  onClick: PropTypes.func, //标签单击事件
  onRemove: PropTypes.func, //标签关闭事件
  disabled: PropTypes.bool //标签是否无效
};
Tag.defaultProps = {
  theme: 'primary',
};
export default Tag;
