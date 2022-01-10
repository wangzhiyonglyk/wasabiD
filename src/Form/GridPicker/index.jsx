/*
 create by wangzhiyong
 date:2016-07-04
 edit 2020-10 参照ztree改造
 desc:表格下拉选择
 */
import React, { Component } from "react";
import DataGrid from "../../Data/DataGrid/index.jsx";
import props from "../../propsConfig/propTypes.js";
import validateHoc from "../validateHoc";
import func from "../../libs/func";
import dom from "../../libs/dom";
import loadDataHoc from "../../loadDataHoc/index.jsx";
import Msg from "../../Info/Msg.jsx";
class GridPicker extends Component {
    constructor(props) {
        super(props);
        this.grid = React.createRef();

        this.state = {
            containerid: func.uuid(),
            show: false,//是否显示下拉框
            text: "",
            value: "",
            oldPropsValue: "",//保存初始化的值
            filterText: "",//筛选
        }
        this.showPicker = this.showPicker.bind(this);
        this.hidePicker = this.hidePicker.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }
    static getDerivedStateFromProps(props, state) {
        if (props.value != state.oldPropsValue) {//父组件强行更新了
            return {
                value: props.value || "",
                oldPropsValue: props.value
            }
        }
        return null;
    }

    /**
     * 设置值
     * @param {*} value 
     */
    setValue(value) {
        let text = propsTran.processText(value, this.props.data);
        this.setState({
            value: value,
            text: text.join(","),
        })
        if (value) {
            value = value.split(",");
            let checkRowData = [];
            for (let i = 0; i < value.length; i++) {
                let obj = {}; obj[this.props.priKey] = value[i];
                checkRowData.push(obj);
            }
            this.grid.current.setChecked(checkRowData)
        }
        else {
            this.grid.current.clearChecked();
        }

    }
    /**
     * 获取值
     * @returns 
     */
    getValue() {
        return this.state.value;
    }
    /**
     * 清除
     */
    onClear() {
        this.setValue("");
    }
    showPicker(event) {//显示选择
        try {
         
            if (this.props.readOnly) {
                //只读不显示
                return;
            }
            else {
                this.setState({
                    show: true
                })
            }
            document.addEventListener("click", this.hidePicker)

        }
        catch (e) {

        }

    }
    /**
     * 隐藏下拉框
     * @param {*} event 
     */
    hidePicker(event) {
        if (!dom.isDescendant(document.getElementById(this.props.containerid), event.target)) {
            this.setState({
                show: false
            });

            try {

                document.removeEventListener("click", this.hidePicker);
                this.props.validate && this.props.validate(this.state.value);
                //在此处处理失去焦点事件
                this.props.onBlur && this.props.onBlur(this.state.value, this.state.text, this.props.name);
            }
            catch (e) {

            }
        }
    }
    /**
     * 选择
     * @param {*} checked 
     * @param {*} value 
     * @param {*} text 
     * @param {*} row 
     */
    onSelect(data) {
        if (this.props.valueField) {
            let value = [];
            let text = [];
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    value.push(data[this.props.valueField] || "");
                    text.push(data[this.props.textField] || "");
                }
            }
            this.setState({
                value: value.join(","),
                text: text.join(",")
            })
            this.props.onSelect && this.props.onSelect(value.join(","), text.join(","), this.props.name, {});
        }
        else {
            Msg.error("必须设置valueField,textField");
        }



    }
    /**
     * 翻页
     * @param {*} pageSize 
     * @param {*} pageIndex 
     * @param {*} sortName 
     * @param {*} sortOrder 
     */
    onUpdate(pageSize, pageIndex, sortName, sortOrder) {
        let params = {
            pageSize,
            pageIndex,
            sortName,
            sortOrder
        }
        this.props.reload && this.props.reload(params);
    }
    render() {
        let inputProps =
        {
            readOnly: this.props.readOnly,
            name: this.props.name,
            placeholder: this.props.placeholder || "",
            className: "wasabi-input  ",
            title: this.props.title,
            required: this.props.required,
        }//文本框的属性

        return <div className="combobox"    >
            {/* 暂时不处理 */}
            <i className={"combobox-clear icon-clear"} onClick={this.onClear.bind(this)} style={{ display: this.props.readOnly ? "none" : (this.state.value == "" || !this.state.value) ? "none" : "inline" }}></i>
            <i className={"comboxbox-icon icon-caret-down " + (this.state.show ? "rotate" : "")} onClick={this.showPicker.bind(this)}></i>
            <input type="text" {...inputProps} value={this.state.text} onBlur={this.props.onBlur} onClick={this.showPicker.bind(this)} onChange={() => { }} autoComplete="off" />
            <div className={"dropcontainter gridpicker  "} style={{ height: this.props.height, display: this.state.show == true ? "block" : "none" }}  >
                <DataGrid
                    grid={this.gird}
                    priKey={this.props.valueField}
                    headers={this.props.headers}
                    data={this.props.data}
                    onUpdate={this.onUpdate}
                    pagination={this.props.pagination || false}
                    rowNumber={true}
                    exportAble={false}
                    selectAble={true}
                    singleSelect={this.props.singleSelect || false}
                    onChecked={this.onSelect}
                ></DataGrid>
            </div>
        </div>

    }
}
GridPicker.propTypes = props;
GridPicker.defaultProps = { type: "gridpicker" }

export default validateHoc(loadDataHoc(GridPicker, "gridpicker", "gridpicker"));