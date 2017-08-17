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
        onSubmit: React.PropTypes.func,
        expandHandler: React.PropTypes.func,

    },
    getDefaultProps: function () {
        return {
            style:{},
            className: "",
            submitTitle: "查询",//查询按钮的标题
            submitHide: false,//是否隐藏按钮
            submitTheme:"primary",//主题
            onSubmit: null,//提交成功后的回调事 
            expandHandler: null,//展开与折叠事件
           
        }

    },
    getInitialState: function () {
        //初始化时就获取可用宽度,如果每次更新获取,会产生晃动
        if (window.screen.availWidth < document.documentElement.clientWidth) {//屏幕可用宽度小,有滚动条
            this.availWidth = window.screen.availWidth - 50;
        }
        else {
            //没有滚动条  现在每个页面留有左右20像素的边距
            this.availWidth = window.screen.availWidth - 40;//防止后期出现滚动条,而产生样式变形,先减去滚动条宽度
        }
        return {
            dropType: "wasabi-button wasabi-searchbar-down",//折叠按钮样式
            columns: this.props.columns,
        }
    },
    componentWillReceiveProps: function (nextProps) {
        //屏幕可用宽度,
        this.setState({
            style: nextProps.style,
            className: nextProps.className,

        });

    },
    getData: function () {
        var data = {}
        for (let v in this.refs) {      
            if (this.refs[v].props.name&&this.refs[v].getValue) {//说明是表单控件
                if (this.refs[v].props.name.indexOf(",") > -1) {//含有多个字段
                    var nameSplit = this.refs[v].props.name.split(",");
                    if (this.refs[v].state.value && this.refs[v].state.value != "") {
                        var valueSplit = this.refs[v].state.value.split(",");
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


        }
        return data;
    },

    setData: function (data) {//设置值,data是对象

        if (!data) {
            return;
        }
        for (let v in this.refs) {
            if (data[this.refs[v].props.name]) {
                this.refs[v].setValue&&this.refs[v].setValue(data[this.refs[v].props.name]);
            }
        }
    },
    clearData: function () {
        for (let v in this.refs) {
            this.refs[v].setValue && this.refs[v].setValue("");
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

    expandHandler: function () {
        var expand = false;
        if (this.state.dropType == "wasabi-button wasabi-searchbar-down") {
            this.setState({
                dropType: "wasabi-button wasabi-searchbar-up"

            });
            expand = true;
        }
        else {
            this.setState({
                dropType: "wasabi-button wasabi-searchbar-down"
            });
        }
        if (this.props.expandHandler != null) {
            this.props.expandHandler(expand);
        }
    },
    setColumns: function () {//计算列数及样式 TODO 此处要重新设计
        var style = {};//表单栏样式
        if (this.props.style) {
            style = this.props.style;
        }
        //表单实际宽度
        let actualWidth =  style.width ? style.width : this.availWidth;//总宽度
        let leftWidth = actualWidth - 130;//左侧表单宽度
        let columnClass = "";//列样式
        let columns = 0;//每一行的列数
        if (this.state.columns) {//如果自定义了,则以自定义为标准
            columns = this.state.columns;
        }
        else {//否则自动计算
            if (leftWidth <= 610) {//一列
                columns = 1;
            }
            else if (leftWidth >= 611 && leftWidth <= 909) {//两列
                columns = 2;
            }
            else if (leftWidth >= 910 && leftWidth <= 1229) {//三列
                columns = 3;
            }
            else if (leftWidth >= 1230) {//四列
                columns = 4;
            }
        }
        if ((this.props.children.length) < columns) {//如果数据小于列数,否则查询按钮会位置发生改变
            columns = this.props.children.length;
            if (columns == 1) {//如果只有两列的话,重新定义宽度
                actualWidth = 400;
            }
            else if (columns == 2) {
                actualWidth = 700;
            }
            else if (columns == 3) {
                actualWidth = 1024;
            }
            leftWidth = actualWidth - 130;
        }
        //最后根据实际情况再处理
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
        style.width = style.width ? style.width : actualWidth;//设置表单的宽度
        this.state.dropType == "wasabi-button wasabi-searchbar-down" ? style.height = 54 : style.height = null;//判断高度
        let result = {
            style: style,
            columns: columns,
            columnClass: columnClass,
            leftWidth: leftWidth
        }
        return result;
    },
    render: function () {
        var result = this.setColumns();//得计算列的结果
        let props = {
            className: "wasabi-searchbar clearfix " + result.columnClass + " " + this.props.className,
            style: result.style
        };
        let orderIndex = 0;//表单组件在表单的序号,
        return (
            <div {...props}>
                <div className="leftform" style={{ width: result.leftWidth }}  >
                    {
                        React.Children.map(this.props.children, (child, index) => {
                            return React.cloneElement(child, { key: index, ref: index })
                        })
                    }
                </div>
                <div className="rightbutton" style={{ display: this.props.submitHide == true ? "none" : this.props.onSubmit ? null : "none" }} >
                    <button className={this.state.dropType} style={{ float: "left", display: (result.columns < (this.props.children.length)) ? "inline" : "none" }} onClick={this.expandHandler}  ></button>
                    <Button onClick={this.onSubmit.bind(this, "submit")} theme={this.props.submitTheme} style={{ float: "right", marginTop: ((result.columns < this.props.children.length) ? -22 : 0), display: this.props.submitHide == true ? "none" : null }} title={this.props.submitTitle}   >
                    </Button>
                </div>

            </div>
        )
    }
});
module.exports = SearchBar;
