/**
 * Created by zhiyongwang on 2016-04-26
 * desc:下拉框容器
 *
 */
import React, { Component } from "react";
import DatePicker from "../DatePicker";
import Picker from "../Picker";
import Select from "../Select";
import TreePicker from "../TreePicker";
import GridPicker from "../GridPicker";
import propTypes from "../../propsConfig/propTypes.js";

import "./combobox.css"
class ComboBox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.combobox = React.createRef();
        this.state = {

        }
    }
    validate() {//用于Form调用验证
        return this.combobox.current.validate();
    }
    getValue() {//用于调用获取值
        return this.combobox.current.getValue();
    }
    setValue(value) {//用于调用设置值
        this.combobox.current.setValue(value);
    }
    /**
    * 重新查询数据
    * @param {*} params 
    * @param {*} url 
    */
    reload(params, url) {
        this.combobox.current.reload && this.combobox.current.reload(params, url);
    }

    renderSelect() {//普通下拉框        
        return <Select ref={this.combobox} {...this.props}  ></Select>
    }
    renderPicker() {//下拉面板
        return <Picker ref={this.combobox} {...this.props}></Picker>
    }
    renderDatePicker() {
        return <DatePicker ref={this.combobox} {...this.props}></DatePicker>
    }
    renderTreePicker() {
        return <TreePicker ref={this.combobox} {...this.props}></TreePicker>;
    }
    renderGridPicker() {
        return <GridPicker ref={this.combobox} {...this.props}></GridPicker>;
    }

    render() {

        let control = null;
        switch (this.props.type) {
            case "select":
                control = this.renderSelect();
                break;
            case "picker":
                control = this.renderPicker();
                break;
            case "treepicker":
                control = this.renderTreePicker();
                break;
            case "gridpicker":
                control = this.renderGridPicker();
                break;
            case "date":
                control = this.renderDatePicker();
                break;
            case "timerange":
                control = this.renderDatePicker();
                break;
            case "time":
                control = this.renderDatePicker();
                break;
            case "datetime":
                control = this.renderDatePicker();
                break;
            case "daterange":
                control = this.renderDatePicker();
                break;
            case "datetimerange":
                control = this.renderDatePicker();
                break;

        }
        return control;
    }
}

ComboBox.propTypes = propTypes;
ComboBox.defaultProps = { type: "select" }
export default ComboBox;