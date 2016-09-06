//creete by wangzy
//date:2016-08-02
//desc 将输入框从Input中独立出来
let React=require("react");


var validation=require("../Lang/validation.js");
let setStyle=require("../../Mixins/setStyle.js");
var validate=require("../../Mixins/validate.js");
var shouldComponentUpdate=require("../../Mixins/shouldComponentUpdate.js");
var Text=React.createClass({
    mixins:[setStyle,validate,shouldComponentUpdate],
    propTypes: {
        type:React.PropTypes.oneOf([
            "text",//普通输入框
            "textarea",//多行文本
            "password",//密码
            "email",//邮箱
            "url",//网址
            "mobile",//手机
            "idcard",//身份证
            "alpha",//英文字母
            "alphanum",//英文字母与数字
            "integer",//整型数据
            "number",//数字
        ]),//文本框输入的类型
        name:React.PropTypes.string.isRequired,//字段名
        label:React.PropTypes.string,//字段文字说明属性
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
            "default",
            "large",
            "onlyline"
        ]),//组件表单的大小
        position:React.PropTypes.oneOf([
            "left",
            "default",
            "right"
        ]),//组件在表单一行中的位置

       //其他属性
        rows:React.PropTypes.number,//行数
        min:React.PropTypes.number,//最小值,最小长度,
        max:React.PropTypes.number,//最大值,最大长度
        onClick:React.PropTypes.func,//单击事件
        onChange:React.PropTypes.func,//值改变事件

    },
    getDefaultProps:function() {
        return{
            type:"text",
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

            //其他属性
            row:5,
            min:null,
            max:null,
            onClick:null,
            onChange:null,


        }
    },
    getInitialState:function() {
        return{
            min:this.props.min,
            max:this.props.max,
            value:this.props.value,
            text:this.props.text,
            readonly:this.props.readonly,
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
            min:nextProps.min,
            max:nextProps.max,
            value: nextProps.value,
            text: nextProps.text,
            readonly: nextProps.readonly,
            required: nextProps.required,
        });
    },
    changeHandler:function(event) {
        if (this.validateInput==true) {
            var istrue=true;
            if((this.props.type=="integer"||this.props.type=="number")&&event.target.value=="-") {
                //输入负号时不验证
            }
            else {
                istrue = this.validate(event.target.value);
            }


            this.setState({
                value: event.target.value,
                text:event.target.value,
            });

            if (this.props.onChange != null) {
                if(istrue)
                {

                    this.props.onChange(event.target.value);//自定义的改变事件


                }

            }
            //回传给表单组件
            if (this.props.backFormHandler != null) {
                if(istrue) {
                    this.props.backFormHandler(event.target.value, event.target.value, this.props.name);
                }
            }

        }


    },
    keyDownHandler:function(event) {//控制输入
        this.validateInput=true;
        if(this.props.type=="integer"||this.props.type=="number")
        {
            if((event.keyCode>=65&&event.keyCode<=90))
            {
                this.validateInput=false;
            }
        }
        if(this.props.onKeyDown!=null)
        {
            this.props.onKeyDown();
        }

    },
    keyUpHandler:function() {
        if(this.props.onKeyUp!=null)
        {
            this.props.onKeyUp();
        }
    },
    focusHandler:function() {//焦点事件
        if(this.props.onFocus!=null)
        {
            this.props.onFocus();
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
    render:function() {
        var inputType="text";
        if(this.props.type=="password") {
            inputType = "password";
        }
        var size=this.props.onlyline==true?"onlyline":this.props.size;//组件大小
        var componentClassName=  "wasabi-form-group "+size+" "+(this.props.className?this.props.className:"");//组件的基本样式
        var style =this.setStyle("input");//设置样式
        let inputProps=
        {
            readOnly:this.state.readonly==true?"readonly":null,
            style:this.props.style,
            name:this.props.name,
            placeholder:this.props.placeholder,
            className:"wasabi-form-control  "+(this.props.className!=null?this.props.className:"")

        }//文本框的属性
       var control=null;
        if(this.props.type!="textarea")
        {
             control = <input  ref="input" type={inputType}   {...inputProps} onClick={this.clickHandler}
                                  onChange={this.changeHandler} onKeyDown={this.keyDownHandler}
                                  onKeyUp={this.keyUpHandler} onFocus={this.focusHandler} value={this.state.value}></input>;
        }
        else {
            control = <textarea ref="input"  {...inputProps} onClick={this.clickHandler}
                                onChange={this.changeHandler} onKeyDown={this.keyDownHandler}
                                onKeyUp={this.keyUpHandler} onFocus={this.focusHandler} value={this.state.value}></textarea>;
        }



        return (<div className={componentClassName+this.state.validateClass} style={style}>
                <label className="wasabi-form-group-label" style={{display:(this.props.label&&this.props.label!="")?"block":"none"}}>{this.props.label}
                </label>
                <div className={ "wasabi-form-group-body"}>
                    {control}
                    <small className={"wasabi-help-block "+this.props.position} style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}>{this.state.helpTip}</small>
                </div>
            </div>
        )
    }
});
module .exports=Text;