//creete by wangzy
//date:2016-08-02
//desc 将输入框从Input中独立出来
let React=require("react");
var validation=require("../Lang/validation.js");
var validate=require("../Mixins/validate.js");
var Label=require("../Unit/Label.jsx");
var Message=require("../Unit/Message.jsx");
var FetchModel=require("../Model/FetchModel.js");
var unit=require("../libs/unit.js");
import props from "./config/props.js";
import config from "./config/textConfig.js";
import defaultProps from  "./config/defaultProps.js";
var Text=React.createClass({
    mixins:[validate],
     propTypes: Object.assign({type:React.PropTypes.oneOf(config)},props),
    getDefaultProps:function() {
        return defaultProps;
    },
    componentWillReceiveProps:function(nextProps) {
         this.setState({
            ...nextProps
        })
    },
    getInitialState:function() {
        return{
            hide:this.props.hide,
            min:this.props.min,
            max:this.props.max,
            value:this.props.value,
            text:this.props.text,
            readonly:this.props.readonly,
            required:this.props.required,
            validateClass:"",//验证的样式
            helpShow:"none",//提示信息是否显示
            helpTip:validation["required"],//提示信息
            invalidTip:"",
            validateState:null,//是否正在验证

        }
    },
    componentWillReceiveProps:function(nextProps) {
        this.setState({
            hide:nextProps.hide,
            min:nextProps.min,
            max:nextProps.max,
            value: nextProps.value,
            text: nextProps.text,
            readonly: nextProps.readonly,
            required: nextProps.required,
            validateClass:"",//重置验证样式
            helpTip:validation["required"],//提示信息
        });

    },
    componentDidMount:function() {
        this.validateInput=true;//设置初始化值，输入有效
        this.onblur=false;
    },
    componentDidUpdate:function() {
        this.validateInput=true;//设置初始化值
        if(this.state.helpTip=="非有效数字"||this.state.helpTip=="输入非法")
        {
            this.refs.input.select();
        }
        if(this.onblur)
        {
            this.onblur=false;
            this.props.onBlur();
        }
    },
    onChange:function(event) {
        if (this.validateInput==true) {//输入有效的时候

            if((this.props.type=="integer"||this.props.type=="number")) {
                //数字,或者正数时
                if(event.target.value=="-"||((!this.state.value||this.state.value.toString().indexOf(".")<0)&&event.target.value.length>0&&event.target.value.toString().lastIndexOf(".")==event.target.value.length-1))
                {
                    //第一次输入负号,或者输入小数点时原来没有小数点或为空时）时.不回传给父组件
                    this.setState({
                        value: event.target.value,
                        text:event.target.value,
                    });
                    return;
                }




            }



            this.setState({
                value: event.target.value,
                text:event.target.value,
            });

            if (this.props.onChange != null) {
                this.props.onChange(event.target.value);//自定义的改变事件

            }
            //回传给表单组件,下拉组件使用onSelect回传给表单组件
            if (this.props.backFormHandler != null) {
                this.props.backFormHandler(event.target.value, event.target.value, this.props.name);

            }

        }


    },
    keyDownHandler:function(event) {//控制输入
        this.validateInput=true;
        if(this.props.type=="integer"||this.props.type=="number")
        {
            if(((event.ctrlKey==false&&event.metaKey==false)&&event.keyCode>=65&&event.keyCode<=90))
            {//防止ctrl,command键
                this.validateInput=false;
            }

        }
        if(this.props.onKeyDown!=null)
        {
            this.props.onKeyDown(event);
        }

    },
    keyUpHandler:function(event) {
        if(event.keyCode==13)
        {
            if(this.props.validateUrl)
            {
                this.validateHandler(event.target.value);
            }
        }

        if(this.props.onKeyUp!=null)
        {
            this.props.onKeyUp(event);
        }
    },
    focusHandler:function() {//焦点事件
        if(this.props.onFocus!=null)
        {
            this.props.onFocus();
        }
    },
    blurHandler:function(event) {
        if(this.props.validateUrl) {//后台验证
            this.validateHandler(event.target.value);
        }
        else {//普通验证
            this.validate(this.state.value);
        }

        this.refs.label.hideHelp();//隐藏帮助信息

        if(this.props.onBlur)
        {
            this.onblur=true

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
    getValue:function () {//获取值
        return this.state.value;
    },
    setValue:function(value){//设置值
        this.setState({
            value:value,
        })
    },
    validateHandler:function (value) {//后台请求验证
        this.setState({
            validateState:"validing",//正在验证
        })
        var fetchmodel=new FetchModel(this.props.validateUrl,this.validateHandlerSuccess,{key:value});
        console.log("text-validing:",fetchmodel);
        unit.fetch.post(fetchmodel);
    },
    validateHandlerSuccess:function () {//后台请求验证成功
        this.setState({
            validateState:"valid",//验证成功
        })
    },
    validateHandlerError:function (errorCode,message) {//后台请求验证失败
        Message.error(message);
        this.setState({
            validateState:"invalid",//验证失败
        })
    },
    render:function() {
        var inputType="text";
        if(this.props.type=="password") {
            inputType = "password";
        }
        var componentClassName=  "wasabi-form-group ";//组件的基本样式
       
            let inputProps=
            {
                readOnly:this.state.readonly==true?"readonly":null,
                style:this.props.style,
                name:this.props.name,
                placeholder:(this.props.placeholder===""||this.props.placeholder==null)?this.state.required?"必填项":"":this.props.placeholder,
                className:"wasabi-form-control  "+(this.props.className!=null?this.props.className:""),
                rows:this.props.rows,
                title:this.props.title,

            }//文本框的属性
        var control=null;
        if(this.props.type!="textarea")
        {
            control = <input  ref="input" type={inputType}   {...inputProps} onClick={this.clickHandler}
                              onChange={this.onChange} onKeyDown={this.keyDownHandler}
                              onKeyUp={this.keyUpHandler} onFocus={this.focusHandler}
                              onBlur={this.blurHandler}
                              value={this.state.value}></input>;
        }
        else {
            //textarea 不支持null值
            let value=this.state.value;
            if(!value)
            {
                value="";
            }
            control = <textarea ref="input"  {...inputProps} onClick={this.clickHandler}
                                onChange={this.onChange} onKeyDown={this.keyDownHandler}
                                onKeyUp={this.keyUpHandler} onFocus={this.focusHandler}
                                onBlur={this.blurHandler}
                                value={value}></textarea>;
        }



        return (<div className={componentClassName+this.state.validateClass} onPaste={this.onPaste} style={{display:this.state.hide==true?"none":"block"}}>
                <Label name={this.props.label} ref="label" hide={this.state.hide} style={this.props.labelStyle} required={this.state.required}></Label>
                <div className={ "wasabi-form-group-body"} style={{width:!this.props.label?"100%":null}}>
                    {control}
                    <i className={this.state.validateState} style={{display:(this.state.validateState?"block":"none")}} ></i>
                    <small className={"wasabi-help-block "} style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}>
                        <div className="text">{this.state.helpTip}</div></small>
                </div>
            </div>
        )
    }
});
module .exports=Text;