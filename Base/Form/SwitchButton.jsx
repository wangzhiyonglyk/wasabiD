/**
 * Created by jiaxuanliang
 * date:2016-04-05后开始独立改造
 * edit by wangzy
 * date:2016-04-26
 * desc:重命名为SwitchButton 并将完善
 */
require('../../sass/Base/Form/SwitchButton.scss');
let React = require('react');
let setStyle=require("../../Mixins/setStyle.js");

let SwitchButton = React.createClass({
    mixins:[setStyle],
    propTypes:{
        name:React.PropTypes.string.isRequired,//字段名
        label:React.PropTypes.string,//字段文字说明属性
        width:React.PropTypes.number,//宽度
        height:React.PropTypes.number,//高度
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
            "default",
            "large",
            "onlyline"
        ]),//组件表单的大小
        position:React.PropTypes.oneOf([
            "left",
            "default",
            "right"
        ]),//组件在表单一行中的位置
        checked:React.PropTypes.bool,//默认是否选中
        onClick:React.PropTypes.func,//单击事件，回传当前值,用于单独使用
        onSelect:React.PropTypes.func,//单击事件，专门用于表单

    },
    getDefaultProp:function() {
        return {   type:"text",
            name:"",
            label:null,
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

            checked:false,
        }
    },
    getInitialState:function(){
        return {
            checked:this.props.value==this.props.checked,
            value:this.props.checked?1:0,//用于回传给表单组件
            readonly:this.props.readonly,
        }
    },
    componentWillReceiveProps:function(nextProps) {
        var checked=nextProps.checked;
        if(!checked)
        {
            checked=nextProps.value==1?true:false
        }
          this.setState({
              checked:checked,
              value:nextProps.value,
              readonly:nextProps.readonly,
          })

    },
    validate:function()
    {
      return true;
    },
    handleClick:function(){
        if(this.state.readonly)
        {
            return ;
        }
        this.setState({
            checked:!this.state.checked,
            value:!this.props.checked?1:0
        });
        if(this.props.onClick!=null)
        {//单独使用时
            this.props.onClick(!this.state.checked,!this.state.checked?1:0,this.props.name);
        }
        if(this.props.onSelect!=null)
        {//返回给comboBox组件
            this.props.onSelect(!this.state.checked?1:0,!this.state.checked?1:0,this.props.name);
        }

    },
    render:function(){
        var inputType="text";
        if(this.props.type=="password") {
            inputType = "password";
        }
        var size=this.props.onlyline==true?"onlyline":this.props.size;//组件大小
        var componentClassName=  "wasabi-form-group "+size+" "+(this.props.className?this.props.className:"");//组件的基本样式
        var style =this.setStyle("input");//设置样式
        var className = "syncbtn ";
        if(this.state.checked){
            className+="checktrue";
        }else{
            className += "checkfalse";
        }

        if(this.state.readonly)
        {
            className+=" disabled";
        }

        return (
        <div className={componentClassName+this.state.validateClass} style={style}>
            <label className="wasabi-form-group-label" style={{display:(this.props.label&&this.props.label!="")?"block":"none"}}>{this.props.label}
            </label>
            <div className={ "wasabi-form-group-body"}>
                <div className={className} onClick={this.handleClick}>
                    <div className={"slideblock "}></div>
                </div>
                <small className={"wasabi-help-block "+this.props.position} style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}>{this.state.helpTip}</small>
            </div>
        </div>

        )
    }
});
module.exports = SwitchButton;