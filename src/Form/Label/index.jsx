/**
 * Created by wangzhiyong on 16/9/28.
 * desc 将表单组件中的label单独出来,
 *
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import utils from "../../libs/func"
import "./Label.css"
class Label extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            controlid: utils.uuid(),
        }
        this.onClick = this.onClick.bind(this)
    }
    /**
     * 单击事件
     * @returns 
     */
    onClick(event) {
        this.props.onClick && this.props.onClick(event);
    }

    render() {
        let style = this.props.style ? JSON.parse(JSON.stringify(this.props.style)) : {};
        style.display = this.props.children ? "inline-block" : "none";
        return <div id={this.state.controlid}
            title={this.props.title}
            className={"wasabi-label " + (this.props.className || "")}
            style={style}>
            {this.props.required ? <span style={{ color: "red" }}>*</span> : null} {this.props.children}
        </div>


    }
}

Label.propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    required: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.string]),//标题
};


export default Label;