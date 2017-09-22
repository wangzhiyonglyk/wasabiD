/**
 * Created by zhiyongwang
 * date:2016-04-05后开始独立改造
 * 下拉框
 */
require("../Sass/Form/Select.scss");
let React = require("react");
let unit = require("../libs/unit.js");
var FetchModel = require("../Model/FetchModel.js");
var validation = require("../Lang/validation.js");
var validate = require("../Mixins/validate.js");
var showUpdate = require("../Mixins/showUpdate.js");
var Label = require("../Unit/Label.jsx");
var Message = require("../Unit/Message.jsx");
var ClickAway = require("../Unit/ClickAway.js");
import props from "./config/props.js";
import defaultProps from  "./config/defaultProps.js";
let Select = React.createClass({
    mixins: [validate, showUpdate, ClickAway],
    PropTypes: props,
    getDefaultProps: function () {
        return defaultProps;
    },
    getInitialState: function () {
        var newData = [];
        var text = this.props.text;
        if (this.props.data && this.props.data instanceof Array) {
            for (let i = 0; i < this.props.data.length; i++) {
                let obj = this.props.data[i];
                obj.text = this.props.data[i][this.props.textField];
                obj.value = this.props.data[i][this.props.valueField];
                if (obj.value == this.props.value) {
                    text = obj.text;//根据value赋值
                }
                newData.push(obj);
            }
        }

        return {
            hide: this.props.hide,
            params: unit.clone(this.props.params),//参数
            data: newData,
            value: this.props.value,
            text: text,
            show: false,//是否显示下拉选项
            multiple: this.props.multiple,
            min: this.props.min,
            max: this.props.max,
            readonly: this.props.readonly,

            //验证
            required: this.props.required,
            validateClass: "",//验证的样式
            helpShow: "none",//提示信息是否显示
            helpTip: validation["required"],//提示信息
            invalidTip: "",
            filterValue: null,//筛选框的值
        }
    },
    componentWillReceiveProps: function (nextProps) {
        /*
         this.isChange :代表自身发生了改变,防止父组件没有绑定value,text,而导致无法选择
         */

        var value = this.isChange ? this.state.value : nextProps.value;
        var text = this.isChange ? this.state.text : nextProps.text;
        this.isChange = false;//重置
        var newData = null;
        if (nextProps.data != null && nextProps.data instanceof Array && (!nextProps.url || nextProps.url == "")) {//没有url,传的是死数据
            newData = [];
            //因为这里统一将数据进行了改造,所以这里要重新处理一下
            for (let i = 0; i < nextProps.data.length; i++) {
                let obj = nextProps.data[i];
                obj.text = nextProps.data[i][this.props.textField];
                obj.value = nextProps.data[i][this.props.valueField];
                if (obj.value == nextProps.value) {
                    text = obj.text;//根据value赋值
                }
                newData.push(obj);
            }

        }
        else {//url形式
            newData = this.state.data;//先得到以前的数据
            if (this.showUpdate(nextProps.params)) {//如果不相同则更新
                this.loadData(this.props.url, nextProps.params);//异步更新
            }
            else {

            }
        }

        this.setState({
            hide: nextProps.hide,
            value: value,
            text: text,
            data: newData,
            params: unit.clone(nextProps.params),
            multiple: nextProps.multiple,
            min: nextProps.min,
            max: nextProps.max,
            readonly: nextProps.readonly,
            required: nextProps.required,
            validateClass: "",//重置验证样式
            helpTip: validation["required"],//提示信息
            filterValue: null,
        })

    },
    componentWillMount: function () {//如果指定url,先查询数据再绑定
        this.loadData(this.props.url, this.state.params);//查询数据
    },
    componentDidMount: function () {

        this.registerClickAway(this.hideOptions, this.refs.select);//注册全局单击事件
    },
    componentDidUpdate: function () {
        if (this.isChange == true) {//说明已经改变了,回传给父组件
            if (this.props.onSelect != null) {
                this.props.onSelect(this.state.value, this.state.text, this.props.name, this.rowData);
            }
        }
    },

    setValue(value) {
        let text = "";
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].value == value) {
                text = this.state.data[i].text;
                break;
            }
        }
            this.setState({
                value: value,
                text: text
            })
        

    },
    getValue() {
        return this.state.value;

    },
    loadData: function (url, params) {
        if (url != null && url != "") {
            if (params == null) {
                var fetchmodel = new FetchModel(url, this.loadSuccess, null, this.loadError);
                unit.fetch.get(fetchmodel);
            }
            else {
                var fetchmodel = new FetchModel(url, this.loadSuccess, params, this.loadError);
                unit.fetch.post(fetchmodel);
            }
           
        }
    },
    loadSuccess: function (data) {//数据加载成功
        var realData = data;
        if (this.props.dataSource == null) {
        }
        else {
            realData = unit.getSource(data, this.props.dataSource);
        }
        var newData = [];
        var text = this.state.text;
        for (let i = 0; i < realData.length; i++) {
            let obj = realData[i];//将所有字段添加进来
            obj.text = realData[i][this.props.textField];
            obj.value = realData[i][this.props.valueField];
            if (obj.value == this.state.value) {
                text = obj.text;//根据value赋值
            }
            newData.push(obj);
        }
        if (this.props.extraData == null || this.props.extraData.length == 0) {
            //没有额外的数据
        }
        else {
            //有额外的数据
            for (let i = 0; i < this.props.extraData.length; i++) {
                let obj = {};
                obj.text = this.props.extraData[i][this.props.textField];
                obj.value = this.props.extraData[i][this.props.valueField];
                if (obj.value == this.state.value) {
                    text = obj.text;//根据value赋值
                }
                newData.unshift(obj);
            }
        }
        this.setState({
            data: newData,
            value: this.state.value,
            text: text,
        })
    },
    loadError: function (errorCode, message) {//查询失败
        console.log("select-error", errorCode, message);
        Message.error(message);
    },
    showOptions: function (type) {//显示下拉选项
       
        if (this.state.readonly) {
            return;
        }
        if (this.props.onClick != null) {
            this.props.onClick();
        }
        this.setState({
            show: type == 1 ? !this.state.show : true,
        });
        this.bindClickAway();//绑定全局单击事件
    },
    hideOptions: function (event) {
      
        this.setState({
            show: false
        });
        this.unbindClickAway();//卸载全局单击事件
    },

    onSelect: function (value, text, rowData) {//选中事件  
        if ((this.props.onBeforeSelect && value != this.state.value && this.props.onBeforeSelect(value, text, rowData)) || !this.props.onBeforeSelect) {//选择之前的确定事件返回true,或者没有

            this.isChange = true;//代表自身发生了改变,防止父组件没有绑定value,text的状态值,而导致无法选择的结果
            this.rowData = rowData;//临时保存起来
            var newvalue = "";
            var newtext = "";
            if (value == undefined) {
                console.error("绑定的valueField没有")
            }
            if (text == undefined) {
                console.error("绑定的textField没有");
            }
            if (this.state.multiple) {

                var oldvalue = [];
                var oldtext = [];
                if (this.state.value) {
                    oldvalue = this.state.value.toString().split(",");
                    oldtext = this.state.text.toString().split(",");
                }
                if (oldvalue.indexOf(value.toString()) > -1) {//取消选中
                    oldvalue.splice(oldvalue.indexOf(value.toString()), 1);
                    oldtext.splice(oldvalue.indexOf(value.toString()), 1);
                    newvalue = oldvalue.join(",");
                    newtext = oldtext.join(",");
                }
                else {//选中
                    if (this.state.value) {
                        newvalue = this.state.value + "," + value;
                        newtext = this.state.text + "," + text;
                    }
                    else {
                        newvalue = value;
                        newtext = text;
                    }

                }
                this.setState({
                    value: newvalue,
                    text: newtext,
                });
            }
            else {
                var newvalue = value;
                var newtext = text;
                this.setState({
                    show: false,
                    value: newvalue,
                    text: newtext,
                    filterValue: null,
                });
            }
            this.validate(newvalue);//
        }


    },
    getComponentData: function () {//只读属性，获取当前下拉的数据源
        return this.state.data;
    },
    onBlur: function () {

        this.refs.label.hideHelp();//隐藏帮助信息
    },

    keyUpHandler: function (event) {
        if (this.props.addAbled && event.keyCode == 13) {
            var filter = this.state.data.filter((item, index) => {
                return item.text == event.target.value;
            })
            if (filter.length == 0) {


                this.state.data.push({
                    value: event.target.value,
                    text: event.target.value,
                })
                this.setState({
                    data: this.state.data,
                })
                if (this.props.addHandler) {
                    this.props.addHandler(this.state.data);
                }
            }
            ;

        }
    },
    filterChangeHandler: function (event) {//筛选查询
        
        this.setState({
            filterValue: event.target.value,
            show: true,
        })
        this.refs.ul.scrollTop = 0;//回到顶部


    },
    clearHandler: function () {//清除数据
       
        this.setState({
            value: "",
            text: "",
        })
         this.props.onSelect&& this.props.onSelect("", "", this.props.name, null);      
    },
    render: function () {
    
        var componentClassName = "wasabi-form-group ";//组件的基本样式
        let inputProps =
            {
                readOnly: this.state.readonly == true ? "readonly" : null,
                style: this.props.style,
                name: this.props.name,
                placeholder: (this.props.placeholder === "" || this.props.placeholder == null) ? this.state.required ? "必填项" : "" : this.props.placeholder,
                className: "wasabi-form-control  " + (this.props.className != null ? this.props.className : ""),
                title: this.props.title,

            }//文本框的属性
        var control = null;
        if (this.state.data && this.state.data.length > 0) {
            control = <ul style={{display: this.state.show == true ? "block" : "none"}} ref="ul">
                {
                    this.state.data.map((child, i) => {
                        var reg = new RegExp(this.state.filterValue, "i");
                        if (this.state.filterValue && child.text.search(reg) == -1) {
                            return;
                        }
                        else {
                            //TODO 这里要用正则，先保留
                            var checked = false;
                            if ((this.state.value && child.value) && (("," + this.state.value.toString() + ",").indexOf("," + child.value + ",") > -1)) {
                                checked = true;
                            }
                            else if (this.state.value == "" && child.value == "") {
                                checked = true;
                            }
                            return (
                                <li key={"li" + i} className={checked == true ? "active" : ""}
                                    onClick={this.onSelect.bind(this, child.value, child.text, child)}>{child.text}</li>
                            )
                        }
                    })

                }
            </ul>;
        }

        return (
            <div className={componentClassName + this.state.validateClass} ref="select" style={{display:this.state.hide==true?"none":"block"}}>
                <Label name={this.props.label} ref="label" 
                       required={this.state.required} style={this.props.labelStyle}></Label>
                <div className={ "wasabi-form-group-body"}>
                    <div className={"nice-select "} >
                        <i className={"picker-clear"} onClick={this.clearHandler}
                           style={{display: this.state.readonly ? "none" : (this.state.value == "" || !this.state.value) ? "none" : "inline"}}></i>
                        <i className={"icon " + (this.state.show ? "rotate" : "")}
                           onClick={this.showOptions.bind(this, 1)}></i>
                        <input type="text" {...inputProps} title={this.props.addAbled ? "输入搜索，回车添加" : "输入搜索"}
                               onKeyUp={this.keyUpHandler}
                               value={this.state.filterValue != null ? this.state.filterValue : this.state.text}
                               onClick={this.showOptions.bind(this, 2)} onBlur={this.onBlur}
                               onChange={this.filterChangeHandler}/>

                        {
                            control
                        }
                    </div>
                    <small className={"wasabi-help-block " }
                           style={{display: (this.state.helpTip && this.state.helpTip != "") ? this.state.helpShow : "none"}}>
                        <div className="text">{this.state.helpTip}</div>
                    </small>
                </div>
            </div>

        );

    }

});
module.exports = Select;