//creete by wangzhiyong
//date:2016-11-25
//desc 表单中空的占位组件,方便排版
//属性与状态值保留,可能以后有用
import React, { Component } from "react";
import propType from "../propsConfig/propTypes.js";
class None extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            text: this.props.text,
            validateClass: "",//验证的样式
            inValidateShow: "none",//提示信息是否显示
            inValidateText: "",//提示信息

        }
    }
    render() {

        let style = Object.assign({}, this.props.style);
        console.log(style);
        style.width = style.width ? style.width : 230;

        return (<div className={"wasabi-form-group " + this.props.className} style={style} >
            <div className={"wasabi-form-group-body"}  >
            </div>
        </div>
        )
    }
}
None.propTypes = propType;
None.defaultProps = { type: "none" }
export default None;