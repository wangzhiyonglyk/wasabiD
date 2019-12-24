//creete by wangzy
//date:2016-11-21
//desc 增加多行文本
import React, { Component } from "react";
import unit from "../libs/unit.js";

import  validation from "../Lang/validation.js";
import  validate from "../Mixins/validate.js";
import  Label from "../Unit/Label.jsx";
import  Button from "../Buttons/Button.jsx";
// var pasteExtend=require("../Mixins/pasteExtend.js");
import  ClickAway from "../Unit/ClickAway.js";
import propType from "./config/propType.js";
import defaultProps from "./config/defaultProps.js";
class  MutiText extends Component {
    constructor(props){
        super(props);
        this.state={
           
            value:this.props.value,
            text:this.props.text,       
            //其他属性
            show:false,//是否显示
            //验证
            required:this.props.required,
            validateClass:"",//验证的样式
            helpShow:"none",//提示信息是否显示
            helpTip:validation["required"],//提示信息
            invalidTip:"",
            areaValue:this.props.value?this.props.value.replace(/,/g, "\n"):null,//多行文本框的值

        }
        this.setValue=this.setValue.bind(this);
        this.getValue=this.getValue.bind(this);
        this.onBlur=this.onBlur.bind(this);
        this.changeHandler=this.changeHandler.bind(this);
        this.onlineChangeHandler=this.onlineChangeHandler.bind(this);
        this.showPicker=this.showPicker.bind(this);
        this.hidePicker=this.hidePicker.bind(this);
        this.clearHandler=this.clearHandler.bind(this);
        this.cancelHandler=this.cancelHandler.bind(this);
        this.onSelectHandler=this.onSelectHandler.bind(this);
    }
  
    componentWillReceiveProps(nextProps) {
     

    }
    validate(value){
        validate.call(this,value);
    }
      setValue(value)    {
      this.setState({
          value:value,
      })
    }
    getValue()  {
        return this.state.value;

    }
    componentDidMount(){

       // this.registerClickAway(this.hidePicker, this.refs.picker);//注册全局单击事件
    }
    onBlur () {
        this.refs.label.hideHelp();//隐藏帮助信息
    }
    changeHandler(event)
    {
        this.setState({
            areaValue:event.target.value,
        })
    }
    onlineChangeHandler(event) {//对应onChange事件
        // this.setState({
        //     value:event.target.value,
        //     text:event.target.value,
        //     areaValue:event.target.value,
        //     show:false
        // })
        // if( this.props.onSelect!=null)
        // {
        //     this.props.onSelect(event.target.value,event.target.value,this.props.name);
        // }
    }
    showPicker() {//显示选择
        if (this.props.readonly) {
            //只读不显示
            return;
        }
        else {
            this.setState({
                show: !this.state.show
            })
        }
        //this.bindClickAway();//绑定全局单击事件
    }
    hidePicker () {
        this.setState({
            show: false
        })
        //this.unbindClickAway();//卸载全局单击事件
    }
    clearHandler() {//清除数据
        this.setState({
            value:"",
            text:"",
            areaValue:""
        })
       
        this.props.onSelect&&this.props.onSelect("","",this.props.name,null);
       
    }
    cancelHandler() {//取消选择
        this.setState({
            show: false,
            areaValue:this.state.value?this.state.value.replace(/,/g, "\n"):null,//还原之前的值

        })
    }
    onSelectHandler() {//确定事件
        this.setState({
            show:false,
            value:this.state.areaValue?this.state.areaValue.replace(/\n/g, ","):null,
            text:this.state.areaValue?this.state.areaValue.replace(/\n/g, ","):null,
        });
        if( this.props.onSelect!=null)
        {
            this.props.onSelect(this.state.areaValue?this.state.areaValue.replace(/\n/g, ","):null,this.state.areaValue?this.state.areaValue.replace(/\n/g, ","):null,this.props.name,null);
        }
    }
    render() {     
        var componentClassName=  "wasabi-form-group ";//组件的基本样式
        let inputProps=
        {
            readOnly:this.props.readonly==true?"readonly":null,
            style:this.props.style,
            name:this.props.name,
            placeholder:(this.props.placeholder===""||this.props.placeholder==null)?this.props.required?"必填项":"":this.props.placeholder,
            className:"wasabi-form-control  "+(this.props.className!=null?this.props.className:"")

        }//文本框的属性

        //textarea 不支持null值
        let areaValue=this.state.areaValue;
        if(!areaValue)
        {
            areaValue="";
        }
        return (
            <div className={componentClassName+this.state.validateClass} ref="picker" style={{display:this.props.hide==true?"none":"block"}}>
                <Label name={this.props.label} ref="label" style={this.props.labelStyle} hide={this.props.hide} required={this.props.required}></Label>
                <div className={ "wasabi-form-group-body"} style={{width:!this.props.label?"100%":null}}>
                    <div className="combobox"  style={{display:this.props.hide==true?"none":"block"}}   >
                        <i className={"picker-clear"} onClick={this.clearHandler} style={{display:this.props.readonly?"none":(this.state.value==""||!this.state.value)?"none":"inline"}}></i>
                        <i className={"pickeradd " +(this.state.show?"rotate":"")} onClick={this.showPicker}></i>
                        <input type="text"  {...inputProps}  value={this.state.text}  onBlur={this.onBlur} onChange={this.onlineChangeHandler}      />
                        <div className={"dropcontainter  mutiText "+this.props.position}  style={{display:this.state.show==true?"block":"none"}}  >
                            <div style={{height:30,lineHeight:"30px",color:"#aaaaaa",overflow:"hidden", display:this.props.placeholder?"block":"none"}}>{this.props.placeholder}</div>
                       <textarea value={areaValue} ref="input" onChange={this.changeHandler} placeholder="回行代表一行"
                                 style={{width:"100%",height:100,border:"1px solid #d7dde2",resize:"none"}}></textarea>
                            <div className="ok" >
                                <Button title="确定" name="ok"  size="small" theme="primary" onClick={this.changeHandler}></Button>
                                <Button title="取消" name="cancel"  size="small" theme="cancel" onClick={this.cancelHandler}></Button>
                            </div>
                        </div>
                    </div>
                    <small className={"wasabi-help-block "} style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}><div className="text">{this.state.helpTip}</div></small>
                </div>
            </div>


        )
    }
}

MutiText.propTypes=propType;
 MutiText.defaultProps=Object.assign({type:"muti"},defaultProps);

 export default MutiText;