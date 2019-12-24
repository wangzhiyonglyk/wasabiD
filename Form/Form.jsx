//create by wangzy
//date:2016-04-05后开始独立改造
//desc:表单组件
import React, {Component} from "react";
import PropTypes from "prop-types";

import  Button  from "../Buttons/Button.jsx";

import ("../Sass/Form/Form.css");
class   Form extends Component {
    constructor(props){
        super(props)
        this.state={
           
        }
this.validate=this.validate.bind(this);
this.getData=this.getData.bind(this);
this.setData=this.setData.bind(this);
this.clearData=this.clearData.bind(this);
this.onSubmit=this.onSubmit.bind(this);
    }
  
    componentWillReceiveProps (nextProps) {
        this.setState({
            disabled: nextProps.disabled,
        })
    }
    validate () {
        let isva = true;
        for (let v in this.refs) {
            //如果没有验证方法说明不是表单控件，保留原来的值
            isva = this.refs[v].validate ? this.refs[v].validate() : isva;
        }
        return isva;
    }
    getData () {
        var data = {}
        for (let v in this.refs) {      
            if (this.refs[v].props.name&&this.refs[v].getValue) {//说明是表单控件
                if (this.refs[v].props.name.indexOf(",") > -1) {//含有多个字段
                    var nameSplit = this.refs[v].props.name.split(",");
                    if (this.refs[v].getValue()) {
                        var valueSplit = this.refs[v].getValue().split(",");
                        for (let index = 0; index < nameSplit.length; index++) {
                            if (index < valueSplit.length) {
                                data[nameSplit[index]] = valueSplit[index];
                            }
                        }

                    }
                    else {
                        for (let index = 0; index < nameSplit.length; index++) {
                            data[nameSplit[index]] = null;
                        }
                    }
                }
                else {
                    data[this.refs[v].props.name] = this.refs[v].getValue();
                }
            }
            else if(this.refs[v].getData){//布局组件或者表单组件
                data=Object.assign(data,this.refs[v].getData())
            } 


        }
        return data;
    }
    setData (data) {//设置值,data是对象

        if (!data) {
            return;
        }
        for (let v in this.refs) {
            if (this.refs[v].props.name&&data[this.refs[v].props.name]) {
                this.refs[v].setValue&&this.refs[v].setValue(data[this.refs[v].props.name]);
            }
            else if(this.refs[v].setData)
                {//表单或者布局组件
                    this.refs[v].setData(data);
                }
        }
    }
    clearData () {
        for (let v in this.refs) {
          this.refs[v].setValue && this.refs[v].setValue("");
            this.refs[v].clearData && this.refs[v].clearData();
        }
    }

    onSubmit () {
        //提交 数据
        var data = {};//各个字段对应的值
        let isva = true;
        for (let v in this.refs) {
            //如果没有验证方法说明不是表单控件，保留原来的值
            isva = this.refs[v].validate ? this.refs[v].validate(this.refs[v].getValue()) : isva;
            if (this.refs[v].props.name && this.refs[v].getValue) {//说明是表单控件
                if (this.refs[v].props.name.indexOf(",") > -1) {//含有多个字段
                    var nameSplit = this.refs[v].props.name.split(",");
                    let value = this.refs[v].getValue();
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
                            data[nameSplit[index]] = null;

                        }
                    }
                }
                else {
                    data[this.refs[v].props.name] = this.refs[v].getValue();
                }
            }
        }
console.log(isva);
        if (isva) {
console.log(this.props);
            if (this.props.onSubmit ) {
                this.props.onSubmit(data);
            }
            else {
                return data;
            }

        }
    }
    render() {
        return (
            <div className={"wasabi-form  clearfix " + " " + this.props.className} style={this.props.style}>
                <div className={"form-body clearfix "}>

                    {
                      React.  Children.map(this.props.children, (child, index) => {

                           
                            if (typeof child.type !== "function") {//非react组件
                                return child;
                            } else {
                                return React. cloneElement(child, { readonly: this.props.disabled, key: index, ref: child.ref?child.ref:index })
                            }

                        })
                    }
                </div>
                <div className="form-submit clearfix" >
                    <Button theme={this.props.submitTheme} onClick={this.onSubmit} title={this.props.submitTitle} hide={this.props.submitHide} disabled={this.props.disabled}  >
                    </Button>

                </div>
            </div>
        )
    }
}

Form. propTypes= {
    style: PropTypes.object,//样式
    className: PropTypes.string,//自定义样式
    disabled: PropTypes.bool,//是否只读
    submitTitle: PropTypes.string,
    submitHide: PropTypes.bool,
    submitTheme: PropTypes.string,
    onSubmit: PropTypes.func,//提交成功后的回调事件
};
Form.defaultProps= {
        style: {},
        className: "",
        disabled: false,
        submitTitle: "提交",//查询按钮的标题
        submitHide: false,//是否隐藏按钮
        submitTheme: "primary",//主题
        onSubmit: null,//提交成功后的回调事 
    };
export default Form;