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
        model: React.PropTypes.array.isRequired,//表单数据模型
        width: React.PropTypes.number,///宽度
        height: React.PropTypes.number,//高度
        className: React.PropTypes.string,//自定义样式
        disabled: React.PropTypes.bool,//是否只读
        submitTitle: React.PropTypes.string,//提交按钮标题
        submitHide: React.PropTypes.bool,//提交按钮是否隐藏
        onSubmit: React.PropTypes.func,//提交成功后的回调事件    
        submitTheme: React.PropTypes.oneOf([//提交按钮默认主题
            "primary",
                "default",
                "success",
                "info",
                "warning",
                "danger",
                "cancel"
        ]),
        columns: React.PropTypes.oneOf([//表单的列数，为none则系统不自动排版，为null则系统自动排版，为数字则指定列数
            "none",//不处理
            1,
            2,
            3,
            4
        ]),
    },
    getDefaultProps: function () {
        return {
            model: [],//表单数据模型
            width: null,//默认宽度
            height: null,//高度
            className: "",//自定义样式
            disabled: false,//是否只读
            submitTitle: "提交",//提交按钮标题         
            submitHide: false,//提交按钮是否隐        
            onSubmit: null,//提交成功后的回调事件
            submitTheme: "primary",//提交按钮默认主题          
            columns: null,//null系统自行处理列数
        }

    },
    getInitialState: function () {
        //初始化时就获取可用宽度,如果每次更新获取,会产生晃动
        if (window.screen.availWidth < document.documentElement.clientWidth) {//屏幕可用宽度小,有滚动条
            this.availWidth = window.screen.availWidth;
        }
        else {
            //没有滚动条
            this.availWidth = window.screen.availWidth - 10;//防止后期出现滚动条,而产生样式变形,先减去滚动条宽度
        }
        return {
            model: (this.props.model instanceof Array) ? this.props.model : [],
            pickerRowModel: new Map(),//下拉框中选中的完整数据
            disabled: this.props.disabled,//是否只读
            columns: this.props.columns,//自定义列数

        }
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            model: (nextProps.model instanceof Array) ? nextProps.model : [],
            disabled: nextProps.disabled,
            columns: nextProps.columns,
        })
    },

    getData: function () {//获取当前表单的数据，没有验证
        var data = {};
        for (let v in this.refs) {
            if (this.refs[v].props.name && this.refs[v].getValue) {
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
            return data;
        }
    },
    setData: function (data) {//设置值,data是对象
      
        if (!data) {
            return;
        }
        for (let v in this.refs) {
            if (data[ this.refs[v].props.name]) {
                this.refs[v].setValue(data[this.refs[v].props.name]);
            }
        }
    },
     clearData: function () {
        for (let v in this.refs) {
            for (let v in this.refs) {
                if (data[this.refs[v].props.name]) {
                    this.refs[v].setValue("");
                }
            }
        }
    },
    validate: function () {
        let isva = true;
        for (let v in this.refs) {
            isva = this.refs[v].validate ? this.refs[v].validate(this.refs[v].getValue()) : isva;
        }
        return isva;
    },
    
    onSubmit: function () {
        //提交 数据
        var data = {};//各个字段对应的值
        let isva = true;
        for (let v in this.refs) {
            isva = this.refs[v].validate ? this.refs[v].validate(this.refs[v].getValue()) : isva;
            if (this.refs[v].props.name && this.refs[v].getValue) {
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
                this.props.onSubmit(data, textData);
            }

        }
    },

    setColumns: function () {//计算列数及样式
        var style = {};//表单栏样式
        if (this.props.style) {
            style = this.props.style;
        }

        let columns = 0;//每一行的列数

        //表单实际宽度
        let actualWidth = this.props.width ? this.props.width : this.availWidth;//总宽度
        let columnClass = "";//列排版样式
        if (this.state.columns) {//如果自定义了,则以自定义为标准
            columns = this.state.columns;
        }
        else if (!this.state.columns) {//没设置，则自动计算
            if (actualWidth <= 610) {//一列
                columns = 1;

            }
            else if (actualWidth >= 611 && actualWidth <= 909) {//两列
                columns = 2;

            }
            else if (actualWidth >= 910 && actualWidth <= 1229) {//三列
                columns = 3;

            }
            else if (actualWidth >= 1230) {//四列
                columns = 4;

            }
        }
        else {//不处理

        }   
        if (columns > 0) {//需要处理列的排版
            switch (columns) {
                case 1:
                    columnClass = "oneline";
                    break;
                case 2:
                    columnClass = "twoline";
                    break;
                case 3:
                    columnClass = "threeline";
                    break;
                case 4:
                    columnClass = "fourline";
                    break;
            }
        }
        style.width = actualWidth;//设置表单的宽度
        style.height = this.props.height;//设置表单的高度

        let result = {
            style: style,
            columns: columns,
            columnClass: columnClass
        }
        return result;
    },
    render: function () {
        let result = this.setColumns();//得计算列的结果
        let formSubmitVisible = true;//按钮行是否可见
        if (this.state.disabled || (this.props.submitHide)||!this.props.onSubmit) {
            formSubmitVisible = false;
        }
        else {

        }
        let orderIndex = 0;//表单组件在表单的序号
        return (
            <div className={"wasabi-form  clearfix " + result.columnClass + " " + this.props.className} style={result.style}>
                <div className={"form-body  "}>
                    {
                        this.state.model.map((child, index) => {
                            var size = child.size;//列的大小
                            if (result.columns) {//需要计算列的大小
                                if (child.hide == true) {//如果隐藏的话，不计算序号
                                }
                                else {
                                    if (size == "one") {
                                        orderIndex++;
                                    }
                                    else if (size == "two") {
                                        if (result.columns == 1) {
                                            orderIndex++;//每行只有一列,算一列
                                        }
                                        else {
                                            orderIndex += 2;//算两列
                                        }

                                    }
                                    else if (size == "three") {
                                        if (result.columns == 1 || result.columns == 2) {
                                            orderIndex++;//每行只有一列或者两列,算一列
                                        }
                                        else {
                                            orderIndex += 3;//算三列
                                        }

                                    }
                                    else if (size == "four" || size == "onlyline") {
                                        orderIndex += result.columns;
                                    }
                                }
                            }


                            return (
                                <Input ref={child.name}
                                    key={child.name + index.toString()}
                                    {...child}
                                    size={size}
                                    readonly={this.state.disabled == true ? true : child.readonly}
                                ></Input>
                            );
                        })

                    }
                    {
                        React.Children.map(this.props.children, (child, index) => {
                            return React.cloneElement(child, { key: index, ref: index })
                        })
                    }
                </div>
                <div className="form-submit" style={{ display: (formSubmitVisible == true ? "block" : "none") }}>
                    <Button theme={this.props.submitTheme} onClick={this.onSubmit} title={this.props.submitTitle} hide={this.state.disabled == true ? true : this.props.submitHide == true ? true : false}  >
                    </Button>

                </div>
            </div>
        )
    }
});
module.exports = Form;