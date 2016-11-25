/**
 * Created by zhiyongwang on 2016-04-26
 * desc:通用下拉框组件
 *
 */
require("../../sass/Base/Form/ComboBox.scss");
let React=require("react");
var unit=require("../../libs/unit.js");
let Time=require("./Time.jsx");
let DatePicker=require("./DatePicker.jsx");
let Picker=require("./Picker.jsx");
let Select=require("./Select.jsx");
let MutiText=require("./MutiText.jsx");
let GridPicker=require("./GridPicker.jsx");
let PanelPicker=require("./PanelPicker.jsx");
var shouldComponentUpdate=require("../../Mixins/shouldComponentUpdate.js");
let ComboBox=React.createClass({
    mixins:[shouldComponentUpdate],
    PropTypes:{
        type:React.PropTypes.oneOf[
            "select",//普通下拉
                "date",//日期选择
                "time",//时间选择
                "datetime",//时间选择
                "daterange",//日期范围选择
                "datetimerange",//日期时间范围选择
                "picker",//级联选择组件
                "gridpicker",//列表选择
                "panelpicker",//面板选择
                "muti"//多行添加
            ],//类型
        name:React.PropTypes.string.isRequired,//字段名
        label:React.PropTypes.oneOfType([React.PropTypes.string,React.PropTypes.element,React.PropTypes.node]),//字段文字说明属性
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
        min:React.PropTypes.number,//最少选择几个
        max:React.PropTypes.number,//最多选择几个
        onClick: React.PropTypes.func,//自定义单击事件，这样就可以将普通下拉框组合其他组件
        //其他属性
        valueField: React.PropTypes.string,//数据字段值名称
        textField:React.PropTypes.string,//数据字段文本名称
        url:React.PropTypes.string,//ajax的后台地址
        params:React.PropTypes.object,//查询参数
        backSource:React.PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
        data:React.PropTypes.array,//自定义数据源
        extraData:React.PropTypes.array,//额外的数据,对url有效
        onSelect: React.PropTypes.func,//选中后的事件，回传，value,与text,data

        //其他属性
        secondUrl:React.PropTypes.string,//第二层节点的后台地址,
        secondParams:React.PropTypes.object,//第二层节点的后台参数
        secondParamsKey:React.PropTypes.string,//第二层节点的后台参数中传递一级节点value值的参数名称
        thirdUrl:React.PropTypes.string,//第三层节点的后台地址，
        thirdParams:React.PropTypes.object,//第三层节点的后台参数
        thirdParamsKey:React.PropTypes.string,//第三层节点的后台参数中传递二级节点value值的参数名称
        hotTitle:React.PropTypes.string,//热门选择标题
        hotData:React.PropTypes.array,//热门选择的数据
    },
    getDefaultProps:function() {
        return{
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
            min:null,
            max:null,
            onClick:null,
            //其他属性
            multiple:false,
            valueField:"value",
            textField:"text",
            url:null,
            params:null,
            backSource:"data",
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
        };
    },
    getInitialState:function() {
        var text=this.props.text;
        if(this.props.type.indexOf("date")>-1||this.props.type.indexOf("time")>-1) {
            text = this.props.value;
        }
        return {
            value:this.props.value,
            text: text,
            hide:this.props.hide,
            readonly:this.props.readonly,
            required:this.props.required,
            data:this.props.data,
            params:this.props.params,
            url:this.props.url,

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
            value: nextProps.value,
            text:text,
            readonly: nextProps.readonly,
            required:nextProps.required,
            data:nextProps.data,
            params:nextProps.params,
            url:nextProps.url,
            hide:nextProps.hide,


        })
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

    onSelect:function(value,text,name,rowData) {//选中事件
        this.setState({
            value:value,
            text:text,
        });
        if( this.props.onSelect!=null)
        {
            this.props.onSelect(value,text,this.props.name,rowData);
        }
    },
    changeHandler:function(event) {
    },
    getComponentData:function() {//只读属性，获取对应的字段的数据源
        return this.state.data;
    },
    validate:function() {
        return this.refs.combobox.validate();
    },
    renderMuti:function(){//普通下拉框

        var props={...this.props};
        props.value=this.state.value;
        props.text=this.state.text;
        props.hide=this.state.hide;
        props.data=this.state.data;
        props.readonly=this.state.readonly;
        props.params=this.state.params;
        props.url=this.state.url;
        props.data=this.state.data;
        return <MutiText ref="combobox" {...props}  onSelect={this.onSelect}></MutiText>
    },
    renderSelect:function(){//普通下拉框

        var props={...this.props};
        props.value=this.state.value;
        props.text=this.state.text;
        props.hide=this.state.hide;
        props.data=this.state.data;
        props.readonly=this.state.readonly;
        props.params=this.state.params;
        props.url=this.state.url;
        props.data=this.state.data;
        return <Select ref="combobox" {...props}  onSelect={this.onSelect}></Select>
    },
    renderPicker:function(){//下拉面板
        var props={...this.props};
        props.value=this.state.value;
        props.text=this.state.text;
        props.hide=this.state.hide;
        props.data=this.state.data;
        props.readonly=this.state.readonly;
        props.required=this.state.required;
        props.params=this.state.params;
        props.url=this.state.url;
        return    <Picker ref="combobox" {...props} onSelect={this.onSelect}></Picker>
    },
    renderTime:function() {
        var props={...this.props};
        var props={...this.props};
        props.value=this.state.value;
        props.text=this.state.text;
        props.hide=this.state.hide;
        props.data=this.state.data;
        props.readonly=this.state.readonly;

        return <Time ref="combobox" {...props} onSelect={this.onSelect}></Time>
    },
    renderDatePicker:function() {
        var props={...this.props};
        var props={...this.props};
        props.value=this.state.value;
        props.text=this.state.text;
        props.hide=this.state.hide;
        props.readonly=this.state.readonly;
        props.params=this.state.params;
        return <DatePicker ref="combobox" {...props}  onSelect={this.onSelect}></DatePicker>
    },
    renderGridPicker:function() {
        var props={...this.props};
        props.value=this.state.value;
        props.text=this.state.text;
        props.data=this.state.data;
        props.readonly=this.state.readonly;
        props.params=this.state.params;
        return <GridPicker ref="combobox" {...props}  onSelect={this.onSelect}></GridPicker>;
    },
    renderPanelPicker:function() {
        var props={...this.props};
        var props={...this.props};
        props.value=this.state.value;
        props.text=this.state.text;
        props.hide=this.state.hide;
        props.data=this.state.data;
        props.readonly=this.state.readonly;

        return <PanelPicker ref="combobox" {...props} onSelect={this.onSelect}></PanelPicker>;
    },
    render:function() {

        let control = null;
        switch (this.props.type) {
            case "muti":
                control = this.renderMuti();
                break;
            case "select":
                control = this.renderSelect();
                break;
            case "time":
                control = this.renderTime();
                break;
            case "picker":
                control = this.renderPicker();
                break;
            case "gridpicker":
                control = this.renderGridPicker();
                break;
            case "date":
                control = this.renderDatePicker();

                break;
            case "datetime":
                control = this.renderDatePicker();

                break;
            case "daterange":
                control = this.renderDatePicker();


                break;
            case "datetimerange":
                control = this.renderDatePicker();


                break;

            case "panelpicker":
                control = this.renderPanelPicker();

                break;

        }
        return control;







    }
});
module.exports=ComboBox;