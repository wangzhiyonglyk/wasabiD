/**
 * Created by jiaxuanliang
 * date:2016-04-05后开始独立改造
 * edit by wangzy
 * date:2016-04-26
 * desc:重命名为SwitchButton 并将完善
 */
require('../Sass/Form/SwitchButton.scss');
let React = require('react');
let setStyle=require("../Mixins/setStyle.js");

var Label=require("../Unit/Label.jsx");
import props from "./config/props.js";
import defaultProps from "./config/defaultProps.js";
let SwitchButton = React.createClass({
    mixins:[setStyle],
    propTypes:props,
    getDefaultProp:function() {
     return defaultProps;
    },
    getInitialState:function(){
        return {
            hide:this.props.hide,
            value:this.props.value===""?0:this.props.value,//用于回传给表单组件
            text:this.props.value===""?"false":"true",
            readonly:this.props.readonly,
        }
    },
    componentWillReceiveProps:function(nextProps) {
          this.setState({
               hide:nextProps.hide,
              value:(nextProps.value!=0&&nextProps.value!=1)?0:nextProps.value,
              text:(nextProps.value!=0&&nextProps.value!=1)?"false":nextProps.text,
              readonly:nextProps.readonly,
          })

    },
    validate:function()
    {
      return true;
    },
      getValue:function () {//获取值
        return this.state.value;
    },
    setValue:function(value){//设置值
        this.setState({
            value:value,
        })
    },
    handleClick:function(){
        if(this.state.readonly)
        {
            return ;
        }
        this.setState({
            value:this.state.value==1?0:1,
            text:this.state.value==1?"false":"true",
        });

        if(this.props.onSelect!=null)
        {//返回给comboBox组件
            this.props.onSelect(this.state.value==1?0:1,this.state.value==1?"false":"true",this.props.name);
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
        var controlStyle=this.props.controlStyle?this.props.controlStyle:{};
        controlStyle.display = this.state.hide == true ? "none" : "block";
        var className = "syncbtn ";
        if(this.state.value==1){
            className+="checktrue";
        }else{
            className += "checkfalse";
        }

        if(this.state.readonly)
        {
            className+=" disabled";
        }

        return (
        <div className={componentClassName+this.state.validateClass}  style={ controlStyle}>
            <Label name={this.props.label} ref="label" hide={this.state.hide} required={this.state.required}></Label>
            <div className={ "wasabi-form-group-body"} style={{width:!this.props.label?"100%":null}}>
                <div className={className} onClick={this.handleClick}>
                    <div className={"slideblock "}></div>
                </div>
                <small className={"wasabi-help-block "+this.props.position} style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}><div className="text">{this.state.helpTip}</div></small>
            </div>
        </div>

        )
    }
});
module.exports = SwitchButton;