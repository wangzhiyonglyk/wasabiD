/**
 * Created by zhiyongwang on 2016-04-26
 * desc:通用下拉日期,时间组件
 *
 */
require("../Sass/Form/ComboBox.scss");
let React=require("react");
var unit=require("../libs/unit.js");
let Time=require("./Time.jsx");
let DateD=require("./DateD.jsx");
let DateTime=require("./DateTime.jsx");
let DateRange=require("./DateRange.jsx");
let DateTimeRange=require("./DateTimeRange.jsx");

var validation=require("../Lang/validation.js");
var regs=require("../Lang/regs.js");
let setStyle=require("../Mixins/setStyle.js");
var validate=require("../Mixins/validate.js");

var Label=require("../Unit/Label.jsx");
var ClickAway=require("../Unit/ClickAway.js");
import props from "./config/props.js";
import config from "./config/dateConfig.js"
import defaultProps from  "./config/defaultProps.js";
let DatePicker=React.createClass({
    mixins:[setStyle,validate,ClickAway],
    propTypes: Object.assign({type:React.PropTypes.oneOf(config)},props),
    getDefaultProps:function() {
        return defaultProps;
    },
    getInitialState:function() {
        var text=this.props.text;
        if(this.props.type.indexOf("date")>-1||this.props.type.indexOf("time")>-1) {
            text = this.props.value;
        }
        return {
            hide:this.props.hide,
            value:this.props.value,
            text: text,
            readonly: this.props.readonly,
            //验证
            required:this.props.required,
            validateClass:"",//验证的样式
            helpShow:"none",//提示信息是否显示
            helpTip:validation["required"],//提示信息
            invalidTip:"",
        }
    },
    componentWillReceiveProps:function(nextProps) {//不是容器，不用默认处理
        var text=nextProps.text?nextProps.text:nextProps.value;
        this.setState({
            hide:nextProps.hide,
            value: nextProps.value,
            text:text,
            readonly: nextProps.readonly,
            //验证
            required:this.props.required,
            helpShow:"none",//提示信息是否显示
            invalidTip:"",
            validateClass:"",//重置验证样式
            helpTip:validation["required"],//提示信息
        })
    },
    componentDidMount:function(){

        this.registerClickAway(this.hidePicker, this.refs.picker);//注册全局单击事件
    },
     getValue:function()
    {
        return this.state.value;
    },
    setValue:function(value)
    {
        if(this.validate(value))
            {
                this.setState({
                    value:value
                })
            }
    },
    onBlur:function () {
        this.refs.label.hideHelp();//隐藏帮助信息
    },
    splitDate:function(splitdate) {//拆分日期格式


        if(splitdate&&splitdate.indexOf(" ")>-1&&regs.datetime(splitdate))
        {//有时间

            splitdate=splitdate.split(" ")[0];
            var  returnvalue={
                year:splitdate.split("-")[0],
                month:splitdate.split("-")[1],
                day:splitdate.split("-")[2],
            }
            return returnvalue;
        }
         else if(regs.date.test(splitdate))
        {
            var  returnvalue={
                year:splitdate.split("-")[0],
                month:splitdate.split("-")[1],
                day:splitdate.split("-")[2],
            }
            return returnvalue;
        }
        else {
            null;
        }

    },
    splitDateTime:function(datetime) {//

        if(datetime&&regs.datetime(datetime)&&datetime.indexOf(" ")>-1)
        {//如果不为空
            var splitdate=datetime.split(" ")[0];
            if(splitdate&&splitdate!="")
            {
                var  returnvalue={
                    year:splitdate.split("-")[0],
                    month:splitdate.split("-")[1],
                    day:splitdate.split("-")[2],
                    time:datetime.split(" ")[1]
                }
                return returnvalue;
            }
            else {
               return null;
            }
        }
        else
        {
            return null;
        }

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
        }
        this.bindClickAway();//绑定全局单击事件
    },
    hidePicker:function () {
        this.setState({
            show: false
        })
        this.unbindClickAway();//卸载全局单击事件
    },
    onSelect:function(value,text) {//选中事件
        this.setState({
            show:false,
            value:value,
            text:text,
        });
        this.validate(value);
        if( this.props.onSelect!=null)
        {
            this.props.onSelect(value,text,this.props.name,null);
        }
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
    changeHandler:function(event) {
    },
    _getText:function () {
        var text=this.state.text;
        if(this.props.type=="date") {
            if (text && text.indexOf(" ") > -1) {
                text = text.split(" ")[0];//除去显示的时间格式
            }
        }else if(this.props.type=="daterange") {
            if(text&&text.indexOf(" ")>-1) {

                var arr = text.split(",");
                text = "";
                if (arr.length > 0 && arr[0].indexOf(" ") > -1) {
                    text = arr[0].split(" ")[0];
                }

                if (arr.length == 2) {
                    if (arr[0].indexOf(" ") > -1) {
                        text = arr[0].split(" ")[0];
                    }
                    if (arr[1].indexOf(" ") > -1) {
                        text += "," + arr[1].split(" ")[0];
                    }
                }
            }

        }
        return text;
    },
   
    renderDate:function() {
        var dateobj=this.splitDate(this.state.value);
        if(this.state.value&&  this.state.value.indexOf(" ")>-1)
        {//说明有时间
             dateobj=this.splitDateTime(this.state.value);
        }

        return <DateD ref="combobox"  name={this.props.name} showTime={false} {...dateobj}  onSelect={this.onSelect}></DateD>

    },
    renderDateTime:function() {
        var dateobj=this.splitDateTime(this.state.value);
        return <DateTime ref="combobox" {...dateobj} name={this.props.name} showTime={true} onSelect={this.onSelect}></DateTime>

    },
    renderDateTimeRange:function() {
        var firstDate=null;var secondDate=null;
        var firstTime=null;var secondTime=null;
        if(this.state.value!=null&&this.state.value!="") {//传入一到两个值
            var dateArray=this.state.value.split(",");
            if(dateArray.length>0)
            {
                if(dateArray[0].indexOf(" ")>-1)
                {//有时间
                    firstDate=(dateArray[0]).split(" ")[0];
                    firstTime=(dateArray[0]).split(" ")[1];
                }
                else {
                    firstDate=(dateArray[0]);
                }


            }
            if(dateArray.length>=2)
            {
                if(dateArray[1].indexOf(" ")>-1)
                {//有时间
                    secondDate=(dateArray[1]).split(" ")[0];
                    secondTime=(dateArray[1]).split(" ")[1];
                }
                else {
                    secondDate=(dateArray[1]);
                }
            }
        }
        return <DateTimeRange ref="combobox" name={this.props.name} firstDate={firstDate} firstTime={firstTime} secondDate={secondDate} secondTime={secondTime} onSelect={this.onSelect}></DateTimeRange>
    },
    renderDateRange:function() {
        var firstDate=null;var secondDate=null;
        if(this.state.value!=null&&this.state.value!="") {//传入一到两个值
            var dateArray=this.state.value.split(",");
            if(dateArray.length>0)
            {
                firstDate=(dateArray[0]);
            }
            if(dateArray.length>=2)
            {
                secondDate=(dateArray[1]);
            }
        }
        return <DateRange ref="combobox"  name={this.props.name} firstDate={firstDate} secondDate={secondDate}  onSelect={this.onSelect}></DateRange>
    },
    render:function() {
        let control = null;
        let controlDropClassName = "";

        switch (this.props.type) {

            case "date":
                control = this.renderDate();
                controlDropClassName = "date";
                break;
            case "datetime":
                control = this.renderDateTime();
                controlDropClassName = "date time";
                break;
            case "daterange":
                control = this.renderDateRange();
                controlDropClassName = "range";
                break;
            case "datetimerange":
                control = this.renderDateTimeRange();
                controlDropClassName = "range";
                break;
        }
      
        
        var componentClassName = "wasabi-form-group "  ;//组件的基本样式
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

      var text=  this._getText();
        return (
            <div className={componentClassName+this.state.validateClass}  ref="picker" style={ controlStyle}>
                <Label name={this.props.label} ref="label" hide={this.state.hide} required={this.state.required}></Label>
                <div className={ "wasabi-form-group-body"} style={{width:!this.props.label?"100%":null}}>
                    <div className="combobox" style={{display:this.props.hide==true?"none":"block",width:style.width}}>
                        <i className={"picker-clear"} onClick={this.clearHandler} style={{display:this.state.readonly?"none":(this.state.value==""||!this.state.value)?"none":"inline"}}></i>
                        <i className={"pickericon  " +(this.state.show?" rotate":"")} onBlur={this.onBlur} onClick={this.showPicker.bind(this,1)}></i>
                        <input type="text" {...inputProps} value={text} onClick={this.showPicker.bind(this,2)} onChange={this.changeHandler}/>
                        <div className={"dropcontainter "+controlDropClassName+" "}
                             style={{display:this.state.show==true?"block":"none"}} >
                            {
                                control
                            }

                        </div>
                    </div>
                    <small className={"wasabi-help-block "}
                           style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}><div className="text">{this.state.helpTip}</div></small>
                </div>
            </div>

        );
    }

});
module.exports=DatePicker;