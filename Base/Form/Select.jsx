/**
 * Created by zhiyongwang
 * date:2016-04-05后开始独立改造
 * 下拉框
 */
require("../../sass/Base/Form/Select.scss");
let React=require("react");
let unit=require("../../libs/unit.js");
var FetchModel=require("../../model/FetchModel.js");
var Message=require("../unit/Message.jsx");
var validation=require("../Lang/validation.js");
let setStyle=require("../../Mixins/setStyle.js");
var validate=require("../../Mixins/validate.js");
var showUpdate=require("../../Mixins/showUpdate.js");
var shouldComponentUpdate=require("../../Mixins/shouldComponentUpdate.js");
var Label=require("../Unit/Label.jsx");
let Select=React.createClass({
    mixins:[setStyle,validate,showUpdate,shouldComponentUpdate],
    PropTypes:{

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
        min:React.PropTypes.number,//最少选择几个
        max:React.PropTypes.number,//最多选择几个
        onClick: React.PropTypes.func,//自定义单击事件，这样就可以将普通下拉框组合其他组件

        //其他属性
        multiple:React.PropTypes.bool,//是否允许多选
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

            };
        },
    getInitialState:function() {
        var newData=[];var text=this.props.text;
        if(this.props.data&&this.props.data instanceof  Array)
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
                hide:this.props.hide,
                params:unit.clone(this.props.params),//参数
                data:newData,
                value:this.props.value,
                text:text,
                ulShow:false,//是否显示下拉选项
                multiple:this.props.multiple,
                min:this.props.min,
                max:this.props.max,
                readonly:this.props.readonly,

                //验证
                required:this.props.required,
                validateClass:"",//验证的样式
                helpShow:"none",//提示信息是否显示
                helpTip:validation["required"],//提示信息
                invalidTip:"",
                filterValue:"",//筛选框的值
            }
        },
    componentWillReceiveProps:function(nextProps) {
        /*
        this.isChange :代表自身发生了改变,防止父组件没有绑定value,text,而导致无法选择
         */
        var text = nextProps.text;
        var newData = null;
        if(nextProps.data!=null&&nextProps.data instanceof  Array &&(!nextProps.url||nextProps.url=="")) {
            newData=[];
              //因为这里统一将数据进行了改造,所以这里要重新处理一下
            for (let i = 0; i < nextProps.data.length; i++) {
                let obj = nextProps.data[i];
                obj.text = nextProps.data[i][this.props.textField];
                obj.value = nextProps.data[i][this.props.valueField];
                if (obj.value == nextProps.value) {
                    text = obj.text;//根据value赋值
                }
                newData.push(obj);
            }
            this.setState({
                hide:nextProps.hide,
                value:this.isChange?this.state.value: nextProps.value,
                text: this.isChange?this.state.text:text,
                data: newData,
                params:unit.clone( nextProps.params),
                multiple: nextProps.multiple,
                min: nextProps.min,
                max: nextProps.max,
                readonly: nextProps.readonly,
                required: nextProps.required,
                validateClass:"",//重置验证样式
            })
        }
        else {
            if (this.showUpdate(nextProps.params)) {//如果不相同则更新
                this.loadData(this.props.url, nextProps.params);
            }
            else {

            }
            this.setState({
                value:this.isChange?this.state.value: nextProps.value,
                text: this.isChange?this.state.text:text,
                multiple: nextProps.multiple,
                min: nextProps.min,
                max: nextProps.max,
                params:unit.clone( nextProps.params),
                readonly: nextProps.readonly,
                required: nextProps.required,
                validateClass:"",//重置验证样式
            })
        }
        this.isChange=false;//重置
    },
    componentWillMount:function() {//如果指定url,先查询数据再绑定
     this.loadData(this.props.url,this.state.params);//查询数据
    },
    componentDidUpdate:function() {
      if(this.isChange==true)
      {
          if( this.props.onSelect!=null)
          {
              this.props.onSelect(this.state.value,this.state.text,this.props.name,this.rowData);
          }
      }
    },
    mouseOutHandler:function(event) {//鼠标移开时隐藏下拉
        var parentE=event.relatedTarget;//相关节点
        while (parentE&&parentE.nodeName!="BODY")
        {
            if(parentE.className.indexOf("nice-select")>-1)
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
                    ulShow:false,
                });
            },200);

        }

    },
    loadData:function(url,params) {
        if(url!=null&&url!="")
        {
            if(params==null)
            {
                var fetchmodel=new FetchModel(url,this.loadSuccess,null,this.loadError);
                unit.fetch.get(fetchmodel);
            }
            else

            {
                var fetchmodel=new FetchModel(url,this.loadSuccess,params,this.loadError);
                unit.fetch.post(fetchmodel);
            }
        console.log("select",fetchmodel);
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
    loadError:function(errorCode,message) {//查询失败
        Message. error(message);
    },
    showItem:function() {//显示下拉选项
        if (this.state.readonly) {
            return;
        }
        if (this.props.onClick != null) {
            this.props.onClick();
        }
        this.setState({
            ulShow: true
        })
    },
    changeHandler:function(event) {
    },
    onSelect:function(value,text,rowData) {//选中事件
          this.isChange=true;//代表自身发生了改变,防止父组件没有绑定value,text,而导致无法选择的结果
        this.rowData=rowData;
        if(value==undefined)
        {
            console.error("绑定的valueField没有")
        }
        if(text==undefined)
        {
            console.error("绑定的textField没有");
        }
        if(this.state.multiple) {
            var newvalue = "";
            var newtext = "";
            var oldvalue = "," + this.state.value.toString();//加逗号是为了防止判断失误，国为某些可能正好包含在另外一个值中
            var oldtext = "," + this.state.text.toString();
            if (oldvalue.indexOf("," + value.toString()) > -1) {//取消选中
                newvalue = oldvalue.replace("," + value.toString(), "");
                newtext = oldtext.replace("," + text.toString(), "");
            }
            else {//选中
                newvalue = this.state.value + "," + value;
                newtext = this.state.text + "," + text;
            }
            this.setState({
                value:newvalue,
                text:newtext,
            });
        }
        else
        {
            this.setState({
                ulShow:false,
                value:value,
                text:text,
            });
        }
        this.validate(value);

    },
    getComponentData:function() {//只读属性，获取当前下拉的数据源
        return this.state.data;
    },
    filterChangeHandler:function(event) {//筛选查询
        let filterData=[];
        this.state.data.filter((item,index)=>{
            if(item.text.toLowerCase().indexOf(event.target.value.toLowerCase())>-1)
            {
                filterData.unshift(item);
            }
            else
            {
                filterData.push((item));
            }
        })
        this.setState({
            data:filterData,
            filterValue:event.target.value,
        })

    },
    render:function() {
        var size=this.props.onlyline==true?"onlyline":this.props.size;//组件大小
        var componentClassName=  "wasabi-form-group "+size+" "+(this.props.className?this.props.className:"");//组件的基本样式
        var style =this.setStyle("input");//设置样式
        let inputProps=
        {
            readOnly:this.state.readonly==true?"readonly":null,
            style:this.props.style,
            name:this.props.name,
            placeholder:(this.props.placeholder===""||this.props.placeholder==null)?this.state.required?"必填项":"":this.props.placeholder,
            className:"wasabi-form-control  "+(this.props.className!=null?this.props.className:"")

        }//文本框的属性
        var control=null;
        if(this.state.data&&this.state.data.length>0) {
            control = <ul style={{display:this.state.ulShow==true?"block":"none"}} >
                <li key="searchli"  className="searchli" style={{display:this.state.data.length>8?"block":"none"}}><div   className="search" style={{width:this.props.width}}>
                    <input type="text" placeholder={this.props.placeholder}
                            value={this.state.filterValue} onChange={this.filterChangeHandler } />
                    <div className="icon" ></div>
                </div></li>
                {
                    this.state.data.map((child, i)=> {
                        var checked = false;
                        if ((this.state.value != null && this.state.value != undefined && this.state.value != ""&&child.value!="") && (("," + this.state.value.toString()).indexOf("," + child.value) > -1)) {
                            checked = true;
                        }
                        else if (this.state.value == "" && child.value == "") {
                            checked = true;
                        }
                        return (
                            <li key={"li"+i} className={checked==true?"active":""}
                                onClick={this.onSelect.bind(this, child.value, child.text,child)}>{child.text}</li>
                        )
                    })

                }
            </ul>;
        }

        return (
        <div className={componentClassName+this.state.validateClass} style={style} >
            <Label name={this.props.label} hide={this.state.hide} required={this.state.required}></Label>
            <div className={ "wasabi-form-group-body"}>
                <div className={"nice-select "} style={style}  onMouseOut={this.mouseOutHandler}   >
                    <i className={"icon "} onClick={this.showItem}></i>
                    <input type="text" {...inputProps} value={this.state.text}    onChange={this.changeHandler}  />

                    {
                        control
                    }
                </div>
                <small className={"wasabi-help-block "+this.props.position} style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}>{this.state.helpTip}</small>
            </div>
        </div>

        );

}

});
module.exports=Select;