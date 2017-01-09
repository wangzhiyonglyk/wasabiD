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
var shouldComponentUpdate=require("../Mixins/shouldComponentUpdate.js");
var Label=require("../Unit/Label.jsx");
var ClickAway=require("../Unit/ClickAway.js");
let DatePicker=React.createClass({
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
        onSelect: React.PropTypes.func,//选中后的事件，回传，value,与text,data



    },
    getDefaultProps:function() {
        return{
            type:"date",
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

        };
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
    componentWillReceiveProps:function(nextProps) {
        var text=nextProps.text;
        if(this.props.type.indexOf("date")>-1||this.props.type.indexOf("time")>-1) {//如果时间与日期相关组件，text就是value
            if((!text||text=="")&&nextProps.value&&nextProps.value!="")
            {
                text=nextProps.value;
            }
        }
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
        if(this.props.name=="test")
        {
            console.log(value,text);
        }

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
    setText:function () {
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
        var size = this.props.onlyline == true ? "onlyline" : this.props.size;//组件大小
        var componentClassName = "wasabi-form-group " + size ;//组件的基本样式
        var style = this.setStyle("input");//设置样式
        let inputProps =
        {
            readOnly: this.state.readonly == true ? "readonly" : null,
            style: style,
            name: this.props.name,
            placeholder:(this.props.placeholder===""||this.props.placeholder==null)?this.state.required?"必填项":"":this.props.placeholder,
            className:"wasabi-form-control  "+(this.props.className!=null?this.props.className:""),
            title:this.props.title,

        }//文本框的属性

      var text=  this.setText();
        return (
            <div className={componentClassName+this.state.validateClass}  ref="picker">
                <Label name={this.props.label} ref="label" hide={this.state.hide} required={this.state.required}></Label>
                <div className={ "wasabi-form-group-body"} style={{width:!this.props.label?"100%":null}}>
                    <div className="combobox" style={{display:this.props.hide==true?"none":"block"}}>
                        <i className={"picker-clear"} onClick={this.clearHandler} style={{display:this.state.readonly?"none":(this.state.value==""||!this.state.value)?"none":"inline"}}></i>
                        <i className={"pickericon  " +(this.state.show?" rotate":"")} onBlur={this.onBlur} onClick={this.showPicker.bind(this,1)}></i>
                        <input type="text" {...inputProps} value={text} onClick={this.showPicker.bind(this,2)} onChange={this.changeHandler}/>
                        <div className={"dropcontainter "+controlDropClassName+" "+size+" "+this.props.position}
                             style={{display:this.state.show==true?"block":"none"}} >
                            {
                                control
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
module.exports=DatePicker;