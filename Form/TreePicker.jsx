/*
 create by wangzy
 date:2016-07-04
 desc:列表下拉选择
 */
import React, { Component } from "react";


import Tree from "../Data/Tree.jsx";
import unit from "../libs/unit.js";
import validation from "../Lang/validation.js";

import validate from "../Mixins/validate.js";
import showUpdate from "../Mixins/showUpdate.js";

import Label from "../Unit/Label.jsx";
import ClickAway from "../Unit/ClickAway.js";
import props from "./config/propType.js";
import defaultProps from "./config/defaultProps.js";
class TreePicker extends Component{
   
    constructor(props){
        this.state={
            hide:this.props.hide,
            params:this.props.params,//默认筛选条件
            url:null,//默认为空,表示不查询,后期再更新,
            show:false,//
            value:this.props.value,
            text:this.props.text,
            readonly:this.props.readonly,
            data:this.props.data,
            //验证
            required:this.props.required,
            validateClass:"",//验证的样式
            helpShow:"none",//提示信息是否显示
            helpTip:validation["required"],//提示信息
            invalidTip:"",
        }
    }
   
    componentWillReceiveProps(nextProps) {
        /*
         this.isChange :代表自身发生了改变,防止父组件没有绑定value,text,而导致无法选择
         */
        this.isChange=false;//重置
        var value=this.isChange?this.state.value: nextProps.value;
        var text = this.isChange?this.state.text: nextProps.text;
        this.setState({
           
            value:value,
            text:text,
            url:nextProps.url,
            data: nextProps.data,
            params:unit.clone( nextProps.params),
            validateClass:"",//重置验证样式
            helpTip:validation["required"],//提示信息
        })
    }
    componentDidUpdate() {
        if(this.isChange==true)
        {//说明已经改变了,回传给父组件
            if( this.props.onSelect!=null)
            {
                this.props.onSelect(this.state.value,this.state.text,this.props.name,this.property);
            }
        }
    }
    componentDidMount(){

       // this.registerClickAway(this.hidePicker, this.refs.picker);//注册全局单击事件
    }
    changeHandler(event) {
    }
    validate(value) {

        validate.call(this, value)
    }
    showUpdate(newParam, oldParam) {
        showUpdate.call(this, newParam, oldParam);
    }
      setValue(value) {
        let text = "";
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].value == value) {
                text = this.state.data[i].text;
                break;
            }
        }
            this.setState({
                value: value,
                text: text
            })
        

    }
    getValue() {
        return this.state.value;

    }
    onBlur () {
        this.refs.label.hideHelp();//隐藏帮助信息
    }
    showPicker(type) {//显示选择
        if (this.props.readonly) {
            //只读不显示
            return;
        }
        else {
            this.setState({
                show: type==1?!this.state.show:true
            })
        }
        this.bindClickAway();//绑定全局单击事件
    }
    hidePicker () {
        this.setState({
            show: false
        })
        this.unbindClickAway();//卸载全局单击事件
    }
    onSelect(value,text,name,row) {
      
      
        this.setState({
            value: value,
            text: text,
            show: !this.state.show
        });
        this.validate(value);//
                if (this.props.onSelect != null) {
                    this.props.onSelect(value, text, name, row);
                }

    }
    clearHandler() {//清除数据
        this.setState({
            value: "",
            text: "",
        })
         this.props.onSelect&& this.props.onSelect("", "", this.props.name, null); 
    }
    render() {             
        var componentClassName=  "wasabi-form-group ";//组件的基本样式
            let inputProps=
            {
                readOnly:this.props.readonly==true?"readonly":null,
                style:this.props.style,
                name:this.props.name,
                placeholder:(this.props.placeholder===""||this.props.placeholder==null)?this.props.required?"必填项":"":this.props.placeholder,
                className:"wasabi-form-control  "+(this.props.className!=null?this.props.className:""),
                title:this.props.title,

            }//文本框的属性
        return <div className={componentClassName+this.state.validateClass}  ref="picker" style={{display:this.props.hide==true?"none":"block"}}>
            <Label name={this.props.label} ref="label" style={this.props.labelStyle} required={this.props.required}></Label>
            <div className={ "wasabi-form-group-body"} style={{width:!this.props.label?"100%":null}}>
                <div className="combobox"    >
                    <i className={"picker-clear "} onClick={this.clearHandler} style={{display:this.props.readonly?"none":(this.state.value==""||!this.state.value)?"none":"inline"}}></i>
                    <i className={"pickericon  " +(this.state.show?"rotate":"")} onClick={this.showPicker.bind(this,1)}></i>
                    <input type="text" {...inputProps}  value={this.state.text} onBlur={this.onBlur}   onClick={this.showPicker.bind(this,2)} onChange={this.changeHandler}     />
                    <div className={"dropcontainter treepicker  "} style={{height:this.props.height,display:this.state.show==true?"block":"none"}}  >
                        <Tree
                            name={this.props.name}  value={this.state.value} text={this.state.text}
                            valueField={this.props.valueField} textField={this.props.textField} dataSource={this.props.dataSource}
                            url={this.props.url}  params={this.props.params} data={this.state.data} onSelect={this.onSelect}
                        ></Tree>
                    </div>
                </div>

                <small className={"wasabi-help-block "} style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}>{this.state.helpTip}</small>
            </div>
        </div>

    }
}
 
TreePicker. propTypes=props;
TreePicker. defaultProps=Object.assign({type:"treepicker",defaultProps});
export default  TreePicker;