/**
 * create by wangzhiyong
 * date:2021-06-12
 * desc:日期范围的输入框再次分离
 */
import React from "react";
import PropTypes from "prop-types";
import DateInput from "./DateInput";
import regs from "../../libs/regs"
class DateRangeInput extends React.Component {
  constructor(props) {
    super(props);
    this.fristinput = React.createRef();
    this.secondinput=React.createRef();
    this.firstValue = "";
    this.secondValue = "";
    this.state = {
      value: "",
      oldPropsValue: null,
    }

    this.setValue = this.setValue.bind(this);
    this.validate = this.validate.bind(this);


  }
  static getDerivedStateFromProps(props, state) {
    if (props.value !==state.oldPropsValue) {//父组件强行更新了            
      return {
        value: props.value || "",
        oldPropsValue: props.value
      }
    }
    return null;
  }
  /**
   * 重构设置值
   * @param {*} index 
   * @param {*} value 
   */
  setValue(index, value) {
    const type = this.props.type === "daterange" ? "date" : this.props.type === "timerange" ? "time" : "datetime";
    if (index == 1) {
      this.firstValue = value;
      if(regs[type].test(this.firstValue)){
        try{
          this.secondinput.current.input.current.focus();
        }
        catch(e){
          console.log(e)
        }
        
      }
    }
    else {
      (this.secondValue = value)
    }
    if (this.props.validate && this.props.validate(this.firstValue + "," + this.secondValue)) {
      this.props.setValue && this.props.setValue(this.firstValue + "," + this.secondValue);
    }
  }
  /**
   * 重构验证
   */
  validate() {
    this.props.validate && this.props.validate(this.firstValue + "," + this.secondValue)
  }
 
  render() {
    const width = this.props.type === "datetimerange" ? 380 : 290;
    const { value } = this.props; const valueArr = value ? value.split(",") : ["", ""];
    const type = this.props.type === "daterange" ? "date" : this.props.type === "timerange" ? "time" : "datetime";
    return <div style={{ position:"relative", display: "flex", width: width }} className="daterangeinput">
      <DateInput ref={this.fristinput} key="1" {...this.props} value={valueArr[0]} type={type} validate={this.validate} setValue={this.setValue.bind(this, 1)}></DateInput>
      <span style={{ lineHeight: "40px", marginRight: 10 }}>至</span>
      <DateInput ref={this.secondinput} key="2" {...this.props} value={valueArr[1]} type={type} validate={this.validate} setValue={this.setValue.bind(this, 2)}></DateInput>
    </div>

  }
}
DateRangeInput.propTypes = {
  onClear: PropTypes.func,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
}


export default DateRangeInput;