/*
 create by wangzy
 date:2016-07-04
 desc:列表下拉选择
 */
let React=require("react");

let SearchBox=require("./SearchBox.jsx");
let Tree=require("../Data/Tree.jsx");
var unit=require("../libs/unit.js");
var validation=require("../Lang/validation.js");
let setStyle=require("../Mixins/setStyle.js");
var validate=require("../Mixins/validate.js");
var showUpdate=require("../Mixins/showUpdate.js");

var Label=require("../Unit/Label.jsx");
var ClickAway=require("../Unit/ClickAway.js");
import props from "./config/props.js";
import defaultProps from "./config/defaultProps.js";
let TreePicker=React.createClass({
    mixins:[setStyle,validate,showUpdate,ClickAway],
    propTypes: props,
    getDefaultProps:function() {
        return defaultProps;
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
        /*
         this.isChange :代表自身发生了改变,防止父组件没有绑定value,text,而导致无法选择
         */
        this.isChange=false;//重置
        var value=this.isChange?this.state.value: nextProps.value;
        var text = this.isChange?this.state.text: nextProps.text;
        this.setState({
            hide:nextProps.hide,
            value:value,
            text:text,
            url:nextProps.url,
            data: nextProps.data,
            params:unit.clone( nextProps.params),
            readonly: nextProps.readonly,
            required: nextProps.required,
            validateClass:"",//重置验证样式
            helpTip:validation["required"],//提示信息
        })
    },
    componentDidUpdate:function() {
        if(this.isChange==true)
        {//说明已经改变了,回传给父组件
            if( this.props.onSelect!=null)
            {
                this.props.onSelect(this.state.value,this.state.text,this.props.name,this.property);
            }
        }
    },
    componentDidMount:function(){

        this.registerClickAway(this.hidePicker, this.refs.picker);//注册全局单击事件
    },
    changeHandler:function(event) {
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
    onBlur:function () {
        this.refs.label.hideHelp();//隐藏帮助信息
    },
    showPicker:function(type) {//显示选择
        if (this.state.readonly) {
            //只读不显示
            return;
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
    onSelect:function(value,text,name,property) {
        this.isChange=true;//代表自身发生了改变,防止父组件没有绑定value,text的状态值,而导致无法选择的结果
        this.property=property;//临时保存起来
        if(value==undefined)
        {
            console.error("绑定的valueField没有")
        }
        if(text==undefined)
        {
            console.error("绑定的textField没有");
        }
        this.validate(value);
        this.setState({
            value: value,
            text: text,
            show: !this.state.show
        });

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
    render:function() {

        var size=this.props.onlyline==true?"onlyline":this.props.size;//组件大小
        var componentClassName=  "wasabi-form-group "+size;//组件的基本样式
        var style =this.setStyle("input");//设置样式
        var controlStyle=this.props.controlStyle?this.props.controlStyle:{};
        controlStyle.display = this.state.hide == true ? "none" : "block";
        let inputProps=
            {
                readOnly:this.state.readonly==true?"readonly":null,
                style:style,
                name:this.props.name,
                placeholder:(this.props.placeholder===""||this.props.placeholder==null)?this.state.required?"必填项":"":this.props.placeholder,
                className:"wasabi-form-control  "+(this.props.className!=null?this.props.className:""),
                title:this.props.title,

            }//文本框的属性


        return <div className={componentClassName+this.state.validateClass}  ref="picker" style={ controlStyle}>
            <Label name={this.props.label} ref="label" hide={this.state.hide} required={this.state.required}></Label>
            <div className={ "wasabi-form-group-body"} style={{width:!this.props.label?"100%":null}}>
                <div className="combobox"  style={{display:this.props.hide==true?"none":"block"}}   >
                    <i className={"picker-clear "} onClick={this.clearHandler} style={{display:this.state.readonly?"none":(this.state.value==""||!this.state.value)?"none":"inline"}}></i>
                    <i className={"pickericon  " +(this.state.show?"rotate":"")} onClick={this.showPicker.bind(this,1)}></i>
                    <input type="text" {...inputProps}  value={this.state.text} onBlur={this.onBlur}   onClick={this.showPicker.bind(this,2)} onChange={this.changeHandler}     />
                    <div className={"dropcontainter treepicker  "+this.props.position} style={{height:this.props.height,display:this.state.show==true?"block":"none"}}  >
                        <Tree
                            name={this.props.name}  value={this.state.value} text={this.state.text}
                            valueField={this.props.valueField} textField={this.props.textField} dataSource={this.props.dataSource}
                            url={this.props.url}  params={this.props.params} data={this.state.data} onSelect={this.onSelect}
                        ></Tree>
                    </div>
                </div>

                <small className={"wasabi-help-block "+this.props.position} style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}>{this.state.helpTip}</small>
            </div>
        </div>

    }
});
module .exports=TreePicker;