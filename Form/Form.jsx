//create by wangzy
//date:2016-04-05后开始独立改造
//desc:表单组件
require("../Sass/Form/Form.scss");
var React = require("react");
var Input = require("./Input.jsx");
var Button = require("../Buttons/Button.jsx");
var unit = require("../libs/unit.js");
var Form = React.createClass({
    propTypes: {
        style: React.PropTypes.object,//样式
        className: React.PropTypes.string,//自定义样式
        disabled: React.PropTypes.bool,//是否只读
        submitTitle: React.PropTypes.string,
        submitHide: React.PropTypes.bool,
        submitTheme: React.PropTypes.string,
        onSubmit: React.PropTypes.func,//提交成功后的回调事件
    },
    getDefaultProps: function () {
        return {
            style: {},
            className: "",
            disabled: false,
            submitTitle: "提交",//查询按钮的标题
            submitHide: false,//是否隐藏按钮
            submitTheme: "primary",//主题
            onSubmit: null,//提交成功后的回调事 


        }
    },
    getInitialState: function () {
        return {
            disabled: this.props.disabled,//是否只读
        }
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            disabled: nextProps.disabled,
        })
    },
    validate: function () {
        let isva = true;
        for (let v in this.refs) {
            //如果没有验证方法说明不是表单控件，保留原来的值
            isva = this.refs[v].validate ? this.refs[v].validate() : isva;
        }
        return isva;
    },
    getData: function () {
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
    },

    setData: function (data) {//设置值,data是对象

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
    },

    clearData: function () {
        for (let v in this.refs) {
          this.refs[v].setValue && this.refs[v].setValue("");
            this.refs[v].clearData && this.refs[v].clearData();
        }
    },
    

    onSubmit: function () {
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

        if (isva) {

            if (this.props.onSubmit != null) {
                this.props.onSubmit(data);
            }
            else {
                return data;
            }

        }
    },

    setDisabled: function (disabled) {
        this.setState({
            disabled: disabled//等于刷新了
        })
    },
    render: function () {
        return (
            <div className={"wasabi-form  clearfix " + " " + this.props.className} style={this.props.style}>
                <div className={"form-body clearfix "}>

                    {
                        React.Children.map(this.props.children, (child, index) => {

                           
                            if (typeof child.type !== "function") {//非react组件
                                return child;
                            } else {
                                return React.cloneElement(child, { readonly: this.state.disabled, key: index, ref: child.ref?child.ref:index })
                            }

                        })
                    }
                </div>
                <div className="form-submit clearfix" style={{ display: (this.props.onSubmit ? "block" : "none") }}>
                    <Button theme={this.props.submitTheme} onClick={this.onSubmit} title={this.props.submitTitle} hide={this.props.submitHide} disabled={this.state.disabled}  >
                    </Button>

                </div>
            </div>
        )
    }
});
module.exports = Form;