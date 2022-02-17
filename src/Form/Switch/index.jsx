/**
 * Created by jiaxuanliang
 * date:2016-04-05后开始独立改造
 * edit by wangzhiyong
 * date:2016-04-26
 * desc:重命名为SwitchButton 并将完善
 */

import React, { Component } from "react";
import Label from "../Label";
import propType from "../../propsConfig/propTypes.js";
import "./switch.css"
class Switch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPropsValue: this.props.value,
            checked: this.props.value ? 1 : 0,//用于回传给表单组件
        }
        this.handleClick = this.handleClick.bind(this)
    }

    static getDerivedStateFromProps(props, state) {
        if (props.value !==state.oldPropsValue) {
            return {
                checked: props.value ? 1 : 0
            }
        }
        return null;
    }
    validate() {
        return true;
    }
    getValue() {//获取值
        return this.state.checked ? 1 : 0;
    }
    setValue(value) {//设置值
        //防止异步取值
        this.state.value = value;
        this.setState({
            value: value,
            checked: this.props.value ? 1 : 0
        })
    }
    handleClick() {
        if (this.props.readOnly) {
            return;
        }
        this.setState({
            checked: !this.state.checked
        });
            this.props.onSelect&& this.props.onSelect(!this.state.checked, this.state.checked, this.props.name);
        

    }
    render() {
        let componentClassName = "wasabi-form-group " + (this.props.className || "");//组件的基本样式 
        let className = "syncbtn ";
        if (this.state.checked) {
            className += "checktrue";
        } else {
            className += "checkfalse";
        }
        if (this.props.readOnly) {
            className += " disabled";
        }
   
        return (
            <div className={componentClassName + " " + this.props.validateClass} style={this.props.style}>
                <Label readOnly={this.props.readOnly || this.props.disabled} style={this.props.labelStyle} required={this.props.required}>{this.props.label}</Label>
                <div className={"wasabi-form-group-body"} style={{ width: !this.props.label ? "100%" : null }}>
                    <div style={this.props.style} className={className} onClick={this.handleClick}>
                        <div className={"slideblock "}></div>
                    </div>
                    <small className={"wasabi-help-block "} style={{
                        display: (this.state.inValidateText && this.state.inValidateText !=="") ?
                            this.state.inValidateShow : "none"
                    }}>
                        {this.state.inValidateText}
                    </small>
                </div>
            </div>

        )
    }
}

Switch.propTypes = propType;
Switch.defaultProp = { type: "switch" }
export default Switch;