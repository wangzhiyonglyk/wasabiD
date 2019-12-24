//creete by wangzy
//date:2016-11-25
//desc 表单中空的占位组件,方便排版
//属性与状态值保留,可能以后有用
import React, { Component } from "react";
import PropTypes from "prop-types";
import propType from "./config/propType.js";
import defaultProps from "./config/defaultProps.js";
class   None extends Component {

 constructor(props)
 {
     super(props);
     this.state={
        value:this.props.value,
        text:this.props.text,

        validateClass:"",//验证的样式
        helpShow:"none",//提示信息是否显示
        helpTip:"",//提示信息
        invalidTip:"",
     }
 }
 
    componentWillReceiveProps(nextProps) {
        this.setState({
            hide:nextProps.hide,
            min:nextProps.min,
            max:nextProps.max,
            value: nextProps.value,
            text: nextProps.text,
            readonly: nextProps.readonly,
            required: nextProps.required,
            validateClass:"",//重置验证样式
        });

    }


    render() {
      
        let style=Object.assign({},this.props.style);
        console.log(style);
        style.width=style.width?style.width:230;

        return (<div className={ "wasabi-form-group "+this.props.className} style={style} >
                <div className={ "wasabi-form-group-body"}  >
                </div>
            </div>
        )
    }
}


None. propTypes=propType;
None.defaultProps=Object.assign({type:"none"},defaultProps);
export default None;