//create by wangzy
//date:2016-04-05后开始独立改造
//desc:页面筛选条件组件
require("../Sass/Form/SearchBar.scss");
var React = require("react");
var Input = require("./Input.jsx");
var Button = require("../Buttons/Button.jsx");
var unit = require("../libs/unit.js");
var SearchBar = React.createClass({
    propTypes: {
          style: React.PropTypes.object,//样式
        className: React.PropTypes.string,//自定义样式
        submitTitle: React.PropTypes.string,
        submitHide: React.PropTypes.bool,
        submitTheme:React.PropTypes.string,
        submitStyle:React.PropTypes.object,
        onSubmit: React.PropTypes.func,

    },
    getDefaultProps: function () {
        return {
            style:{},
            className: "",
            submitTitle: "查询",//查询按钮的标题
            submitHide: false,//是否隐藏按钮
            submitTheme:"primary",//主题
            submitStyle:{},//查询按钮的样式
            onSubmit: null,//提交成功后的回调事           
        }

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
        for (let v in this.refs) {      
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
            if (this.props.onSubmit != null) {
                this.props.onSubmit(data);
            }
            else {
                return data;
            }      
    }, 
    render: function () {
    
     return (
            <div  ref="searchbar" className={"wasabi-searchbar clearfix" + this.props.className} style={this.props.style}  >
                <div className=" col-xs-9"  ref="form" >
                    {
                        React.Children.map(this.props.children, (child, index) => {
                            if (typeof child.type !== "function") {//非react组件
                                return child;
                            } else {
                            return React.cloneElement(child, { key: index, ref: index })
                            }
                        })
                    }
                </div>
                <div className=" col-xs-3" style={{ display: this.props.submitHide == true ? "none" : this.props.onSubmit ? null : "none" }} >
            
                    <Button onClick={this.onSubmit.bind(this, "submit")} theme={this.props.submitTheme} style={this.props.submitStyle} title={this.props.submitTitle}   >
                    </Button>
                </div>

            </div>
        )
    }
});
module.exports = SearchBar;
