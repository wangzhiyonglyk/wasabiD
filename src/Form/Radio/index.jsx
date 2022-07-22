/**
 * Created by zhiyongwang
 * date:2016-04-05后开始独立改造
 * 单选框集合组件
 */
import React, { Component } from "react";
import loadDataHoc from "../../loadDataHoc";
import validateHoc from "../validateHoc";
import propsTran from "../../libs/propsTran"
import "./radio.css";
import Msg from "../../Info/Msg";

function LiView(props) {
    let control = null;
    let { data, value = "", readOnly, onSelect } = props;
    if (data && data instanceof Array && data.length > 0) {
        let className = "wasabi-radio-btn " + (readOnly ? " readOnly" : "");
        control = data.map((child, index) => {
            return (
                <li key={index}>
                    <div className={className + ((value + "") === ((child.value ?? "") + "") ? " checkedRadio" : "")}
                        onClick={onSelect.bind(this, child.value, child.text, child)}><i></i></div>
                    <div className={"radiotext " + (readOnly ? " readOnly" : "") + (((value + "") === ((child.value??"") + "")) ? " checkedRadio" : "")} onClick={onSelect.bind(this, child.value, child.text, child)}>{child.text}
                    </div>
                </li>
            );
        })
    }
    return control;
}
class Radio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            value: "",
            oldPropsValue: "",//保存初始化的值
        }
        this.setValue = this.setValue.bind(this);
        this.getValue = this.getValue.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onSelect = this.onSelect.bind(this);

    }
    static getDerivedStateFromProps(props, state) {
        if (props.value !== state.oldPropsValue) {//父组件强行更新了            
            return {
                value: props.value || "",
                text: propsTran.processText(props.value, props.data).join(","),
                oldPropsValue: props.value
            }
        }
        return null;
    }
    setValue(value) {
        this.setState({
            value: value,
            text: propsTran.processText(value, this.props.data).join(",")
        })
        this.props.validate && this.props.validate(value);
    }
    getValue() {
        return this.state.value;
    }
    onClear() {
        this.setState({
            value: "",
            text: "",
        })
        this.props.onSelect && this.props.onSelect("", "", this.props.name, {});
    }

    onSelect(value = "", text, name, row) {

        if (this.props.readOnly) {
            return;
        }
        if (value !== "") {//0是有效值
            //更新
            this.setState({
                value: value + "",
                text: text + "",
            })
            this.props.validate && this.props.validate(value + "");
            this.props.onSelect && this.props.onSelect(value + "", text, name, row);
        }
        else {
            Msg.info("值是空值");
        }

    }
    render() {
        const { data, readOnly } = this.props;
        const liProps = { data, readOnly, value: this.state.value, onSelect: this.onSelect }
        return <ul className="wasabi-checkul"> <LiView {...liProps} onSelect={this.onSelect.bind(this)}></LiView> {this.props.children}</ul>
    }
}

export default validateHoc(loadDataHoc(Radio, "radio"), "radio");