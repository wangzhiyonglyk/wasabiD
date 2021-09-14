/*
 create by wangzhiyong
 date:2020-12-06
 desc:下拉菜单按钮
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LinkButton from "../LinkButton"
import dom from "../../libs/dom"
import func from "../../libs/func"
import('./index.css');

class Dropdown extends Component {
    constructor(props) {
        super(props)
        this.wasabidropdown = React.createRef();
        this.state = {
            containerid: func.uuid(),
            menuShow: false,
        }

        this.menuClickHandler = this.menuClickHandler.bind(this)
        this.showMenu = this.showMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
        this.open=this.open.bind(this);
        this.close=this.close.bind(this);
    }

    menuClickHandler(index, menuName) {
        this.setState({
            menuShow: false
        })
        this.props.onClick && this.props.onClick(index, menuName);
    }
    open(){
        this.showMenu();
    }
    close(){
        this.setState({
            menuShow: false
        })
    }
    showMenu() {
        if (this.props.disabled) {
            return;
        }
        this.setState({
            menuShow: true
        })
        document.addEventListener("click", this.hideMenu)
    }
    hideMenu(event) {
        if (!dom.isDescendant(document.getElementById(this.state.containerid),event&&event.target)) {
            this.setState({
                menuShow: false
            })
            document.removeEventListener("click", this.hideMenu)
        }


    }
    shouldComponentUpdate(nextProps, nextState) {
        if (func.diffOrder(nextProps, this.props)) {
            return true;
        }
        if (func.diff(nextState, this.state)) {
            return true;
        }
        return false;
    }
    render() {
        let props = {
            className:
                'wasabi-dropdown ' + 
                this.props.theme+" " +
                (this.props.className||""),
            style: this.props.style ? this.props.style : {},
            disabled: this.props.disabled == true ? 'disabled' : null,
            //文字提示
            title: this.props.title
        };
        return <div ref={this.wasabidropdown}  {...props} id={this.state.containerid} >
            <LinkButton disabled={this.props.disabled} key={1} disabled={this.props.disabled} iconCls={this.props.iconCls}
             iconAlign={this.props.iconAlign} name={this.props.name}
             iconColor={this.props.iconColor}
              onClick={this.showMenu} 
             theme={this.props.theme} size={this.props.size} 
             title={this.props.title}>{this.props.label}</LinkButton>
            <i className={"wasabi-dropdown-arrow  "+(this.props.menuIconCls||"")+(this.props.iconCls?"":"noicon") } onClick={this.showMenu}></i>
            <ul className={"wasabi-dropdown-menu "} style={{ display: this.state.menuShow ? "block" : "none" }}>
                {
                    React.Children.map(this.props.children, (child, index) => {
                        if (child) {
                            return React.cloneElement(child, { index: index, key: index, onClick: this.menuClickHandler })
                        }
                        return null;

                    })
                }

            </ul>
        </div>
    }
}

Dropdown.propTypes = {
    name: PropTypes.string, //按钮名称
    title: PropTypes.string, //按钮提示信息
    label:PropTypes.any,//按钮的文字
    iconCls: PropTypes.string, //按钮图标
    iconAlign: PropTypes.oneOf(['left', 'right', 'rightTop']), //图标的位置
    iconColor: PropTypes.string,//图标的颜色值
    menuIconCls: PropTypes.string, //菜单按钮图标
    theme: PropTypes.oneOf([
        //主题
        'primary',
        'default',
        'success',
        'info',
        'warning',
        'danger',
        'cancel'
    ]),
    menuClick: PropTypes.func, //子菜单的单击事件
    style: PropTypes.object, //样式
    className: PropTypes.string, //自定义样式
    disabled: PropTypes.bool,//按钮是否无效
 
};
Dropdown.defaultProps = {
    menuIconCls: "icon-drop-down",//默认向下箭头
    theme: 'primary',
    size: 'default',
};



export default Dropdown;