/**
 * Created by zhiyongwang on 2016-04-05以后.
 * 复选框集合组件
 */
require("../../sass/Base/Form/Check.scss");
let React=require("react");
let unit=require("../../libs/unit.js");
var FetchModel=require("../../model/FetchModel.js");
var validation=require("../Lang/validation.js");
let setStyle=require("../../Mixins/setStyle.js");
var validate=require("../../Mixins/validate.js");
var showUpdate=require("../../Mixins/showUpdate.js");
let CheckBox=React.createClass({
    mixins:[setStyle,validate,showUpdate],
    PropTypes:{
        name:React.PropTypes.string.isRequired,//字段名
        label:React.PropTypes.string,//字段文字说明属性
        width:React.PropTypes.number,//宽度
        height:React.PropTypes.number,//高度
        text:React.PropTypes.string,//默认文本值
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

        min:React.PropTypes.number,//最少选择几个
        max:React.PropTypes.number,//最多选择几个

        //其他属性
        valueField: React.PropTypes.string,//数据字段值名称
        textField:React.PropTypes.string,//数据字段文本名称
        url:React.PropTypes.string,//ajax的后台地址
        params:React.PropTypes.object,//查询参数
        backSource:React.PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
        data:React.PropTypes.array,//自定义数据源
        extraData:React.PropTypes.array,//额外的数据,对url有效
        onSelect: React.PropTypes.func,//选中后的事件，回传，value,与text,data


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
            //其他属性
            valueField:"value",
            textField:"text",
            url:null,
            params:null,
            backSource:"data",
            data:null,
            extraData:null,
            onSelect:null,
        };
    },
    getInitialState:function() {
        var newData=[];var text=this.props.text;
        if(this.props.data instanceof Array)
        {
            for(let i=0;i<this.props.data.length;i++)
            {
                let obj=this.props.data[i];
                obj.text=this.props.data[i][this.props.textField];
                obj.value=this.props.data[i][this.props.valueField];
                if(obj.value==this.props.value)
                {
                    text=obj.text;//根据value赋值
                }
                newData.push(obj);
            }
        }

        return {
            min:this.props.min,
            max:this.props.max,
            params:this.props.params,//参数
            data:newData,
            value:this.props.value,
            text:text,
            ulShow:false,//是否显示下拉选项
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
        if(nextProps.data!=null&&nextProps.data instanceof  Array &&(!nextProps.url||nextProps.url=="")) {
            var newData=[];var text=nextProps.text;
            for(let i=0;i<nextProps.data.length;i++)
            {
                let obj=nextProps.data[i];
                obj.text=nextProps.data[i][this.props.textField];
                obj.value=nextProps.data[i][this.props.valueField];
                if(obj.value==nextProps.value)
                {
                    text=obj.text;//根据value赋值
                }
                newData.push(obj);
            }
            this.setState({
                data:newData,
                min:nextProps.min,
                max:nextProps.max,
                value: nextProps.value,
                text: text,
                readonly:nextProps.readonly,
                required:nextProps.required,
            })
        }
        else {


            if(nextProps.url!=null) {

                if(this.showUpdate(nextProps.params))
                {//如果不相同则更新
                    this.loadData(nextProps.url,nextProps.params);
                }
                else
                {

                }
            }

            this.setState({
                min:nextProps.min,
                max:nextProps.max,
                value: nextProps.value,
                text: nextProps.text,
                params:nextProps.params,
                readonly:nextProps.readonly,
                required:nextProps.required,
            })

        }
    },
    componentWillMount:function() {//如果指定url,先查询数据再绑定
        this.loadData(this.props.url,this.state.params);//查询数据
    },

    loadData:function(url,params) {
        if(url!=null&&url!="")
        {
            if(params==null)
            {
                var fetchmodel=new FetchModel(url,this.loadSuccess);

                unit.fetch.get(fetchmodel);
            }
            else

            {
                var fetchmodel=new FetchModel(url,this.loadSuccess,params);

                unit.fetch.post(fetchmodel);
            }
            console.log("checkbox",fetchmodel);
        }
    },
    loadSuccess:function(data) {//数据加载成功
        var realData=data;
        if(this.props.backSource==null) {
        }
        else {
            realData=unit.getSource(data,this.props.backSource);
        }
        var newData=[];var text=this.state.text;
        for(let i=0;i<realData.length;i++)
        {
            let obj=realData[i];//将所有字段添加进来
            obj.text=realData[i][this.props.textField];
            obj.value=realData[i][this.props.valueField];
            if(obj.value==this.state.value)
            {
                text=obj.text;//根据value赋值
            }
            newData.push(obj);
        }
        if(this.props.extraData==null||this.props.extraData.length==0)
        {
            //没有额外的数据
        }
        else
        {
            //有额外的数据
            for(let i=0;i<this.props.extraData.length;i++)
            {
                let obj={};
                obj.text=this.props.extraData[i][this.props.textField];
                obj.value=this.props.extraData[i][this.props.valueField];
                if(obj.value==this.state.value)
                {
                    text=obj.text;//根据value赋值
                }
                newData.unshift(obj);
            }
        }
        window.localStorage.setItem(this.props.name+'data' ,JSON.stringify(newData));//用于后期获取所有数据

        this.setState({
            data:newData,
            value:this.state.value,
            text:text,
        })
    },
    changeHandler:function(event) {//一害绑定，但不处理
        if(this.state.readonly) {
            event.preventDefault();
        }
    },
    onSelect:function(value,text,data) {//选中事件
        if(this.state.readonly) {
            return ;
        }
        var newvalue="";var newtext="";
        if(!this.state.value||this.state.value=="") {//对异常进行处理
            newvalue=value;
            newtext=text;
        }
        else {
            var oldvalue=","+this.state.value.toString();//加逗号是为了防止判断失误，国为某些可能正好包含在另外一个值中
            var oldtext=","+this.state.text.toString();
            if(oldvalue.indexOf("," +value)>-1) {
                //取消选中
                newvalue=oldvalue.replace("," + value.toString(), "");
                newtext=oldtext.replace("," + text.toString(), "");

            }
            else {//选中
                newvalue=this.state.value+","+value;
                newtext=this.state.text+","+text;
            }
        }
            this.setState({
                value:newvalue,
                text:newtext
            });

        if( this.props.onSelect!=null) {
          this.props.onSelect(newvalue,newtext,this.props.name,data);
        }
    },
    render:function() {
        var size=this.props.onlyline==true?"onlyline":this.props.size;//组件大小
        var componentClassName=  "wasabi-form-group "+size+" "+(this.props.className?this.props.className:"");//组件的基本样式
        var style =this.setStyle("input");//设置样式

        var control=null;
        if(this.state.data instanceof  Array) {
            control= this.state.data.map((child, i)=> {
                var checked=false;
                if((this.state.value!=null&&this.state.value!=undefined)&&((","+this.state.value.toString()).indexOf(","+child[this.props.valueField])>-1))
                {
                    checked=true;
                }
                var props={
                    checked:(checked==true?"checked":null),//是否为选中状态
                    readOnly:this.state.readonly==true?"readonly":null,
                }
             return    <li key={i} >
                <input type="checkbox"  id={"checkbox"+this.props.name+child.value}  value={child.value}
                                   onClick={this.onSelect.bind(this,child.value,child.text,child)}
                                   onChange={this.changeHandler} className="checkbox"  {...props}></input>
                    <label htmlFor={"checkbox"+this.props.name+child.value}{...props}></label>
                 <div  className="checktext">{child.text}</div>
                    </li >
            });

        }
        return (

        <div className={componentClassName+this.state.validateClass} style={style}>
            <label className="wasabi-form-group-label" style={{display:(this.props.label&&this.props.label!="")?"block":"none"}}>{this.props.label}
            </label>
            <div className={ "wasabi-form-group-body"}>
                <ul className="wasabi-checkul">
                    {
                        control
                    }
                </ul>
                <small className={"wasabi-help-block "+this.props.position} style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}>{this.state.helpTip}</small>
            </div>
        </div>

        )

    }

});
module.exports=CheckBox;