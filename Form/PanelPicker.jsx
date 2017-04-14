/**
 * Created by jiaxuanliang on 2016/7/4.
 */
var React = require("react");
var validation=require("../Lang/validation.js");
let setStyle=require("../Mixins/setStyle.js");
var validate=require("../Mixins/validate.js");
var shouldComponentUpdate=require("../Mixins/shouldComponentUpdate.js");
var Label=require("../Unit/Label.jsx");
var ClickAway=require("../Unit/ClickAway.js");
var PanelPicker = React.createClass({
    mixins:[setStyle,validate,shouldComponentUpdate,ClickAway],
    PropTypes:{
        type:React.PropTypes.oneOf[
            "date",//日期选择
                "datetime",//时间选择
                "daterange",//日期范围选择
                "datetimerange"//日期时间范围选择

            ],//类型
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

        //其他属性
        valueField: React.PropTypes.string,//数据字段值名称
        textField:React.PropTypes.string,//数据字段文本名称
        onSelect:React.PropTypes.func.isRequired

    },
    getDefaultProps:function() {
        return{
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
            className:null,
            size:"default",
            position:"default",
            //其他属性
            valueField:"value",
            textField:"text",
            onSelect:null
        };
    },
    getInitialState:function() {
        return{
            hide:this.props.hide,
            value: this.props.value,
            text:this.props.text,
            readonly: this.props.readonly,
            show:false,
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

            //验证
            required:this.props.required,
            helpShow:"none",//提示信息是否显示
            invalidTip:"",
            validateClass:"",//重置验证样式
            helpTip:validation["required"],//提示信息
        })
    },
    componentDidMount:function () {

        this.registerClickAway(this.hidePicker, this.refs.picker);//注册全局单击事件
    },
    componentDidUpdate:function () {
      if(this.showClick&&this.props.showHandler) {
          this.showClick=false;
          this.props.showHandler(this.state.show);
      }
    },
    changeHandler:function(event) {

    },
    onBlur:function () {
        this.refs.label.hideHelp();//隐藏帮助信息
    },
    showPicker:function(type) {//显示选择
        if(this.state.readonly)
        {
            //只读不显示
            return ;
        }
        else {
            this.setState({
                show: type==1?!this.state.show:true
            })
          this.showClick=true;//点击了显示
        }
        this.bindClickAway();//绑定全局单击事件
    },
    hidePicker:function () {
        this.setState({
            show: false
        })
        this.unbindClickAway();//卸载全局单击事件
    },
    clearHandler:function() {//清除数据
        if(this.props.onSelect!=null)
        {
            this.props.onSelect("","",this.props.name,null);
        }
        else
        {
            this.setState({
                value:null,
                text:null,
            })
        }
    },
    onSelect:function(value,txt) {
        this.setState({
            show: false,
            value:value,
            text:txt,
        })
        this.validate(value);
        if(this.props.onSelect!=null)
        {
            this.props.onSelect(value,txt,this.props.name,null);
        }



    },
    render:function (){

        var size = this.props.onlyline == true ? "onlyline" : this.props.size;//组件大小
        var componentClassName = "wasabi-form-group " + size ;//组件的基本样式
        var style = this.setStyle("input");//设置样式
        var controlStyle=this.props.controlStyle?this.props.controlStyle:{};
        controlStyle.display = this.state.hide == true ? "none" : "block";
        let inputProps =
        {
            readOnly: this.state.readonly == true ? "readonly" : null,
            style: style,
            name: this.props.name,
            placeholder:(this.props.placeholder===""||this.props.placeholder==null)?this.state.required?"必填项":"":this.props.placeholder,
            className:"wasabi-form-control  "+(this.props.className!=null?this.props.className:""),
            title:this.props.title,

        }//文本框的属性
        var children = React.cloneElement(this.props.children,{onSelect:this.onSelect})
        return (
            <div className={componentClassName+this.state.validateClass}  ref="picker" style={ controlStyle}>
                <Label name={this.props.label} ref="label" hide={this.state.hide} required={this.state.required}></Label>
                <div className={ "wasabi-form-group-body"} style={{width:!this.props.label?"100%":null}}>
                    <div className="combobox" style={{display:this.props.hide==true?"none":"block"}}
                        >
                        <i className={"picker-clear"} onClick={this.clearHandler} style={{display:(this.state.readonly?"none":this.state.value==""||!this.state.value)?"none":"inline"}}></i>
                        <i className={"pickericon "+(this.state.show?"rotate":"")} onClick={this.showPicker.bind(this,1)}></i>
                        <input type="text" {...inputProps} value={this.state.text} onBlur={this.onBlur} onClick={this.showPicker.bind(this,2)} onChange={this.changeHandler}/>
                        <div className={ "dropcontainter panelpicker "+this.props.position }
                             style={{display:this.state.show==true?"block":"none"}}>
                            {
                                children
                            }

                        </div>
                    </div>
                    <small className={"wasabi-help-block "+this.props.position}
                           style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}><div className="text">{this.state.helpTip}</div></small>
                </div>
            </div>

        );


    }
});

module.exports = PanelPicker;