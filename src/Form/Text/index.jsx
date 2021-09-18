//creete by wangzhiyong
//date:2016-08-02
//edit by wangzhiyong 2020-10-18 todo blur事件要改
//desc 将输入框从Input中独立出来
import React, { Component } from "react";
import propTypes from "../../propsConfig/propTypes.js";

import SelectbleList from "../Select/SelectbleList"
//hoc
import loadDataHoc from "../../loadDataHoc";
import validateHoc from "../validateHoc"
import dom from "../../libs/dom"
import "../Select/select.css"

/**
 * 图标
 * @param {*} props 
 * @returns 
 */
function Icon(props) {
    return <i disabled={props.disabled} className=" icon-search"
        style={{ cursor: "pointer", position: "absolute", right: 10, top: 15, color: "var(--primary-color)" }}
        onClick={props.onSearch}></i>
}

/**
 * 数据列表
 * @param {*} props 
 * @returns 
 */
function DataList(props) {
    return <div className="wasabi-select">
        <SelectbleList
            show={props.show}
            value={props.value || ""}
            data={props.data || []}
            onSelect={props.onSelect}
        ></SelectbleList>
    </div>
}
/**
 * 文本框
 * @param {*} props 
 * @returns 
 */
function TextInput(props) {
    if (props.type !== "textarea") {

        return <input {...props} autoComplete="off"></input>
    }
    else {
        let style
        return <textarea {...props} autoComplete="off" ></textarea>;
    }
}

class Text extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPropsValue: null,//保存用于匹配
            value: this.props.value || "",
            show: false,
        }

        this.onChange = this.onChange.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);
        this.blurHandler = this.blurHandler.bind(this);

        this.getValue = this.getValue.bind(this);
        this.setValue = this.setValue.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.hidePicker = this.hidePicker.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.cellHandler = this.cellHandler.bind(this);
    }
    static getDerivedStateFromProps(props, state) {
        if (props.value != state.oldPropsValue) {
            //就是说原来的初始值发生改变了，说明父组件要更新值
            return {
                value: props.value || "",
                oldPropsValue: props.value
            }
        }
        return null;
    }
    getValue() {//获取值
        return this.state.value;
    }
    setValue(value) {//设置值
        this.setState({
            value: value,
            show: false,
        })
    }
    /**
   * 隐藏下拉框
   * @param {*} event 
   */
    hidePicker(event) {
        if (event.target && !dom.isDescendant(document.getElementById(this.props.containerid), event.target)) {
            this.setState({
                show: false
            });
            try {
                document.removeEventListener("click", this.hidePicker, fal);
            }
            catch (e) {
            }
        }
    }
    onChange(event) {
        let value = event.target.value.toString();
        let isvalidate = true;
        if (this.props.type == "number" || this.props.type == "integer") {
            /**
        * 数字与整数要先验证，
        * 验证时，当一个字符是+,或者-是被认为是正确，不能使用正则验证,否则通不过，但失去焦点则可以使用正则
        */
            isvalidate = (value == "+" || value == "-") || this.props.validate && this.props.validate(value);
        }

        if ((this.props.type == "number" || this.props.type == "integer")) {
            if (isvalidate) {

                this.cellHandler(event);
                 
            }
        }
        else {
            this.cellHandler(event);
            
        }


    }

    keyUpHandler(event) {
        setTimeout(() => {
            if (this.state.value.trim() == event.target.value.trim()) {
                this.onSearch();
            }
        }, 300);
        if (this.props.onKeyUp) {
            this.props.onKeyUp(event);
        }
    }
    onSearch() {
        if (this.props.url && (this.props.priKey || this.props.name)) {
            let params = {};
            params[this.props.priKey || this.props.name] = this.state.value;
            this.props.reload && this.props.reload(params)
            this.setState({
                show: true
            })
            document.addEventListener("click", this.hidePicker)
        }
        else {
            this.props.onSearch && this.props.onSearch(this.state.value);
        }

    }
    blurHandler(event) {
        this.props.validate && this.props.validate(this.state.value);
        this.props.onBlur && this.props.onBlur(event.target.value, event.target.value, event);
    }
    /**
     * 搜索后选中事件
     * @param {*} value 
     * @param {*} text 
     */
    onSelect(value, text) {
        this.setValue(value)
        this.props.onChange && this.props.onChange(value, value, this.props.name);
    }
    onPaste(event) {
        this.props.onPaste && this.props.onPaste(event, this.state.value);
    }
    /**
     * 为excel单元格粘贴复制做特殊处理
     */
    cellHandler(event) {
        const ancestorNode = dom.ancestorByClass(event.target, "wasabi-table-cell");
        let value = event.target.value;
        if (ancestorNode) {
            //是单元格中的输入框
            if (value.indexOf("\t") > -1 || value.indexOf("\n") > -1) {//csv
              
            }
            else {
                this.setValue(value);
                this.props.onChange && this.props.onChange(value, value, this.props.name);//自定义的改变事件
            }
        }
        else {
            this.setValue(value);
            this.props.onChange && this.props.onChange(value, value, this.props.name);//自定义的改变事件
        }
    }
    render() {
        return <React.Fragment>
            <TextInput
                id={this.props.id}
                type={this.props.type}
                name={this.props.name}
                readOnly={this.props.readOnly}
                className={"wasabi-input "}
                onChange={this.onChange}
                onKeyUp={this.keyUpHandler}
                onBlur={this.blurHandler}
                value={this.state.value || ""}
                onPaste={this.onPaste.bind(this)}
            ></TextInput>
            {(this.props.url || this.props.onSearch) ? <Icon disabled={this.props.disabled} onSearch={this.onSearch}></Icon> : null}
            {this.props.children}
            <DataList
                data={this.props.data}
                show={this.state.show}
                value={this.state.value || ""}
                onSelect={this.onSelect} ></DataList>
        </React.Fragment>
    }
}

Text.propTypes = propTypes;
export default validateHoc(loadDataHoc(Text, "text"), "text");