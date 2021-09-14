import React from "react";
import BaseInput from "../BaseInput"
import validateHoc from "../validateHoc";
import propType from "../../propsConfig/propTypes.js";

class Password extends React.Component {
    constructor(props) {
        super(props);
        this.inputControl = React.createRef();
        this.inputdom = React.createRef();
        this.state = {
            tempValue: this.props.value || ""
        }
        this.onChange = this.onChange.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this)
    }

    /**
     * change
     * @param {*} value 
     */
    onChange(event) {
        let value = event.target.value;
        let tempValue;
        if (event.target.selectionStart === value.length) {

            let add = value.length > this.state.tempValue.length;
            tempValue = add ? this.state.tempValue + (value.slice(this.state.tempValue.length)) : this.state.tempValue.slice(0, value.length);
            this.setState({
                tempValue: tempValue
            })
            this.props.onChange && this.props.onChange(tempValue, tempValue, this.props.name, event)
        }
        else {
            //禁止从中间删除

        }

    }
    getValue() {
        return this.state.tempValue;
    }
    setValue(value) {
        this.setState({
            tempValue: value
        })

    }
    /************以下事件都是为了防止密码的输入出问题 ***********/
    onKeyUp(event) {
        //禁止移动光标
        if (event.keyCode >= 35 && event.keyCode <= 40) {
            //控制光标位置
            event.target.selectionStart = event.target.value.length;
        }

    }
    /**
     * //验证密码强度
     * @param {*} event 
     */
    onBlur(event) {

        this.props.validate && this.props.validate(this.state.tempValue)
    }
    /**
     * 粘贴处理,禁止粘贴
     * @param {*} event 
     */
    onPaste(event) {
        event.preventDefault();//阻止默认事件
    }
    /**
     *  //控制光标位置
     * @param {*} event 
     */
    onClick(event) {

        event.target.selectionStart = event.target.value.length;
    }
    /**
     * 防止选择部分，然后滑出，再删除
     * @param {*} event 
     */
    onMouseOut(event) {
        this.inputControl.current.selectionStart = this.state.tempValue.length;
    }
    render() {
        return <React.Fragment> <BaseInput
            title={this.props.title}
            name={this.props.name}
            placeholder={this.props.placeholder}
            readOnly={this.props.readOnly}
            ref={this.inputControl}
            value={this.state.tempValue.replace(/./g, "*")}
            onBlur={this.onBlur}
            onPaste={this.onPaste}
            onChange={this.onChange}
            onKeyUp={this.onKeyUp}
            onClick={this.onClick}
            onFocus={this.onClick}
            onMouseOut={this.onMouseOut}
        ></BaseInput>
            {this.props.children} </React.Fragment>
    }
}
Password.propTypes = propType;
Password.defaultProps = { type: "password" }
export default validateHoc(Password,"password");
