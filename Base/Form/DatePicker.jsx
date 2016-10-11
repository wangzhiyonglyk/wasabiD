/**
 * Created by zhiyongwang on 2016-04-26
 * desc:通用下拉日期,时间组件
 *
 */
require("../../sass/Base/Form/ComboBox.scss");
let React=require("react");
var unit=require("../../libs/unit.js");
let Time=require("./Time.jsx");
let DateD=require("./DateD.jsx");
let DateTime=require("./DateTime.jsx");
let DateRange=require("./DateRange.jsx");
let DateTimeRange=require("./DateTimeRange.jsx");

var validation=require("../Lang/validation.js");
let setStyle=require("../../Mixins/setStyle.js");
var validate=require("../../Mixins/validate.js");
var shouldComponentUpdate=require("../../Mixins/shouldComponentUpdate.js");
var Label=require("../Unit/Label.jsx");
let ComboBox=React.createClass({
    mixins:[setStyle,validate,shouldComponentUpdate],
    PropTypes:{
        type:React.PropTypes.oneOf[
                "date",//日期选择
                "datetime",//时间选择
                "daterange",//日期范围选择
                "datetimerange"//日期时间范围选择

            ],//类型
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
        onSelect: React.PropTypes.func,//选中后的事件，回传，value,与text,data



    },
    getDefaultProps:function() {
        return{
            type:"date",
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
            helpTip:validation["required"],//提示信息
            invalidTip:"",
            validateClass:"",//重置验证样式
        })
    },
    mouseOutHandler:function(event) {//鼠标移开时隐藏下拉
        //var parentE=event.relatedTarget;//相关节点
        //while (parentE&&parentE.nodeName!="BODY")
        //{
        //    if(parentE.className.indexOf("combobox")>-1)
        //    {
        //        break;
        //    }
        //    parentE=parentE.parentElement;
        //}
        //
        //if(parentE==undefined||parentE==null||parentE.nodeName=="BODY")
        //{
        //    setTimeout(()=>
        //    {
        //        this.setState({
        //            show:false,
        //        });
        //    },200);
        //
        //}

    },
    splitDate:function(splitdate) {//拆分日期格式
        var regs=/^(\d{4})-(\d{2})-(\d{2})$/;
        if(splitdate&&splitdate!=""&&regs.test(splitdate))
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
    showPicker:function() {//显示选择
        if(this.state.readonly)
        {
            //只读不显示
            return ;
        }
        else {
            this.setState({
                show: !this.state.show
            })
        }
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
    changeHandler:function(event) {
    },
    renderDate:function() {
        var dateobj=this.splitDate(this.state.value);
        return <DateD ref="combobox"  name={this.props.name} showTime={false} {...dateobj}  onSelect={this.onSelect}></DateD>

    },
    renderDateTime:function() {
        var dateobj=this.splitDate(this.state.value);
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
        var componentClassName = "wasabi-form-group " + size + " " + (this.props.className ? this.props.className : "");//组件的基本样式
        var style = this.setStyle("input");//设置样式
        let inputProps =
        {
            readOnly: this.state.readonly == true ? "readonly" : null,
            style: this.props.style,
            name: this.props.name,
            placeholder:(this.props.placeholder===""||this.props.placeholder==null)?this.state.required?"必填项":"":this.props.placeholder,
            className:"wasabi-form-control  "+(this.props.className!=null?this.props.className:"")

        }//文本框的属性
        return (
            <div className={componentClassName+this.state.validateClass} style={style}>
                <Label name={this.props.label} hide={this.state.hide} required={this.state.required}></Label>
                <div className={ "wasabi-form-group-body"}>
                    <div className="combobox" style={{display:this.props.hide==true?"none":"block"}}
                         onMouseOut={this.mouseOutHandler}>
                        <i className={"pickericon "} onClick={this.showPicker}></i>
                        <input type="text" {...inputProps} value={this.state.text} onChange={this.changeHandler}/>
                        <div className={"dropcontainter "+controlDropClassName+" "+size+" "+this.props.position}
                             style={{display:this.state.show==true?"block":"none"}}>
                            {
                                control
                            }

                        </div>
                    </div>
                    <small className={"wasabi-help-block "+this.props.position}
                           style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}>{this.state.helpTip}</small>
                </div>
            </div>

        );
    }

});
module.exports=ComboBox;