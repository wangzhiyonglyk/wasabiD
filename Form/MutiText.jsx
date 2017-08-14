//creete by wangzy
//date:2016-11-21
//desc 增加多行文本
let React=require("react");

var validation=require("../Lang/validation.js");
let setStyle=require("../Mixins/setStyle.js");
var validate=require("../Mixins/validate.js");
var shouldComponentUpdate=require("../Mixins/shouldComponentUpdate.js");
var Label=require("../Unit/Label.jsx");
var Button=require("../Buttons/Button.jsx");
var pasteExtend=require("../Mixins/pasteExtend.js");
var ClickAway=require("../Unit/ClickAway.js");
import props from "./config/props.js";
import defaultProps from "./config/defaultProps.js";
var MutiText=React.createClass({
    mixins:[setStyle,validate,shouldComponentUpdate,ClickAway],
    propTypes:props,
    getDefaultProps:function() {
        return defaultProps;
    },
    getInitialState:function() {
        return{
            hide:this.props.hide,
            value:this.props.value,
            text:this.props.text,
            readonly:this.props.readonly,

            //其他属性
            show:false,//是否显示

            //验证
            required:this.props.required,
            validateClass:"",//验证的样式
            helpShow:"none",//提示信息是否显示
            helpTip:validation["required"],//提示信息
            invalidTip:"",
            areaValue:this.props.value?this.props.value.replace(/,/g, "\n"):null,//多行文本框的值

        }
    },
    componentWillReceiveProps:function(nextProps) {
        this.setState({
            hide:nextProps.hide,
            min:nextProps.min,
            max:nextProps.max,
            value: nextProps.value,
            areaValue:nextProps.value?nextProps.value.replace(/,/g, "\n"):null,
            text: nextProps.text,
            readonly: nextProps.readonly,
            required: nextProps.required,
            validateClass:"",//重置验证样式
            helpTip:validation["required"],//提示信息
            show:false


        });

    },
      setValue(value)    {
      this.setState({
          value:value,
      })
    },
    getValue()  {
        return this.state.value;

    },
    componentDidMount:function(){

        this.registerClickAway(this.hidePicker, this.refs.picker);//注册全局单击事件
    },
    onBlur:function () {
        this.refs.label.hideHelp();//隐藏帮助信息
    },
    changeHandler:function(event)
    {
        this.setState({
            areaValue:event.target.value,
        })
    },
    onlineChangeHandler:function(event) {//对应onChange事件
        this.setState({
            value:event.target.value,
            text:event.target.value,
            areaValue:event.target.value,
            show:false
        })
        if( this.props.onSelect!=null)
        {
            this.props.onSelect(event.target.value,event.target.value,this.props.name);
        }
    },
    showPicker:function() {//显示选择
        if (this.state.readonly) {
            //只读不显示
            return;
        }
        else {
            this.setState({
                show: !this.state.show
            })
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
        this.setState({
            value:null,
            text:null,
            areaValue:""
        })
    },
    cancelHandler:function() {//取消选择
        this.setState({
            show: false,
            areaValue:this.state.value?this.state.value.replace(/,/g, "\n"):null,//还原之前的值

        })
    },
    onSelectHandler:function() {//确定事件
        this.setState({
            ulShow:false,
            value:this.state.areaValue?this.state.areaValue.replace(/\n/g, ","):null,
            text:this.state.areaValue?this.state.areaValue.replace(/\n/g, ","):null,
        });
        if( this.props.onSelect!=null)
        {
            this.props.onSelect(this.state.areaValue?this.state.areaValue.replace(/\n/g, ","):null,this.state.areaValue?this.state.areaValue.replace(/\n/g, ","):null,this.props.name);
        }
    },
    render:function() {
        var size=this.props.onlyline==true?"onlyline":this.props.size;//组件大小
        var componentClassName=  "wasabi-form-group "+size;//组件的基本样式
        var style =this.setStyle("input");//设置样式
        var controlStyle=this.props.controlStyle?this.props.controlStyle:{};
        controlStyle.display = this.state.hide == true ? "none" : "block";
        let inputProps=
        {
            readOnly:this.state.readonly==true?"readonly":null,
            style:style,
            name:this.props.name,
            placeholder:(this.props.placeholder===""||this.props.placeholder==null)?this.state.required?"必填项":"":this.props.placeholder,
            className:"wasabi-form-control  "+(this.props.className!=null?this.props.className:"")

        }//文本框的属性

        //textarea 不支持null值
        let areaValue=this.state.areaValue;
        if(!areaValue)
        {
            areaValue="";
        }
        return (
            <div className={componentClassName+this.state.validateClass} ref="picker" style={ controlStyle}>
                <Label name={this.props.label} ref="label" hide={this.state.hide} required={this.state.required}></Label>
                <div className={ "wasabi-form-group-body"} style={{width:!this.props.label?"100%":null}}>
                    <div className="combobox"  style={{display:this.props.hide==true?"none":"block"}}   >
                        <i className={"picker-clear"} onClick={this.clearHandler} style={{display:this.state.readonly?"none":(this.state.value==""||!this.state.value)?"none":"inline"}}></i>
                        <i className={"pickeradd " +(this.state.show?"rotate":"")} onClick={this.showPicker}></i>
                        <input type="text"  {...inputProps}  value={this.state.text} onBlur={this.onBlur} onChange={this.onlineChangeHandler}      />
                        <div className={"dropcontainter  mutiText "+this.props.position}  style={{display:this.state.show==true?"block":"none"}}  >
                            <div style={{height:30,lineHeight:"30px",color:"#aaaaaa",overflow:"hidden"}}>{this.props.title}</div>
                       <textarea value={areaValue} ref="input" onChange={this.changeHandler}
                                 style={{width:"100%",height:100,border:"1px solid #d7dde2",resize:"none"}}></textarea>
                            <div className="ok" >
                                <Button title="确定" name="ok"  ripple={false} theme="green" onClick={this.onSelectHandler}></Button>
                                <Button title="取消" name="ok"  ripple={false}  theme="cancel" onClick={this.cancelHandler}></Button>
                            </div>
                        </div>
                    </div>
                    <small className={"wasabi-help-block "+this.props.position} style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}><div className="text">{this.state.helpTip}</div></small>
                </div>
            </div>


        )
    }
});
module .exports=MutiText;