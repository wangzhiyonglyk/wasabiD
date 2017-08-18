/**
 * Created by zhiyongwang on 2016-04-05以后.
 * 复选框集合组件
 */
require("../Sass/Form/Check.scss");
let React = require("react");
let unit = require("../libs/unit.js");
var FetchModel = require("../Model/FetchModel.js");
var validation = require("../Lang/validation.js");
var validate = require("../Mixins/validate.js");
var showUpdate = require("../Mixins/showUpdate.js");

var Label = require("../Unit/Label.jsx");
var Message = require("../Unit/Message.jsx");
import props from "./config/props.js";
import defaultProps from "./config/defaultProps.js";
let CheckBox = React.createClass({
    mixins: [validate, showUpdate],
    propTypes: props,
    getDefaultProps: function () {
         defaultProps.type="checkbox";
         return defaultProps;
    },
    getInitialState: function () {
        var newData = []; var text = this.props.text;
        if (this.props.data instanceof Array) {
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
            min: this.props.min,
            max: this.props.max,
            params: unit.clone(this.props.params),//参数
            data: newData,
            value: this.props.value,
            text: text,
            ulShow: false,//是否显示下拉选项
            readonly: this.props.readonly,

            //验证
            required: this.props.required,
            validateClass: "",//验证的样式
            helpShow: "none",//提示信息是否显示
            helpTip: validation["required"],//提示信息
            invalidTip: "",
        }
    },
    componentWillReceiveProps: function (nextProps) {
        var newData = []; var text = nextProps.text;
        if (nextProps.data != null && nextProps.data instanceof Array && (!nextProps.url || nextProps.url == "")) {

            for (let i = 0; i < nextProps.data.length; i++) {
                let obj = nextProps.data[i];
                obj.text = nextProps.data[i][this.props.textField];
                obj.value = nextProps.data[i][this.props.valueField];
                if (obj.value == nextProps.value) {
                    text = obj.text;//根据value赋值
                }
                newData.push(obj);
            }
            this.setState({
                hide: nextProps.hide,
                data: newData,
                min: nextProps.min,
                max: nextProps.max,
                value: nextProps.value,
                text: text,
                params: unit.clone(nextProps.params),
                readonly: nextProps.readonly,
                required: nextProps.required,
                validateClass: "",//重置验证样式
                helpTip: validation["required"],//提示信息
            })
        }
        else {


            if (nextProps.url != null) {

                if (this.showUpdate(nextProps.params)) {//如果不相同则更新
                    this.loadData(nextProps.url, nextProps.params);
                }
                else {

                }
            }

            this.setState({
                hide: nextProps.hide,
                min: nextProps.min,
                max: nextProps.max,
                value: nextProps.value,
                text: text,
                params: unit.clone(nextProps.params),
                readonly: nextProps.readonly,
                required: nextProps.required,
                validateClass: "",//重置验证样式
                helpTip: validation["required"],//提示信息
            })

        }
    },
    setValue(value) {
        let text = "";
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].value == value) {
                text = item;
                break;
            }
        }

        if (text) {
            this.setState({
                value: value,
                text: text
            })
        }

    },
    getValue() {
        return this.state.value;

    },
   
    componentWillMount: function () {//如果指定url,先查询数据再绑定
        this.loadData(this.props.url, this.state.params);//查询数据
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
            console.log("checkbox", fetchmodel);
        }
    },
    loadError: function (errorCode, message) {//查询失败
        console.log("checkbox-error", errorCode, message);
        Message.error(message);
    },
    loadSuccess: function (data) {//数据加载成功
        var realData = data;
        if (this.props.dataSource == null) {
        }
        else {
            realData = unit.getSource(data, this.props.dataSource);
        }
        var newData = []; var text = this.state.text;
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
        window.localStorage.setItem(this.props.name + 'data', JSON.stringify(newData));//用于后期获取所有数据

        this.setState({
            data: newData,
            value: this.state.value,
            text: text,
        })
    },
    changeHandler: function (event) {//一害绑定，但不处理
        if (this.state.readonly) {
            event.preventDefault();
        }
    },
    onSelect: function (value, text, data, e) {//选中事件
        e.preventDefault();//因为有用户借助label属性生成新的checkbox,所以要阻止默认事件
        if (this.state.readonly) {
            return;
        }
        var newvalue = ""; var newtext = "";
        var oldvalue = "";
        var oldtext = "";
        if (!this.state.value) {//没有选择任何项
        }
        else {
            oldvalue = this.state.value.toString();
        }
        if (!this.state.text) {//没有选择任何项
        }
        else {
            oldtext = this.state.text.toString();
        }
        if (("," + oldvalue).indexOf("," + value) > -1) {
            //取消选中
            if (oldvalue.indexOf("," + value) > -1) {//说明不是第一个
                newvalue = (oldvalue).replace("," + value, "");
                newtext = (oldtext).replace("," + text, "");
            }
            else if (oldvalue.indexOf(value + ",") > -1) {//第一个
                newvalue = (oldvalue).replace(value + ",", "");
                newtext = (oldtext).replace(text + ",", "");
            }
            else if (oldvalue.indexOf(value) > -1) {//只有一个
                newvalue = (oldvalue).replace(value, "");
                newtext = (oldtext).replace(text, "");
            }

        }
        else {//选中

            newvalue = oldvalue === "" ? value : oldvalue + "," + value;
            newtext = oldvalue === "" ? text : oldtext + "," + text;
        }
        this.setState({
            value: newvalue,
            text: newtext
        });
        this.validate(newvalue);
        if (this.props.onSelect != null) {
            this.props.onSelect(newvalue, newtext, this.props.name, data);
        }
    },
    render: function () {
       
        var componentClassName = "wasabi-form-group " ;//组件的基本样式
        var control = null;
        if (this.state.data instanceof Array) {
            control = this.state.data.map((child, i) => {
                var checked = false;
                if ((this.state.value != null && this.state.value != undefined) && (("," + this.state.value.toString()).indexOf("," + child[this.props.valueField]) > -1)) {
                    checked = true;
                }
                var props = {
                    checked: (checked == true ? "checked" : null),//是否为选中状态
                    readOnly: this.state.readonly == true ? "readonly" : null,
                }
                return <li style={this.props.style} className={this.props.className} key={i} onClick={this.onSelect.bind(this, child.value, child.text, child)}  >
                    <input type="checkbox" id={"checkbox" + this.props.name + child.value} value={child.value}
                         className="checkbox"  {...props}></input>
                    <label className="checkbox-label"  {...props}></label>
                    <div className="checktext" >{child.text}</div>
                </li >
            });

        }
        return (

            <div className={componentClassName + this.state.validateClass} >
                <Label name={this.props.label} ref="label" style={this.props.labelStyle} hide={this.state.hide} required={this.state.required}></Label>
                <div className={"wasabi-form-group-body"} style={{ width: !this.props.label ? "100%" : null }}>
                    <ul className="wasabi-checkul">
                        {
                            control
                        }
                    </ul>
                    <small className={"wasabi-help-block " } style={{ display: (this.state.helpTip && this.state.helpTip != "") ? this.state.helpShow : "none" }}><div className="text">{this.state.helpTip}</div></small>
                </div>
            </div>

        )

    }

});
module.exports = CheckBox;