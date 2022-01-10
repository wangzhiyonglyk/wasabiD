/**
 * Created by zhiyongwang on 2016-04-26
 * desc:通用下拉日期,时间组件
 * date:2021-05-10 将日期组件全部合并到一个文件夹中，
 * todo 需要继续优化
 */
import React, { Component } from "react";
import Calendar from "./Calendar";
import DateInput from "./DateInput"
import DateRangeInput from "./DateRangeInput"
import DateTime from "./DateTime.jsx";
import DateRange from "./DateRange.jsx";
import DateTimeRange from "./DateTimeRange.jsx";
import Time from "./Time";
import TimeRange from "./TimeRange";
import regs from "../../libs/regs.js";
import validateHoc from "../validateHoc"
import func from "../../libs/func"
import propTypes from "../../propsConfig/propTypes.js";
import dom from "../../libs/dom"
class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = {
      pickerid: func.uuid(),
      oldPropsValue: "",//保留原来的值
      value: "",
      text: "",
    };
    this.getValue = this.getValue.bind(this);
    this.setValue = this.setValue.bind(this);
    this.splitDate = this.splitDate.bind(this);
    this.splitDateTime = this.splitDateTime.bind(this);
    this.showPicker = this.showPicker.bind(this);
    this.hidePicker = this.hidePicker.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onClear = this.onClear.bind(this);
    this.renderDate = this.renderDate.bind(this);
    this.renderDateRange = this.renderDateRange.bind(this);
    this.renderDateTime = this.renderDateTime.bind(this);
    this.renderTime = this.renderTime.bind(this);
    this.renderTimeRange = this.renderTimeRange.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    if (props.value != state.oldPropsValue) {
      return {
        value: props.value,
        oldPropsValue: props.value
      }
    }
    return null;
  }
  componentDidUpdate() {
    //
    dom.scrollVisible(document.getElementById(this.state.pickerid));//上在滚动条的情况下自动止浮
  }
  /**
   * 获取值
   * @returns 
   */
  getValue() {
    let value = this.state.value ? this.state.value : "";
    if (this.props.type == "date" && value && this.props.attachTime) {
      value = value + " " + func.dateformat(new Date(), "HH:mm:ss");
    }
    else if (this.props.type == "time" && value && this.props.attachSecond) {
      value = value.split(":").length == 2 ? value + ":00" : value;
    }
    else if (this.props.type == "timerange" && value && this.props.attachSecond) {
      value = value.split(",");
      value[0] = value[0].split(":").length == 2 ? value[0] + ":00" : value[0];
      value[1] = value[1].split(":").length == 2 ? value[1] + ":59" : value[1];
      value = value.join(",");
    }
    else if (this.props.type == "daterange" && value && this.props.attachTime) {
      value = value.split(",");
      value[0] = value[0] + " 00:00:00";
      value[1] = value[1] + " 23:59:59";
      value = value.join(",");
      console.log("daterange", value)
    }
    else if (this.props.type == "datetimerange" && value && this.props.attachSecond) {
      value = value.split(",");
      value[0] = value[0].split(" ").length == 1 ? value[0] + " 00:00:00" : value[0].split(" ")[1].split(":").length == 2 ? value[0] + ":00" : value[0];
      value[0] = value[1].split(" ").length == 1 ? value[0] + " 23:59:59" : value[1].split(" ")[1].split(":").length == 2 ? value[1] + ":59" : value[1];
      value = value.join(",");
    }
    return value;
  }
  /**
   * 设置值
   * @param {*} value 
   */
  setValue(value) {
    this.setState({
      value: value,
      text: value
    });
    this.props.validate && this.props.validate(value)
  }
  /**
  * 
  * @param {*} value 
  * @param {*} text 
  * @param {*} name 
  */
  onSelect(value, text, name) {
    //选中事件
    //防止异步取值
    this.state.value = value;
    this.setState({
      show:false,
      value: value,
      text: value
    });
    value = this.getValue();//用于添加附加时间
    this.props.onSelect && this.props.onSelect(value, value, this.props.name, null);
  }
  /**
   *清除数据
   */
  onClear() {
    this.setState({
      value: "",
      text: ""
    });
    this.props.onSelect && this.props.onSelect("", "", this.props.name);
  }
  /**
   * 拆分日期格式
   * @param {*} datestr 
   * @returns 
   */
  splitDate(datestr) {
    let returnvalue = {};
    if (regs.datetime.test(datestr)) {
      //有时间
      datestr = datestr.split(" ")[0];
      returnvalue = {
        year: datestr.split("-")[0] * 1,
        month: datestr.split("-")[1] * 1,
        day: datestr.split("-")[2] * 1
      };

    } else if (regs.date.test(datestr)) {//只有日期
      returnvalue = {
        year: datestr.split("-")[0] * 1,
        month: datestr.split("-")[1] * 1,
        day: datestr.split("-")[2] * 1
      };

    }
    return returnvalue
  }
  /**
   * 将日期拆分为年，月，日，时间
   * @param {*} datetime 
   * @returns 
   */
  splitDateTime(datetime) {
    let returnvalue = {};
    if (regs.datetime.test(datetime)) {
      //如果不为空
      var splitdate = datetime.split(" ")[0];
      if (splitdate && splitdate != "") {
        returnvalue = {
          year: splitdate.split("-")[0] * 1,
          month: splitdate.split("-")[1] * 1,
          day: splitdate.split("-")[2] * 1,
          time: datetime.split(" ")[1]
        };

      }
    }
    return returnvalue;
  }
  /**
   * 显示下拉
   * @param {*} e 
   * @returns 
   */
  showPicker(e) {

    //显示选择
    if (this.props.readOnly) {
      //只读不显示
      return;
    } else {
      this.setState({
        show: true
      });



    }
    document.addEventListener("click", this.hidePicker)
  }

  /**
   * 隐藏下拉框
   * @param {*} event 
   */
  hidePicker(event) {
    if (!dom.isDescendant(document.getElementById(this.props.containerid), event.target)) {
      this.setState({
        show: false
      });

      try {

        document.removeEventListener("click", this.hidePicker);
        this.props.validate && this.props.validate(this.state.value);
        //在此处处理失去焦点事件
        this.props.onBlur && this.props.onBlur(this.state.value, this.state.text, this.props.name);
      }
      catch (e) {

      }
    }
  }

  /**
   * 渲染日期
   * @returns 
   */
  renderDate() {
    let dateobj = this.splitDate(this.state.value);
    return (
      <Calendar
        ref='combobox'
        name={this.props.name}
        {...dateobj}
        onSelect={this.onSelect}
      ></Calendar>
    );
  }
  /**
   * 渲染时间
   * @returns 
   */
  renderTime() {
    let hour; let minute;
    if (regs.time.test(this.state.value)) {
      hour = this.state.value.split(":")[0] * 1;
      minute = this.state.value.split(":")[1] * 1;
    }
    return (
      <Time
        ref='combobox'
        name={this.props.name}
        hour={hour}
        minute={minute}
        onSelect={this.onSelect}
        attachSecond={this.props.attachSecond}
      ></Time>
    );
  }

  /**
   * 渲染日期时间
   * @returns 
   */
  renderDateTime() {
    let dateobj = this.splitDateTime(this.state.value);
    dateobj = dateobj || {};
    return (
      <DateTime
        ref='combobox'
        {...dateobj}
        name={this.props.name}
        onSelect={this.onSelect}
      ></DateTime>
    );
  }
  /**
   * 时间范围
   * @returns 
   */
  renderTimeRange() {
    return (
      <TimeRange
        ref='combobox'
        type={this.props.type}
        name={this.props.name}
        value={this.state.value}
        onSelect={this.onSelect}
        attachSecond={this.props.attachSecond}
      ></TimeRange>
    );
  }

  /**
   * 渲染日期范围
   * @returns 
   */
  renderDateRange() {
    var firstDate = null;
    var secondDate = null;
    if (regs.daterange.test(this.state.value)) {
      //传入一到两个值
      var dateArray = this.state.value.split(",");
      if (dateArray.length > 0) {
        firstDate = dateArray[0];
      }
      if (dateArray.length >= 2) {
        secondDate = dateArray[1];
      }
    }
    return (
      <DateRange
        ref='combobox'
        type={this.props.type}
        name={this.props.name}
        firstDate={firstDate}
        secondDate={secondDate}
        onSelect={this.onSelect}
      ></DateRange>
    );
  }
  /**
   * 渲染日期时间范围
   * @returns 
   */
  renderDateTimeRange() {
    var firstDate = null;
    var secondDate = null;
    var firstTime = null;
    var secondTime = null;
    if (regs.datetimerange.test(this.state.value)) {
      //传入一到两个值
      var dateArray = this.state.value.split(",");
      if (dateArray.length > 0) {
        if (dateArray[0].indexOf(" ") > -1) {
          //有时间
          firstDate = dateArray[0].split(" ")[0];
          firstTime = dateArray[0].split(" ")[1];
        } else {
          firstDate = dateArray[0];
        }
      }
      if (dateArray.length >= 2) {
        if (dateArray[1].indexOf(" ") > -1) {
          //有时间
          secondDate = dateArray[1].split(" ")[0];
          secondTime = dateArray[1].split(" ")[1];
        } else {
          secondDate = dateArray[1];
        }
      }
    }
    return (
      <DateTimeRange
        ref='combobox'
        type={this.props.type}
        name={this.props.name}
        firstDate={firstDate}
        firstTime={firstTime}
        secondDate={secondDate}
        secondTime={secondTime}
        onSelect={this.onSelect}
      ></DateTimeRange>
    );
  }

  render() {
    let control = null;
    let controlDropClassName = "";
    let placeholder = this.props.placeholder;
    let { type } = this.props;
    switch (type) {
      case "date":
        control = this.renderDate();
        controlDropClassName = "date";
        placeholder = placeholder || "0000-00-00";
        break;
      case "time":
        control = this.renderTime();
        controlDropClassName = "time";
        placeholder = placeholder || "00:00";
        break;
      case "timerange":
        control = this.renderTimeRange();
        controlDropClassName = "timerange";
        placeholder = placeholder || "00:00,00:00";
        break;
      case "datetime":
        control = this.renderDateTime();
        controlDropClassName = "datetime";
        placeholder = placeholder || "0000-00-00 00:00";
        break;
      case "daterange":
        control = this.renderDateRange();
        controlDropClassName = "daterange";
        placeholder = placeholder || "0000-00-00";
        break;
      case "datetimerange":
        control = this.renderDateTimeRange();
        controlDropClassName = "datetimerange";
        placeholder = placeholder || "0000-00-00 00:00";
        break;
      default:
        control = this.renderDate();
        controlDropClassName = "date";
        placeholder = placeholder || "0000-00-00";
        break;

    }
    let inputprops = {
      type: type,
      title: this.props.title,
      name: this.props.name,
      placeholder:placeholder,
      value: this.state.value || "",
      showPicker: this.showPicker,
      onClear: this.onClear,
      setValue: this.setValue,
      validate: this.props.validate,
    }
    return <div className='combobox' >
      {type.indexOf("range") > -1 ? <DateRangeInput {...inputprops}></DateRangeInput> : <DateInput  {...inputprops}> </DateInput>}
      <div id={this.state.pickerid} className={"dropcontainter " + controlDropClassName + " "}
        style={{ display: this.state.show == true ? "flex" : "none", flexWrap: "wrap" }}>
        {control}
      </div>
      {this.props.children}
    </div>
  }
}
DatePicker.propTypes = propTypes;
DatePicker.defaultProps = { type: "datetime" };
export default validateHoc(DatePicker,"date");
