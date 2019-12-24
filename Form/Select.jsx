/**
 * Created by zhiyongwang
 * date:2016-04-05后开始独立改造
 * 下拉框
 */
import React, { Component } from "react";

import unit from  "../libs/unit.js";
import FetchModel from "../Model/FetchModel.js";
import validation from "../Lang/validation.js";
import validate  from "../Mixins/validate.js";
import showUpdate from "../Mixins/showUpdate.js";
import Label from "../Unit/Label.jsx";
import Message from "../Unit/Message.jsx";
import ClickAway  from "../Unit/ClickAway.js";

import props from "./config/propType.js";
import defaultProps from  "./config/defaultProps.js";
import ("../Sass/Form/Select.css");
class  Select extends  Component{
 
    constructor(props) {

        super(props);;
      
        //对传来的数据进行格式化
        var newData = []; var text = this.props.text;
        if (this.props.data instanceof Array) {
            for (let i = 0; i < this.props.data.length; i++) {
                let obj = this.props.data[i];
                obj.text = this.props.data[i][this.props.textField];
                obj.value = this.props.data[i][this.props.valueField];
                if (obj.value == this.props.value) {
                    text = obj.text;//根据value赋值
                }
                newData.push(obj);
            }
        }
        this.state = {
            params: unit.clone(this.props.params),//参数
            data: newData,
            value: this.props.value,
            text: text,
            ulShow: false,//是否显示下拉选项
            validateClass: "",//验证的样式
            helpShow: "none",//提示信息是否显示
            helpTip: validation["required"],//提示信息
            invalidTip: "",
        }
        this.setValue = this.setValue.bind(this);
        this.getValue = this.getValue.bind(this);
        this.loadData = this.loadData.bind(this);
        this.loadError = this.loadError.bind(this);
        this.loadSuccess = this.loadSuccess.bind(this);
        this.changeHandler = this.changeHandler.bind(this);

        this.onSelect = this.onSelect.bind(this);

    }

    componentWillReceiveProps(nextProps) {
      
        if (nextProps.url) {

            if (nextProps.url != this.props.url) {
                this.loadData(nextProps.url, nextProps.params);
            }
            else if (this.showUpdate(nextProps.params, this.props.params)) {//如果不相同则更新
                this.loadData(nextProps.url, nextProps.params);
            }

        } else if (nextProps.data && nextProps.data instanceof Array) {//又传了数组
            if (nextProps.data.length != this.props.data.length) {
                    this.setState({
                        data:nextProps.data,
                        value:"",
                        text:""
                    })
            }else{
                let newData=[];
                for(let i=0;i<nextProps.data.length;i++)
            {
                let obj=nextProps.data[i];
                obj.text=nextProps.data[i][this.props.textField];
                obj.value=nextProps.data[i][this.props.valueField];
              
                newData.push(obj);
            }
            if(newData[0].text!=this.state.data[0].text||newData[newData.length-1].text!=this.state.data[this.state.data.length-1].text)
            {this.setState({
                data:nextProps.data,
                value:"",
                text:""
            })

            }
        }
        }
    }
    componentWillMount () {//如果指定url,先查询数据再绑定
        this.loadData(this.props.url, this.state.params);//查询数据
    }
    componentDidMount () {

        //this.registerClickAway(this.hideOptions, this.refs.select);//注册全局单击事件
    }
    componentDidUpdate () {
      
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
    loadData (url, params) {
        if (url != null && url != "") {
            if (params == null) {
                var fetchmodel = new FetchModel(url, this.loadSuccess, null, this.loadError);
                unit.fetch.get(fetchmodel);
            }
            else {
                var fetchmodel = new FetchModel(url, this.loadSuccess, params, this.loadError);
                unit.fetch.post(fetchmodel);
            }
           
        }
    }
    loadSuccess (data) {//数据加载成功
        var realData = data;
        if (this.props.dataSource == null) {
        }
        else {
            realData = unit.getSource(data, this.props.dataSource);
        }
        var newData = [];
        var text = this.state.text;
        for (let i = 0; i < realData.length; i++) {
            let obj = realData[i];//将所有字段添加进来
            obj.text = realData[i][this.props.textField];
            obj.value = realData[i][this.props.valueField];
            if (obj.value == this.state.value) {
                text = obj.text;//根据value赋值
            }
            newData.push(obj);
        }
        if (this.props.extraData == null || this.props.extraData.length == 0) {
            //没有额外的数据
        }
        else {
            //有额外的数据
            for (let i = 0; i < this.props.extraData.length; i++) {
                let obj = {};
                obj.text = this.props.extraData[i][this.props.textField];
                obj.value = this.props.extraData[i][this.props.valueField];
                if (obj.value == this.state.value) {
                    text = obj.text;//根据value赋值
                }
                newData.unshift(obj);
            }
        }
        this.setState({
            data: newData,
            value: this.state.value,
            text: text,
        })
    }
    loadError (errorCode, message) {//查询失败
        console.log("select-error", errorCode, message);
        Message.error(message);
    }
    showOptions (type) {//显示下拉选项
       
        if (this.state.readonly) {
            return;
        }
        if (this.props.onClick != null) {
            this.props.onClick();
        }
        this.setState({
            show: type == 1 ? !this.state.show : true,
        });
        this.bindClickAway();//绑定全局单击事件
    }
    hideOptions (event) {
      
        this.setState({
            show: false
        });
        this.unbindClickAway();//卸载全局单击事件
    }

    onSelect (value, text, row) {//选中事件  
       
            if (this.state.multiple) {

                var oldvalue = [];
                var oldtext = [];
                if (this.state.value) {
                    oldvalue = this.state.value.toString().split(",");
                    oldtext = this.state.text.toString().split(",");
                }
                if (oldvalue.indexOf(value.toString()) > -1) {//取消选中
                    oldvalue.splice(oldvalue.indexOf(value.toString()), 1);
                    oldtext.splice(oldvalue.indexOf(value.toString()), 1);
                    newvalue = oldvalue.join(",");
                    newtext = oldtext.join(",");
                }
                else {//选中
                    if (this.state.value) {
                        newvalue = this.state.value + "," + value;
                        newtext = this.state.text + "," + text;
                    }
                    else {
                        newvalue = value;
                        newtext = text;
                    }

                }
                this.setState({
                    value: newvalue,
                    text: newtext,
                });
                this.validate(newvalue);//
                if (this.props.onSelect != null) {
                    this.props.onSelect(value, text, this.props.name, row);
                }
            }
            else {
                var newvalue = value;
                var newtext = text;
                this.setState({
                    show: false,
                    value: newvalue,
                    text: newtext,
                    filterValue: null,
                });
            }
            this.validate(newvalue);//
            if (this.props.onSelect != null) {
                this.props.onSelect(value, text, this.props.name, row);
            }
        }


    
    getComponentData () {//只读属性，获取当前下拉的数据源
        return this.state.data;
    }
    onBlur () {

        this.refs.label.hideHelp();//隐藏帮助信息
    }
    keyUpHandler (event) {
        if (this.props.addAbled && event.keyCode == 13) {
            var filter = this.state.data.filter((item, index) => {
                return item.text == event.target.value;
            })
            if (filter.length == 0) {


                this.state.data.push({
                    value: event.target.value,
                    text: event.target.value,
                })
                this.setState({
                    data: this.state.data,
                })
                if (this.props.addHandler) {
                    this.props.addHandler(this.state.data);
                }
            }
            ;

        }
    }
    filterChangeHandler (event) {//筛选查询
        
        this.setState({
            filterValue: event.target.value,
            show: true,
        })
        this.refs.ul.scrollTop = 0;//回到顶部


    }
    clearHandler () {//清除数据
       
        this.setState({
            value: "",
            text: "",
        })
         this.props.onSelect&& this.props.onSelect("", "", this.props.name, null);      
    }
    render () {
    
        var componentClassName = "wasabi-form-group ";//组件的基本样式
        let inputProps =
            {
                readOnly: this.state.readonly == true ? "readonly" : null,
                style: this.props.style,
                name: this.props.name,
                placeholder: (this.props.placeholder === "" || this.props.placeholder == null) ? this.state.required ? "必填项" : "" : this.props.placeholder,
                className: "wasabi-form-control  " + (this.props.className != null ? this.props.className : ""),
                title: this.props.title,

            }//文本框的属性
        var control = null;
        if (this.state.data && this.state.data.length > 0) {
            control = <ul style={{display: this.state.show == true ? "block" : "none"}} ref="ul">
                {
                    this.state.data.map((child, i) => {
                        var reg = new RegExp(this.state.filterValue, "i");
                        if (this.state.filterValue && child.text.search(reg) == -1) {
                            return;
                        }
                        else {
                            //TODO 这里要用正则，先保留
                            var checked = false;
                            if ((this.state.value && child.value) && (("," + this.state.value.toString() + ",").indexOf("," + child.value + ",") > -1)) {
                                checked = true;
                            }
                            else if (this.state.value == "" && child.value == "") {
                                checked = true;
                            }
                            return (
                                <li key={"li" + i} className={checked == true ? "active" : ""}
                                    onClick={this.onSelect.bind(this, child.value, child.text, child)}>{child.text}</li>
                            )
                        }
                    })

                }
            </ul>;
        }

        return (
            <div className={componentClassName + this.state.validateClass} ref="select" style={{display:this.state.hide==true?"none":"block"}}>
                <Label name={this.props.label} ref="label" 
                       required={this.state.required} style={this.props.labelStyle}></Label>
                <div className={ "wasabi-form-group-body"}>
                    <div className={"nice-select "} >
                        <i className={"picker-clear"} onClick={this.clearHandler}
                           style={{display: this.state.readonly ? "none" : (this.state.value == "" || !this.state.value) ? "none" : "inline"}}></i>
                        <i className={"icon " + (this.state.show ? "rotate" : "")}
                           onClick={this.showOptions.bind(this, 1)}></i>
                        <input type="text" {...inputProps} title={this.props.addAbled ? "输入搜索，回车添加" : "输入搜索"}
                               onKeyUp={this.keyUpHandler}
                               value={this.state.filterValue != null ? this.state.filterValue : this.state.text}
                               onClick={this.showOptions.bind(this, 2)} onBlur={this.onBlur}
                               onChange={this.filterChangeHandler}/>

                        {
                            control
                        }
                    </div>
                    <small className={"wasabi-help-block " }
                           style={{display: (this.state.helpTip && this.state.helpTip != "") ? this.state.helpShow : "none"}}>
                        <div className="text">{this.state.helpTip}</div>
                    </small>
                </div>
            </div>

        );

    }

}


Select.propTypes= props;
Select.defaultProps=Object.assign({type:"select",defaultProps});
   
export default Select;