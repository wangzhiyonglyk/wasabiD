/**
 * Created by zhiyongwang on 2020-11-06
 * 添加类型按钮的筛选框
 * 
 */
import React from "react";
import Button from "../../Buttons/Button"
import loadDataHoc from "../../loadDataHoc";
import validateHoc from "../validateHoc";
import func from "../../libs/func";
import propsTran from "../../libs/propsTran";
import Msg from "../../Info/Msg";

function LiView(props) {
    let control = null;
    let { data, value = "", readOnly, onSelect } = props;
    const isChecked = (child) => {
        if ((("," + value.toString() + ",").indexOf("," + (child.value ?? "") + ",") > -1)) {
            checked = true;
        }
        return checked;
    }
    if (data && data instanceof Array && data.length > 0) {
        control = data.map((child, index) => {
            let checked = isChecked(child);
            return <Button key={index} className={child.className} style={child.style} theme={checked ? this.props.theme || "primary" : "default"}
                onClick={readOnly ? () => { } : onSelect.bind(this, (child.value ?? ""), child.text, child)}
            >{child.text}</Button>
        });
    }
    return control;
}
class CheckButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            value: "",
            oldPropsValue: null,//保存初始化的值
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
    onSelect(value = "", text, row) {//选中事件

        if (this.props.readOnly) {
            return;
        }
        if (value !== null && value !== undefined && value !== "") {//0是有效值
            let newValue = this.state.value.toString() || ""
            let newText = this.state.text.toString() || "";
            newValue = newValue ? newValue.split(",") : [];
            newText = newText ? newText.split(",") : [];
            if (newValue.indexOf(value.toString()) > -1) {
                newValue.splice(newValue.indexOf(value.toString()), 1);
                try {
                    newText.splice(newText.indexOf(text.toString()), 1);
                }
                catch (e) {

                }

            }
            else {
                newValue.push(value + "");
                newText.push(text + "");
            }
            this.setState({
                value: newValue.join(","),
                text: newText.join(",")
            })
            this.props.validate && this.props.validate(newValue.join(","));
            this.props.onSelect && this.props.onSelect(newValue.join(","), newText.join(","), this.props.name, row);
        } else {
            Msg.info("值是空值");
        }


    }
    shouldComponentUpdate(nextProps, nextState) {
        if (func.diff(nextProps, this.props, false)) {
            return true;
        }
        if (func.diff(nextState, this.state)) {
            return true;
        }
        return false;
    }

    render() {
        const { data, half, readOnly } = this.props;
        const liprops = { data, value, half, readOnly, value: this.state.value, onSelect: this.onSelect };
        return <ul className="wasabi-checkul" style={{ marginTop: 6 }}><LiView {...liprops}></LiView> {this.props.children} </ul>
    }
}
export default validateHoc(loadDataHoc(CheckButton, "checkbox"), "checkbox");
