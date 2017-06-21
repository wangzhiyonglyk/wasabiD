/*
 create by wangzy
 date:2016-04-05后开始独立改造
 desc:通用表单组件
 */
require("../Sass/Form/Input.scss");
var React=require("react");
var regexp=require("../Lang/regs.js");
var validation=require("../Lang/validation.js");
var Radio=require("./Radio.jsx");
var CheckBox=require("./CheckBox.jsx");
var SwitchButton=require("./SwitchButton.jsx");
var ComboBox=require("./ComboBox.jsx");
var Text=require("./Text.jsx");
var None=require("./None.jsx");
var Button=require("../Buttons/Button.jsx");
var LinkButton=require("../Buttons/LinkButton.jsx");
let setStyle=require("../Mixins/setStyle.js");
var unit=require("../libs/unit.js");
var shouldComponentUpdate=require("../Mixins/shouldComponentUpdate.js");
var Input=React.createClass({
    mixins:[setStyle,shouldComponentUpdate],
    propTypes: {
        type:React.PropTypes.oneOf([
            "none",//空的占位符
            "text",//普通输入框
            "password",//密码
            "email",//邮箱
            "url",//网址
            "mobile",//手机
            "idcard",//身份证
            "date",//日期
            "time",//时间
            "datetime",//日期时间
            "daterange",//日期范围
            "datetimerange",//日期时间范围
            "alpha",//英文字母
            "alphanum",//英文字母与数字
            "integer",//整型数据
            "number",//数字
            "textarea",//多行文本
            "select",//下拉框
            "radio",//单选框
            "checkbox",//复选框
            "switch",//开关
            "picker",//级联选择组件
            "gridpicker",//列表选择
            "treepicker",//下拉树选择
            "panelpicker",//面板选择
            "muti"//多行文本
        ]),//输入框的类型
        name:React.PropTypes.string.isRequired,//字段名
        label:React.PropTypes.oneOfType([React.PropTypes.string,React.PropTypes.element,React.PropTypes.node]),//字段文字说明属性
        title:React.PropTypes.string,//提示信息
        width:React.PropTypes.number,//宽度
        height:React.PropTypes.number,//高度
        value:React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.string]),//默认值,
        text:React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.string]),//默认文本值
        placeholder:React.PropTypes.string,//输入框预留文字
        readonly:React.PropTypes.bool,//是否只读
        required:React.PropTypes.bool,//是否必填
        onlyline:React.PropTypes.bool,//是否只占一行
        hide:React.PropTypes.bool,//是否隐藏
        regexp:React.PropTypes.string,//正则表达式
        invalidTip:React.PropTypes.string,//无效时的提示字符
        style:React.PropTypes.object,//自定义style
        controlStyle:React.PropTypes.object,//自定义外层样式
        className:React.PropTypes.string,//自定义class
        size:React.PropTypes.oneOf([
            "none",
            "default",
            "large",//兼容性值,与two相同
            "two",
            "three",
            "onlyline"
        ]),//组件表单的大小
        position:React.PropTypes.oneOf([
            "left",
            "default",
            "right"
        ]),//组件在表单一行中的位置

        //其他属性 text
        min:React.PropTypes.number,//最小值,最小长度,最少选项
        max:React.PropTypes.number,//最大值,最大长度,最多选项
        onClick:React.PropTypes.func,//单击事件
        onChange:React.PropTypes.func,//值改变事件

        //其他属性 combobox
        multiple:React.PropTypes.bool,//是否允许多选
        valueField: React.PropTypes.string,//数据字段值名称
        textField:React.PropTypes.string,//数据字段文本名称
        url:React.PropTypes.string,//ajax的后台地址
        params:React.PropTypes.object,//查询参数
        dataSource:React.PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
        data:React.PropTypes.array,//自定义数据源
        extraData:React.PropTypes.array,//额外的数据,对url有效
        onSelect: React.PropTypes.func,//选中后的事件，回传，value,与text,data

        //其他属性 picker
        secondUrl:React.PropTypes.string,//第二层节点的后台地址,
        secondParams:React.PropTypes.object,//第二层节点的后台参数
        secondParamsKey:React.PropTypes.string,//第二层节点的后台参数中传递一级节点value值的参数名称
        thirdUrl:React.PropTypes.string,//第三层节点的后台地址，
        thirdParams:React.PropTypes.object,//第三层节点的后台参数
        thirdParamsKey:React.PropTypes.string,//第三层节点的后台参数中传递二级节点value值的参数名称
        hotTitle:React.PropTypes.string,//热门选择标题
        hotData:React.PropTypes.array,//热门选择的数据

        //其他属性,参见其他按钮
        iconCls:React.PropTypes.string,
        iconAlign:React.PropTypes.oneOf([
            "left",
            "right",
            "rightTop"
        ]),//图片位置

    },
    getDefaultProps:function() {
        return{
            type:"text",
            name:"",
            label:null,
            title:null,
            width:null,
            height:null,
            value:"",
            text:"",
            placeholder:"",
            readonly:false,
            required:false,
            onlyline:false,
            hide:false,
            regexp:null,
            invalidTip:null,
            style:null,
            controlStyle:null,
            className:null,
            size:"default",
            position:"default",

            //其他属性
            row:5,
            min:null,
            max:null,
            onClick:null,
            onChange:null,


            //其他属性
            multiple:false,
            valueField:"value",
            textField:"text",
            url:null,
            params:null,
            dataSource:"data",
            data:null,
            extraData:null,
            onSelect:null,

            //其他属性
            secondUrl:null,
            secondParams:null,
            secondParamsKey:null,
            thirdUrl:null,
            thirdParams:null,
            thirdParamsKey:null,
            hotTitle:"热门选择",
            hotData:null,
        }
    },
    getInitialState:function() {
        return{
            value:this.props.value,
            text:this.props.text,
            readonly:this.props.readonly,
            hide:this.props.hide,
            data:this.props.data,
            //验证
            required:this.props.required,
            validateClass:"",//验证的样式
            helpShow:"none",//提示信息是否显示
            helpTip:validation["required"],//提示信息
            invalidTip:"",
        }
    },
    componentWillReceiveProps:function(nextProps) {
        this.setState({
            hide:nextProps.hide,
            value:nextProps.value,
            text: nextProps.text,
            readonly: nextProps.readonly,
            required: nextProps.required,
            data: nextProps.data,
        });
    },
    changeHandler:function(event) {//文本框的值改变事件
        this.setState({
            value: event.target.value,
            text: event.target.value,
        });
        if (this.props.onChange != null) {
            this.props.onChange(event.target.value);//自定义的改变事件
        }
        //回传给表单组件
        if (this.props.backFormHandler != null) {
            this.props.backFormHandler(event.target.value, event.target.value, this.props.name);
        }
    },
    clickHandler:function(event) {//单击事件
        if(this.props.onClick!=null) {
            var model = {};
            try {//有可能存在复制不成功的情况
                model ={...this.props};
            }
            catch (e) {

            }
            model.value=this.state.value;
            model.text=this.state.text;
            this.props.onClick(this.props.name,this.state.value,model);
        }
    },
    buttonClick:function(name,title,event) {//按钮的单击事件
        if(this.props.onClick!=null) {
            this.props.onClick(name,title,event);
        }
    },
    validate:function(value) {
        if(this.props.type=="button"||this.props.type=="linkbutton")
        {
            return true;
        }
        else
        {
            return this.refs.input.validate();
        }


    },
    onSelect:function(value,text,name,data) {//保存选中的值
        this.setState({
            value:value,
            text:text,
        });
        if(  this.props.onSelect!=null)
        {
            this.props.onSelect(value,text,this.props.name,data);//回调
        }
        //回传给表单组件
        if (this.props.backFormHandler != null) {
            this.props.backFormHandler(value,text,name,data);
        }

    },
    getComponentData:function(name) {//只读属性，获取对应的字段的数据源
        return JSON.parse( window.localStorage.getItem(name+"data"));
    },
    renderText:function() {//普通文本框
        var props={...this.props}////原有的属性
        props.value=this.state.value;//注意绑定
        props.text=this.state.text;//
        return <Text ref="input" {...props} ></Text>
    },
    renderUnInput:function(type) {//非输入框组件
        var control;//组件
        var props={...this.props}////原有的属性
        props.value=this.state.value;//注意绑定
        props.text=this.state.text;//
        if (type=="none")
        {//空占位组件
            control=<None ref="input" {...props } ></None>
        }
        else  if(type=="radio")
        {//单选按钮组
            control=<Radio ref="input" {...props } onSelect={this.onSelect}></Radio>
        }
        else  if(type=="checkbox")
        {//多选择按钮组
            control=<CheckBox ref="input" {...props } onSelect={this.onSelect} ></CheckBox>
        }
        else if(type=="switch")
        {//开关
            control=<SwitchButton ref="input"  {...props} onSelect={this.onSelect}></SwitchButton>
        }

        else if(type=="muti"||type=="select"||type=="datetime"||type=="time"||type=="date" ||type=="daterange"||type=="datetimerange"||type=="picker"||type=="treepicker"||type=="gridpicker"||type=="panelpicker")
        {//下拉组件
            control=<ComboBox ref="input" {...props }  onSelect={this.onSelect}></ComboBox>
        }



        return control;
    },
    render:function() {
        var size=this.props.onlyline?"onlyline":this.props.size;
        var componentClassName=  "wasabi-form-group "+size+" "+(this.props.className?this.props.className:"");//组件的基本样式
        var style=this.props.style;
        if(this.props.type=="button")
        {

            return <div className={componentClassName} style={style}>   <Button {...this.props} title={this.props.label} onClick={this.buttonClick}></Button></div>
        }
        else if(this.props.type=="linkbutton") {
            return <div className={componentClassName} style={style}><LinkButton {...this.props} title={this.props.label}
                                                                                 onClick={this.buttonClick}></LinkButton></div>
        }
        else
        {
            if(this.props.type=="text"||this.props.type=="email"
                ||this.props.type=="url"||this.props.type=="number"
                ||this.props.type=="integer"||this.props.type=="alpha"
                ||this.props.type=="alphanum"||this.props.type=="mobile"
                ||this.props.type=="idcard"
                ||this.props.type=="password"
                ||this.props.type=="textarea") {//这几种类型统一为text

                return this.renderText();
            }

            else {//输入文本输入框类型

                return  this.renderUnInput(this.props.type);
            }
        }

        return null;

    }
});
module .exports=Input;