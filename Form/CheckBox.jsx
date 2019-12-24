/**
 * Created by zhiyongwang on 2016-04-05以后.
 * 复选框集合组件
 */

import React, { Component } from "react";
import unit from "../libs/unit.js";
import FetchModel from "../Model/FetchModel.js";
import validation from "../Lang/validation.js";
import validate from "../Mixins/validate.js";
import showUpdate from "../Mixins/showUpdate.js";

import Label from "../Unit/Label.jsx";
import Message from "../Unit/Message.jsx";

import props from "./config/propType.js";
import defaultProps from "./config/defaultProps.js";
import("../Sass/Form/Input.css");
import("../Sass/Form/Check.css");

class CheckBox extends Component {
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
    validate(value) {

        validate.call(this, value)
    }
    showUpdate(newParam, oldParam) {
        showUpdate.call(this, newParam, oldParam);
    }
    componentWillMount() {//如果指定url,先查询数据再绑定

        this.loadData(this.props.url, this.state.params);//查询数据
    }

    loadData(url, params) {

        if (url != null && url != "") {
            if (params == null) {
                var fetchmodel = new FetchModel(url, this.loadSuccess, null, this.loadError);

                unit.fetch.get(fetchmodel);
            }
            else {
                var fetchmodel = new FetchModel(url, this.loadSuccess, params, this.loadError);

                unit.fetch.post(fetchmodel);
            }
            console.log("checkbox", fetchmodel);
        }
    }
    loadError(errorCode, message) {//查询失败
        console.log("checkbox-error", errorCode, message);
        Message.error(message);
    }
    loadSuccess(data) {//数据加载成功
        var realData = data;
        if (this.props.dataSource == null) {
        }
        else {
            realData = unit.getSource(data, this.props.dataSource);
        }
        var newData = []; var text = this.state.text;
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
        window.localStorage.setItem(this.props.name + 'data', JSON.stringify(newData));//用于后期获取所有数据

        this.setState({
            data: newData,
            value: this.state.value,
            text: text,
        })
    }
    changeHandler(event) {//一定绑定，但不处理

    }

    onSelect(value, text, row, e) {//选中事件
        e.preventDefault();//因为有用户借助label属性生成新的checkbox,所以要阻止默认事件

        if (this.props.readonly) {
            return;
        }
        var newvalue = ""; var newtext = "";
        var oldvalue = "";
        var oldtext = "";
        if (!this.state.value) {//没有选择任何项
        }
        else {
            oldvalue = this.state.value.toString();
        }
        if (!this.state.text) {//没有选择任何项
        }
        else {
            oldtext = this.state.text.toString();
        }
        if (("," + oldvalue).indexOf("," + value) > -1) {
            //取消选中
            if (oldvalue.indexOf("," + value) > -1) {//说明不是第一个
                newvalue = (oldvalue).replace("," + value, "");
                newtext = (oldtext).replace("," + text, "");
            }
            else if (oldvalue.indexOf(value + ",") > -1) {//第一个
                newvalue = (oldvalue).replace(value + ",", "");
                newtext = (oldtext).replace(text + ",", "");
            }
            else if (oldvalue.indexOf(value) > -1) {//只有一个
                newvalue = (oldvalue).replace(value, "");
                newtext = (oldtext).replace(text, "");
            }

        }
        else {//选中

            newvalue = oldvalue === "" ? value : oldvalue + "," + value;
            newtext = oldvalue === "" ? text : oldtext + "," + text;
        }
        this.setState({
            value: newvalue,
            text: newtext
        });

        this.validate(newvalue);
        if (this.props.onSelect != null) {
            this.props.onSelect(newvalue, newtext, this.props.name, row);
        }
    }
    render() {

        console.log("checkbox",this.props);
        var componentClassName = "wasabi-form-group ";//组件的基本样式
        var control = null;
        if (this.state.data instanceof Array) {
            control = this.state.data.map((child, i) => {
                var checked = false;
                if ((this.state.value != null && this.state.value != undefined) && (("," + this.state.value.toString()).indexOf("," + child[this.props.valueField]) > -1)) {
                    checked = true;
                }
                var props = {
                    checked: checked,//是否为选中状态
                    readOnly: this.props.readonly == true ? "readonly" : null,
                }
                return <li style={this.props.style} className={this.props.className} key={i} onClick={this.onSelect.bind(this, child.value, child.text, child)}  >
                    <input type="checkbox" id={"checkbox" + this.props.name + child.value}
                        className="checkbox"  {...props} onChange={() => { }}></input>
                    <label className="checkbox-label"  {...props}></label>
                    <div className="checktext" >{child.text}</div>
                </li >
            });

        }
        return (

            <div className={componentClassName + this.state.validateClass} >
                <Label name={this.props.label} ref="label" style={this.props.labelStyle} hide={this.props.hide} required={this.props.required}></Label>
                <div className={"wasabi-form-group-body"} style={{ width: !this.props.label ? "100%" : null }}>
                    <ul className="wasabi-checkul" style={{marginTop:6}}>
                        {
                            control
                        }
                    </ul>
                    <small className={"wasabi-help-block "} style={{ display: (this.state.helpTip && this.state.helpTip != "") ? this.state.helpShow : "none" }}><div className="text">{this.state.helpTip}</div></small>
                </div>
            </div>

        )

    }

}
CheckBox.propTypes = props;

CheckBox.defaultProps =  Object.assign({},defaultProps,{type:"checkbox"});

export default CheckBox;

