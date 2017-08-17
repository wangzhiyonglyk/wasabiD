/**
 * Created by zhiyongwang
 * date:2016-04-05后开始独立改造
 * 单选框集合组件
 */
require("../Sass/Form/Check.scss");
let React=require("react");
let unit=require("../libs/unit.js");
var FetchModel=require("../Model/FetchModel.js");
var validation=require("../Lang/validation.js");
let setStyle=require("../Mixins/setStyle.js");
var validate=require("../Mixins/validate.js");
var showUpdate=require("../Mixins/showUpdate.js");
var Label=require("../Unit/Label.jsx");
var Message=require("../Unit/Message.jsx");
import props from "./config/props.js";
import defaultProps from "./config/defaultProps.js";
let Radio=React.createClass({
    mixins:[setStyle,validate,showUpdate],
    PropTypes:props,
    getDefaultProps:function() {
        return defaultProps;
    },
    getInitialState:function() {
        var newData=[];var text=this.props.text;
        if(this.props.data&&this.props.data instanceof  Array) {
            for (let i = 0; i < this.props.data.length; i++) {
                let obj = this.props.data[i];
                obj.text = this.props.data[i][this.props.textField];
                obj.value = this.props.data[i][this.props.valueField];
                if (obj.value == this.props.value) {
                    text = obj.text;//根据value赋值
                }
                newData.push(obj);
            }
        }
        return {
            hide:this.props.hide,
            params:unit.clone( this.props.params),//参数
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
        var newData=[];var text=nextProps.text;
        if(nextProps.data!=null&&nextProps.data instanceof  Array &&(!nextProps.url||nextProps.url=="")) {

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
                hide:nextProps.hide,
                data:newData,
                value:nextProps.value,
                text: text,
                params:unit.clone( nextProps.params),
                readonly:nextProps.readonly,
                required:nextProps.required,
                validateClass:"",//重置验证样式
                helpTip:validation["required"],//提示信息
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
                hide:nextProps.hide,
                value:nextProps.value,
                text: text,
                params:unit.clone( nextProps.params),
                readonly:nextProps.readonly,
                required:nextProps.required,
                validateClass:"",//重置验证样式
                helpTip:validation["required"],//提示信息
            })

        }
    },
    componentWillMount:function() {//如果指定url,先查询数据再绑定
        this.loadData(this.props.url,this.state.params);//查询数据
    },
        setValue(value) {
        let text = "";
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].value == value) {
                text = item;
                break;
            }
        }

        if (text) {
            this.setState({
                value: value,
                text: text
            })
        }

    },
    getValue() {
        return this.state.value;

    },

    loadData:function(url,params) {
        if(url!=null&&url!="")
        {
            if(params==null)
            {
                var fetchmodel=new FetchModel(url,this.loadSuccess,null,this.loadError)
                unit.fetch.get(fetchmodel);
            }
            else

            {
                var fetchmodel=new FetchModel(url,this.loadSuccess,params,this.loadError);
                unit.fetch.post(fetchmodel);
            }
            console.log("radio",fetchmodel);
        }
    },
    loadSuccess:function(data) {//数据加载成功
        var realData=data;
        if(this.props.dataSource==null) {
        }
        else {
            realData=unit.getSource(data,this.props.dataSource);
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
        console.log("radio-error",errorCode,message);
        Message. error(message);
    },
    changeHandler:function(event) {//一害绑定，但不处理

    },
    onSelect:function(value,text,data) {//选中事件
        if(!this.state.readonly&&(this.props.onBeforeSelect&&value!=this.state.value&&this.props.onBeforeSelect(value,text,data)||!this.props.onBeforeSelect)) {
            this.setState({
                value: value,
                text: text,
            });
            this.validate(value);
            if (this.props.onChange) {
                this.props.onChange(value, text, this.props.name, data);
            }
            if (this.props.onSelect != null) {
                this.props.onSelect(value, text, this.props.name, data);
            }
        }
    },
    render:function() {
        var inputType = "text";
        if (this.props.type == "password") {
            inputType = "password";
        }
        var size = this.props.onlyline == true ? "onlyline" : this.props.size;//组件大小
        var componentClassName = "wasabi-form-group " + size + " " + (this.props.className ? this.props.className : "");//组件的基本样式
        var style = this.setStyle("input");//设置样式
        var controlStyle=this.props.controlStyle?this.props.controlStyle:{};
        controlStyle.display = this.state.hide == true ? "none" : "block";

        var control = null;
        let className = "wasabi-radio-btn " + (this.state.readonly ? " readonly" : "");
        if (this.state.data) {
            control = this.state.data.map((child, i)=> {
                var textFeild = child.text;
                var hideComponent = null;
                if (this.props.hideComponents instanceof Array && this.props.hideComponents[i]) {
                    hideComponent = this.props.hideComponents[i];

                }
                return (
                    <li key={i}>
                        <div className={className+((this.state.value==child.value)?" checkedRadio":"")}
                             onClick={this.onSelect.bind(this,child.value,child.text,child)}><i>
                            <input type="radio" name={this.props.name}
                                   id={this.props.name+child.value}
                                   value={child.value}
                                   onChange={this.changeHandler}>
                            </input>
                        </i></div>
                        <div className="radiotext" onClick={this.onSelect.bind(this,child.value,child.text,child)}>{textFeild}
                            <div
                                style={{display:((this.state.value==child.value)?" inline-block":"none")}}>{hideComponent}</div>
                        </div>
                    </li>
                );
            })
        }
        return (
            <div className={componentClassName+this.state.validateClass} style={ controlStyle}>
                <Label name={this.props.label} hide={this.state.hide} required={this.state.required}></Label>
                <div className={ "wasabi-form-group-body"} style={{width:!this.props.label?"100%":null}}>
                    <ul className="wasabi-checkul">
                        {
                            control
                        }
                    </ul>
                    <small className={"wasabi-help-block "}
                           style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}><div className="text">{this.state.helpTip}</div></small>
                </div>
            </div>

        )
    }

});
module.exports=Radio;