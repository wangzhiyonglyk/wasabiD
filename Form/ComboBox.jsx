/**
 * Created by zhiyongwang on 2016-04-26
 * desc:下拉框容器
 *
 */
require("../Sass/Form/ComboBox.scss");
let React=require("react");
var unit=require("../libs/unit.js");
let Time=require("./Time.jsx");
let DatePicker=require("./DatePicker.jsx");
let Picker=require("./Picker.jsx");
let Select=require("./Select.jsx");
let MutiText=require("./MutiText.jsx");

let TreePicker=require("./TreePicker.jsx");
import props from "./config/props.js";
import config from "./config/comboboxConfig.js";
import defaultProps from  "./config/defaultProps.js";
let ComboBox=React.createClass({
    PropTypes: Object.assign({type:React.PropTypes.oneOf(config)},props),
    getDefaultProps:function() {
        defaultProps.type="select";
        return defaultProps;
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

    validate:function() {//用于Form调用验证
        return this.refs.combobox.validate();
    },
    getValue:function()
    {//用于调用获取值
        return this.refs.combobox.getValue();
    },
    setValue(value){//用于调用设置值
         this.refs.combobox.setValue(value);
    },
    changeHandler:function(event) {
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
    renderTreePicker:function() {
        var props={...this.props};
        props.value=this.state.value;
        props.text=this.state.text;
        props.data=this.state.data;
        props.readonly=this.state.readonly;
        props.params=this.state.params;
        return <TreePicker ref="combobox" {...props}  onSelect={this.onSelect}></TreePicker>;
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
            case "treepicker":
                control = this.renderTreePicker();
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