/*
 create by wangzy
 date:2016-07-04
 desc:列表下拉选择
 */
let React=require("react");

let SearchBox=require("../Form/SearchBox.jsx");
let DataGrid=require("../Data/DataGrid.jsx");
var unit=require("../../libs/unit.js");
var validation=require("../Lang/validation.js");
let setStyle=require("../../Mixins/setStyle.js");
var validate=require("../../Mixins/validate.js");
var showUpdate=require("../../Mixins/showUpdate.js");
var shouldComponentUpdate=require("../../Mixins/shouldComponentUpdate.js");
var Label=require("../Unit/Label.jsx");
let GridPicker=React.createClass({
    mixins:[setStyle,validate,showUpdate,shouldComponentUpdate],
    propTypes: {
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
            "large",
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
        url:React.PropTypes.string,//ajax的后台地址
        params:React.PropTypes.object,//查询参数
        backSource:React.PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
        data:React.PropTypes.array,//自定义数据源
        onSelect: React.PropTypes.func,//选中后的事件，回传，value,与text,data

        //grid
        tableName:React.PropTypes.string,//表格名称,方便父组件通过refs引用
        selectAble:React.PropTypes.bool,// 是否显示选择，默认值 false
        detailAble:React.PropTypes.bool,//是否显示详情,默认值 false
        borderAble:React.PropTypes.bool,//是否显示表格边框，默认值 false
        pagination:React.PropTypes.bool,//是否显示详情,默认值 false
        pageIndex:React.PropTypes.number,//当前页号
        pageSize:React.PropTypes.number,//分页大小，默认20
        sortName:React.PropTypes.string,//排序字段,
        sortOrder:React.PropTypes.string,//排序方式,默认asc,
        keyField:React.PropTypes.string.isRequired,//关键字段,这里必填写项
        headers:React.PropTypes.array.isRequired,//表头设置
        total:React.PropTypes.number,// 总条目数，默认为 0
        updateHandler:React.PropTypes.func,//页面更新事件
        detailHandler:React.PropTypes.func,//父组件，处理详情的函数，父组件一定要有返回值
        totalSource:React.PropTypes.string,//ajax的返回的数据源中哪个属性作为总记录数,为null时直接后台返回的数据中的total
        onDoubleClick:React.PropTypes.func,//双击事件
        selectChecked:React.PropTypes.bool,//选择的时候是否代码选中
        onChecked:React.PropTypes.func,//表格中有一行被选中
    },
    getDefaultProps:function() {
        return {
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
            valueField:"value",
            textField:"text",
            url:null,
            params:null,
            backSource:"data",
            data:null,
            onSelect:null,
            //其他属性
            keyField:"id",
            pagination:false,
            selectAble:false,
            detailAble:false,
            borderAble:false,

        }
    },
    getInitialState:function() {
        return {
            hide:this.props.hide,
            params:this.props.params,//默认筛选条件
            url:null,//默认为空,表示不查询,后期再更新,
            show:false,//
            value:this.props.value,
            text:this.props.text,
            readonly:this.props.readonly,
            data:this.props.data,
            //验证
            required:this.props.required,
            validateClass:"",//验证的样式
            helpShow:"none",//提示信息是否显示
            helpTip:validation["required"],//提示信息
            invalidTip:"",
        }
    },
    componentWillReceiveProps:function(nextProps) {
        //只更新不查询,注意了
        if(nextProps.data!=null&&nextProps.data instanceof  Array &&(!nextProps.url||nextProps.url=="")) {//没有传url
            this.setState({
                hide:nextProps.hide,
                data: nextProps.data,
                value:nextProps.value,
                text:nextProps.text,
                readonly: nextProps.readonly,
                required: nextProps.required,
                params:nextProps.params,
                validateClass:"",//重置验证样式
            })

        }
        else {
            this.setState({
                hide:nextProps.hide,
                value:nextProps.value,
                text: nextProps.text,
                readonly: nextProps.readonly,
                required: nextProps.required,
                params:nextProps.params,
                validateClass:"",//重置验证样式
            })
        }

    },
    mouseOutHandler:function(event) {//鼠标移开时隐藏下拉
        var parentE=event.relatedTarget;//相关节点
        while (parentE&&parentE.nodeName!="BODY")
        {
            if(parentE.className.indexOf("dropcontainter")>-1)
            {
                break;
            }
            parentE=parentE.parentElement;
        }

        if(parentE==undefined||parentE==null||parentE.nodeName=="BODY")
        {
            setTimeout(()=>
            {
                this.setState({
                    show:false,
                });
            },200);

        }

    },
    changeHandler:function(event) {
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
    },
    onSearch:function(params) {
        var newparams=this.state.params;
        if(!newparams)
        {
            newparams={};
        }
        for(var v in params)
        {
            newparams[v]=params[v];
        }

        this.setState({
            params: newparams,
            url:this.props.url,//查询的时候再赋值
        });
    },
    onSelect:function(rowIndex,rowData) {
        if(this.props.onSelect!=null)
        {
            if(this.props.valueField&&this.props.textField)
            {

                this.props.onSelect(rowData[this.props.valueField],rowData[this.props.textField],this.props.name,rowData);
            }
        }
        this.validate(rowData[this.props.valueField]);
        this.setState({
            value: rowData[this.props.valueField],
            text: rowData[this.props.textField],
            show: !this.state.show
        });
    },
    clearHandler:function()
    {//清除数据
        console.log("test");
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
    render:function() {
        var size=this.props.onlyline==true?"onlyline":this.props.size;//组件大小
        var componentClassName=  "wasabi-form-group "+size+" "+(this.props.className?this.props.className:"");//组件的基本样式
        var style =this.setStyle("input");//设置样式
        let inputProps=
        {
            readOnly:this.state.readonly==true?"readonly":null,
            style:style,
            name:this.props.name,
            placeholder:(this.props.placeholder===""||this.props.placeholder==null)?this.state.required?"必填项":"":this.props.placeholder,
            className:"wasabi-form-control  "+(this.props.className!=null?this.props.className:"")

        }//文本框的属性
        let props= {...this.props};
        props.onClick = this.onSelect;//生定向，但是仍然保留原来的属性
        props.width=410;
        props.url=this.state.url;
        props.data=this.state.data;
        return<div className={componentClassName+this.state.validateClass} style={style}>
            <Label name={this.props.label} hide={this.state.hide} required={this.state.required}></Label>
            <div className={ "wasabi-form-group-body"}>
                <div className="combobox"  style={{display:this.props.hide==true?"none":"block"}}   >
                    <i className={"picker-clear"} onClick={this.clearHandler} style={{display:this.state.readonly?"none":(this.state.value==""||!this.state.value)?"none":"inline"}}></i>
                    <i className={"pickericon"} onClick={this.showPicker}></i>
                    <input type="text" {...inputProps}  value={this.state.text}  onClick={this.showPicker} onChange={this.changeHandler}     />
                    <div className={"dropcontainter gridpicker"+this.props.position} style={{height:this.props.height,display:this.state.show==true?"block":"none"}} onMouseOut={this.mouseOutHandler} >
                        <div>
                            <SearchBox name={this.props.name} valueField={this.props.valueField} textField={this.props.textField} onSearch={this.onSearch}></SearchBox>
                            <DataGrid {...props} height={398} params={this.state.params}></DataGrid>
                        </div>

                    </div>
                </div>

                <small className={"wasabi-help-block "+this.props.position} style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}>{this.state.helpTip}</small>
            </div>
        </div>

    }
});
module .exports=GridPicker;