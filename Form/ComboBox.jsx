/**
 * Created by zhiyongwang on 2016-04-26
 * desc:下拉框容器
 *
 */


import React, { Component } from "react";
import PropTypes from "prop-types";
import Time from "./Time.jsx";
import  DatePicker from "./DatePicker.jsx";
import  Picker from "./Picker.jsx";
import Select from "./Select.jsx";
import  MutiText from "./MutiText.jsx";

import  TreePicker from "./TreePicker.jsx";
import props from "./config/propType.js";
import config from "./config/comboboxConfig.js";
import defaultProps from  "./config/defaultProps.js";
import ("../Sass/Form/ComboBox.css");
class  ComboBox extends Component{
    
  constructor(props)
  {
      super(props);
      this.state={

      }
  }

    splitDate(splitdate) {//拆分日期格式
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
          return   null;
        }

    }

    validate() {//用于Form调用验证
        return this.refs.combobox.validate();
    }
    getValue()
    {//用于调用获取值
        return this.refs.combobox.getValue();
    }
    setValue(value){//用于调用设置值
         this.refs.combobox.setValue(value);
    }
    changeHandler(event) {
    }

    renderMuti(){//普通下拉框

        var props={...this.props};
       
        return <MutiText ref="combobox" {...props}  ></MutiText>
    }
    renderSelect(){//普通下拉框

        var props={...this.props};
       
        return <Select ref="combobox" {...this.props}  ></Select>
    }
    renderPicker(){//下拉面板
     
        return    <Picker ref="combobox"{...this.props}></Picker>
    }
    renderTime() {
       

        return <Time ref="combobox" {...this.props}></Time>
    }
    renderDatePicker() {
    
        return <DatePicker ref="combobox" {...this.props}></DatePicker>
    }
    renderTreePicker() {
       
        return <TreePicker ref="combobox" {...this.props}></TreePicker>;
    }

    render() {

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
}

ComboBox.propTypes= Object.assign({type:PropTypes.oneOf(config)},props);
ComboBox.defaultProps =   defaultProps;
export default ComboBox;