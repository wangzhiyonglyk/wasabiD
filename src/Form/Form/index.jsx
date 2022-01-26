//create by wangzhiyong
//date:2016-04-05后开始独立改造
//edit date:2020-04-05
//edit date:2021-02 修复bug
//desc:表单组件
import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "../../Buttons/Button";
import propsTran from "../../libs/propsTran"
import func from "../../libs/func"
import "./form.css"
class Form extends Component {
    constructor(props) {
        super(props)
        this.inputs = [];//ref
        this.state = {
            disabled: this.props.disabled,
            rawDisabled: this.props.disabled
        }
        this.validate = this.validate.bind(this);
        this.getData = this.getData.bind(this);
        this.setData = this.setData.bind(this);
        this.clearData = this.clearData.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getRefs = this.getRefs.bind(this);
        this.computerLabelWidth = this.computerLabelWidth.bind(this)
    }

    static getDerivedStateFromProps(props, state) {
        if (props.disabled !==state.rawDisabled) {
            return {
                rawDisabled: props.disabled,
                disabled: props.disabled,
            }
        }
        return null;

    }
    /**
     * 合并两种refs引用方式
     * @returns 
     */
    getRefs() {
        let combinxRefs = [];//合并新旧语法
        for (let i = 0; i < this.inputs.length; i++) {
            let cref = this.inputs[i].current;
            if (cref) {
                combinxRefs.push(cref);
            }
        }
        for (let r in this.refs) {
            combinxRefs.push(this.refs[r]);
        }
        return combinxRefs;
    }
    /**
     * 验证
     * @returns 
     */
    validate() {
        let isva = true;
        let combinxRefs = this.getRefs();
        for (let i = 0; i < combinxRefs.length; i++) {
            let cref = combinxRefs[i];
            if (isva) {//如果验证是正确的，继续获取值
                isva = cref && cref.validate ? cref.validate() : isva;
            }
            else {//如果前一个验证失败，则验证不拿值
                cref && cref.validate ? cref.validate() : void (0);
            }

        }
        return isva;
    }
    /**
     * 获取值
     * @returns 
     */
    getData() {
        var data = {}
        let combinxRefs = this.getRefs();
        for (let i = 0; i < combinxRefs.length; i++) {
            let cref = combinxRefs[i];
            if (cref && cref.props.name && cref.getValue) {//说明是表单控件
                if (cref.props.name.indexOf(",") > -1) {//含有多个字段
                    var nameSplit = cref.props.name.split(",");
                    if (cref.getValue()) {
                        var valueSplit = cref.getValue().split(",");
                        for (let index = 0; index < nameSplit.length; index++) {
                            if (index < valueSplit.length) {
                                data[nameSplit[index]] = valueSplit[index];
                            }
                        }

                    }
                    else {
                        for (let index = 0; index < nameSplit.length; index++) {
                            data[nameSplit[index]] = "";
                        }
                    }
                }
                else {
                    data[cref.props.name] = cref.getValue();
                }
            }
            else if (cref.getData) {//布局组件或者表单组件
                data = Object.assign({}, data, cref.getData())
            }


        }
        return data;
    }
    /**
     * 设置值
     * @param {*} data 
     * @returns 
     */
    setData(data) {//设置值,data是对象

        if (!data) {
            return;
        }
        let combinxRefs = this.getRefs();
        for (let i = 0; i < combinxRefs.length; i++) {
            let cref = combinxRefs[i];
            if (cref && cref.props.name && data[cref.props.name] !==null && data[cref.props.name] !==undefined) {
                cref.setValue && cref.setValue(data[cref.props.name]);
            }
            else if (cref && cref.setData) {//表单或者布局组件
                cref.setData(data);
            }
        }
    }
    /**
     * 清除数据
     */
    clearData() {
        let combinxRefs = this.getRefs();
        for (let i = 0; i < combinxRefs.length; i++) {
            let cref = combinxRefs[i];
            cref && cref.setValue && cref.setValue("");
            cref && cref.clearData && cref.clearData();
        }
    }
    onSubmit() {
        //提交 数据
        var data = {};//各个字段对应的值
        let isva = true;
        let combinxRefs = this.getRefs();
        for (let i = 0; i < combinxRefs.length; i++) {
            let cref = combinxRefs[i];
            if (cref) {
                //如果没有验证方法说明不是表单控件，保留原来的值
                if (isva) {//如果验证是正确的，继续获取值
                    isva = cref.validate ? cref.validate() : isva;
                }
                else {//如果前一个验证失败，则验证不拿值
                    cref.validate ? cref.validate() : void (0);
                }

                if (cref.props.name && cref.getValue) {//说明是表单控件

                    if (cref.props.name.indexOf(",") > -1) {//含有多个字段
                        var nameSplit = cref.props.name.split(",");
                        let value = cref.getValue();
                        if (value) {
                            var valueSplit = value.split(",");
                            for (let index = 0; index < valueSplit.length; index++)//有可能分离的值比字段少
                            {
                                if (index < valueSplit.length) {
                                    data[nameSplit[index]] = valueSplit[index];

                                }
                            }

                        }
                        else {
                            for (let index = 0; index < nameSplit.length; index++) {
                                data[nameSplit[index]] = "";

                            }
                        }
                    }
                    else {
                        data[cref.props.name] = cref.getValue();
                    }
                } else if (cref.getData) {//布局组件或者表单组件
                    data = Object.assign(data, cref.getData())
                }
            }

        }
        if (isva) {
            if (this.props.onSubmit) {//如果没有提交事件
                this.props.onSubmit(data);
            }
            else {
                return data;
            }

        }
    }
    setDisabled(disabled) {
        this.setState({
            disabled: !!disabled
        })
    }
    /**
     * 得到表单中标签的最大宽度，方便对齐
     */
    computerLabelWidth() {
        let maxWidth = 0;//得到最大宽度
        React.Children.map(this.props.children, (child, index) => {

            if (child && child.props && child.props.label) {
                let labelStyle = func.clone(child.labelStyle) || {};
                if (labelStyle && labelStyle.width) {
                    //如果设置宽度，则不参与计算
                } else {
                    let width = func.charWidth(child.props.label);
                    maxWidth = maxWidth < width ? width : maxWidth;
                    maxWidth = maxWidth > 160 ? 165 : maxWidth;//超过160就不管了，否则很难看
                    maxWidth = maxWidth <= 40 ? 60 : maxWidth;
                }

            }
        })
        return maxWidth;
    }
    render() {
        this.inputs = [];//先清空
        let maxWidth = this.computerLabelWidth();
        return (
            <div className={"wasabi-form  clearfix " + (this.props.className || "")} style={this.props.style}>
                <div className={"form-body clearfix "} cols={this.props.cols}>
                    {
                        React.Children.map(this.props.children, (child, index) => {
                            if (child) {
                                if (typeof child.type !== "function") {//非react组件
                                    return child;
                                } else {
                                    //这里有个问题，value与text在第二次会被清除,防止数据丢失
                                    let data = child.props.data
                                        ? JSON.parse(JSON.stringify(child.props.data))
                                        : null;
                                    //统一处理标签样式问题，方便对齐
                                    let labelStyle = propsTran.handlerLabelStyle(child.labelStyle, maxWidth);
                                    let ref = child.ref ? child.ref : React.createRef();
                                    typeof ref === "object" ? this.inputs.push(ref) : void (0);//如果对象型添加，字符型（旧语法）事后通过refs来获取
                                    return React.cloneElement(child,
                                        {
                                            data: data,
                                            labelStyle: labelStyle,
                                            disabled: this.props.disabled,
                                            readOnly: this.state.disabled ? this.state.disabled : child.props.readOnly,
                                            key: index, ref: ref
                                        })
                                }
                            }
                            else {
                                return null;
                            }


                        })
                    }
                </div>
                <div className="form-submit clearfix" style={{ display: this.props.submitHide ? "none" : null }}  >
                    <Button theme={this.props.submitTheme} onClick={this.onSubmit} title={this.props.submitTitle} style={{ display: this.props.submitHide ? "none" : null }} disabled={this.props.disabled}  >
                    </Button>

                </div>
            </div>
        )
    }
}
Form.propTypes = {
    style: PropTypes.object,//样式
    className: PropTypes.string,//自定义样式
    disabled: PropTypes.bool,//是否只读
    submitTitle: PropTypes.string,
    submitHide: PropTypes.bool,
    submitTheme: PropTypes.string,
    onSubmit: PropTypes.func,//提交成功后的回调事件
    cols: PropTypes.number//一行几列
};
Form.defaultProps = {
    submitTitle: "提交",//查询按钮的标题
    submitHide: true,//是否隐藏按钮
    submitTheme: "primary",//主题
    cols: 3,//默认3个
};
export default Form;