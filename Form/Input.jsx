/*
 create by wangzy
 date:2016-04-05后开始独立改造
 2017-08-14改造
 desc:表单组件窗口
 */
require("../Sass/Form/Input.scss");
let React = require("react");
let regexp = require("../Lang/regs.js");
let validation = require("../Lang/validation.js");
let Radio = require("./Radio.jsx");
let CheckBox = require("./CheckBox.jsx");
let SwitchButton = require("./SwitchButton.jsx");
let ComboBox = require("./ComboBox.jsx");
let Text = require("./Text.jsx");
let None = require("./None.jsx");
let Button = require("../Buttons/Button.jsx");
let LinkButton = require("../Buttons/LinkButton.jsx");
let setStyle = require("../Mixins/setStyle.js");
let unit = require("../libs/unit.js");
let shouldComponentUpdate = require("../Mixins/shouldComponentUpdate.js");
import props from "./config/props.js";
import config from "./config/inputConfig.js"
import defaultProps from "./config/defaultProps.js";
let Input = React.createClass({
    mixins: [setStyle, shouldComponentUpdate],
    propTypes: Object.assign({ type: React.PropTypes.oneOf(config) }, props),
    getDefaultProps: function () {
        return defaultProps;
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            ...nextProps
        })
    },
    validate: function (value) {//用于Form调用验证
        return this.refs.input.validate();
    },
    getValue: function () {//用于调用获取值
        return this.refs.input.state.value;
    },
    setValue: function (value, text) {//用于设置值
         this.refs.input.setState({
            value: value,
            text: text
        })
    },
    renderText: function () {//普通文本框
        return <Text ref="input" {...this.props} ></Text>
    },
    renderUnInput: function (type) {//非输入框组件
        let control;//组件
        let props = { ...this.props }////原有的属性
        props.value = this.state.value;//注意绑定
        props.text = this.state.text;//
        if (type == "none") {//空占位组件
            control = <None ref="input" {...props } ></None>
        }
        else if (type == "radio") {//单选按钮组
            control = <Radio ref="input" {...props } onSelect={this.onSelect}></Radio>
        }
        else if (type == "checkbox") {//多选择按钮组
            control = <CheckBox ref="input" {...props } onSelect={this.onSelect} ></CheckBox>
        }
        else if (type == "switch") {//开关
            control = <SwitchButton ref="input"  {...props} onSelect={this.onSelect}></SwitchButton>
        }

        else if (type == "muti" || type == "select" || type == "datetime" || type == "time" || type == "date" || type == "daterange" || type == "datetimerange" || type == "picker" || type == "treepicker" || type == "panelpicker") {//下拉组件
            control = <ComboBox ref="input" {...props } onSelect={this.onSelect}></ComboBox>
        }



        return control;
    },
    render: function () {
        let size = this.props.size;
        let componentClassName = "wasabi-form-group " + this.props.size + " " + this.props.className;//组件的基本样式
        let style = this.props.style;
        if (this.props.type == "text" || this.props.type == "email"
            || this.props.type == "url" || this.props.type == "number"
            || this.props.type == "integer" || this.props.type == "alpha"
            || this.props.type == "alphanum" || this.props.type == "mobile"
            || this.props.type == "idcard"
            || this.props.type == "password"
            || this.props.type == "textarea") {//这几种类型统一为text

            return this.renderText();
        }

        else {//输入文本输入框类型

            return this.renderUnInput(this.props.type);
        }


        return null;

    }
});
module.exports = Input;