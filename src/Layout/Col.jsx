/**
 * crate by wangzhyong
 * date:2017-08-20
 * desc 列
 */
import React from 'react';
import PropTypes from "prop-types";

class Col extends React.PureComponent {
    constructor(props) {
        super(props);
        this.inputs = [];//ref
        this.validate = this.validate.bind(this);
        this.getData = this.getData.bind(this);
        this.setData = this.setData.bind(this);
        this.clearData = this.clearData.bind(this);
        this.getRefs = this.getRefs.bind(this);
    }
    static propTypes = {
        size:PropTypes.oneOf(["","fluid","xxl","xl","lg","md","sm"]),
        cols: PropTypes.number,
        style: PropTypes.object,
        className: PropTypes.string,
    }
    static defaultProps = {
        size:"",
        cols: 3,//默认3列
        style: {},
        className: ""
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
    clearData() {
        let combinxRefs = this.getRefs();
        for (let i = 0; i < combinxRefs.length; i++) {
            let cref = combinxRefs[i];
            cref && cref.setValue && cref.setValue("");
            cref && cref.clearData && cref.clearData();
        }
    }
    render() {
        this.inputs = [];//先清空
        return <div className={"col"+(this.props.size?"-"+this.props.size:"") + ("-"+(this.props.cols || "3")) + " wasabi-cols " + (this.props.className || "")} style={this.props.style}>{
            React.Children.map(this.props.children, (child, index) => {
                if(child){
                    if (typeof child.type !== "function") {//非react组件
                        return child;
                    } else {
                        let ref = child.ref ? child.ref : React.createRef();
                        typeof ref === "object" ? this.inputs.push(ref) : void (0);//如果对象型添加，字符型（旧语法）事后通过refs来获取
                        return React.cloneElement(child,
                            {
                                disabled:this.props.disabled,
                                readOnly: this.props.disabled ? this.props.disabled : child.props.readOnly,
                                key: index, ref: ref
                            })
                    }
                }
               
            })}</div>;
    }
}

export default Col;
