/*
 create by wangzhiyong
 date:2020-12-06
 desc:下拉菜单选项
 */

import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './index.css'

class DropdownItem extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.onClick = this.onClick.bind(this);
    }
    /**
     * 单击事件
     */
    onClick() {
        if(this.props.disabled){
            return;
        }
        this.props.onClick && this.props.onClick(this.props.index,this.props.name);
    }
    render() {
        return <li onClick={this.onClick} style={this.props.style||{}} className="wasabi-dropdown-item">{this.props.children}</li>
    }
}
DropdownItem.propTypes = {
    name: PropTypes.string,//列的名称,用于单击事件回调
}
export default DropdownItem;