/*
 create by wangzy
 date:2016-06-12
 desc:日期范围选择控件
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import DateD from "./DateD.jsx";
import Time from "./Time.jsx";
import Button from "../Buttons/Button.jsx";

import validate from "../Mixins/validate.js";
class DateTimeRange extends Component {

    constructor(props) {
        super(props);
        this.state = this.setDefaultState(this.props);

    }

    componentWillReceiveProps(nextProps) {

        var newstate = this.setDefaultState(nextProps);
        this.setState(newstate);

    }
    setValue(value) {
        if (this.validate(value)) {
            this.setState({
                value: value
            })
        }
    }
    getValue() {

        return this.state.value;
    }
    validate(value) {

        validate.call(this, value)
    }
    setDefaultState(props) {
        //先设置默认值的，再判断用户是否有输入值
        var regs = /^(\d{4})-(\d{2})-(\d{2})$/;
        var newDate = new Date();
        var first_year = newDate.getFullYear();
        var first_month = newDate.getMonth() + 1;
        var first_day = "";
        let first_min = ""; let first_max = "";
        let second_min = ""; let second_max = "";

        if (props.firstDate && regs.test(props.firstDate)) {//输入了值
            first_year = props.firstDate.split("-")[0] * 1;
            first_month = props.firstDate.split("-")[1] * 1;
            first_day = props.firstDate.split("-")[2] * 1;
        }
        //设置第二日期的默认值
        var second_year = first_year; var second_month; var second_day = "";
        second_month = parseInt(first_month) + 1;
        if (second_month > 12) {
            second_year++;
            second_month = 1;
        }
        else {

        }
        if (props.secondDate && regs.test(props.secondDate)) {//输入了值
            if (props.secondDate.split("-")[0] * 1 > first_year || props.secondDate.split("-")[1] * 1 > first_month) {//不相等才赋值
                second_year = props.secondDate.split("-")[0] * 1;
                second_month = props.secondDate.split("-")[1] * 1;
                second_max = second_day = props.secondDate.split("-")[2] * 1;
                second_min = 1;
                first_min = first_day;
                first_max = 31;
            }
            else if (props.secondDate.split("-")[0] * 1 == first_year || props.secondDate.split("-")[1] * 1 == first_month) {//不相等才赋值

                first_max = props.secondDate.split("-")[2] * 1;
                first_min = first_day;
            }
        }
        else {//第二日期没有值
            first_min = first_max = first_day;
        }
        return {
            first_year: first_year,
            first_month: first_month,
            first_day: first_day,
            first_time: props.firstTime,
            first_min: first_min,
            first_max: first_max,

            second_year: second_year,
            second_month: second_month,
            second_day: second_day,
            second_time: props.secondTime,
            second_min: second_min,
            second_max: second_max,
        }
    }
    firstMonthHandler(year, month) {
        this.setState({
            first_year: year,
            first_month: month,
            first_day: "",
            first_min: "",
            first_max: "",
        })
    }
    secondMonthHandler(year, month) {
        this.setState({
            second_year: year,
            second_month: month,
            second_day: "",
            second_min: "",
            second_max: "",
        })
    }

    firstHandler(value) {//开始日期选择事件
        if (value && value.indexOf(" ") > -1) {//有时间
            value = value.split(" ")[0];
        }
        var min_day = this.state.first_min;
        var max_day = this.state.first_max;
        /*单向选择判断*/
        if ((!min_day && !max_day) || min_day != max_day) {
            //都为空，或者已经选择过了，重新选择
            min_day = value.split("-")[2] * 1;
            max_day = value.split("-")[2] * 1;
        }
        else if (min_day == max_day) {
            //已经选择了一个
            if (min_day < value.split("-")[2] * 1) {
                //比最小值大
                max_day = value.split("-")[2] * 1;
            }
            else {//比最小值小，调换
                max_day = min_day;
                min_day = value.split("-")[2] * 1;

            }
        }
        /*单向选择判断*/

        /*判断与第二个日期的复合情况*/
        var second_min = this.state.second_min;
        var second_max = this.state.second_max;
        if (min_day == max_day) {//第一个日期只选择了一个
            if (this.state.beign_min != this.state.first_max) {//第一个日期之前已经选择过了属于重新选择，第二个日期清空
                second_min = second_max = "";
            }
            else {
                //第一个日期之前没有选择过不属于重新选择
                if (second_min) {//第二个日期框有选择
                    second_min = 1;//设置第二个日期中的开始日期为1
                    max_day = 31;//设置第一个日期中的结束日期为最大
                }
            }

        }
        else {//第一个日期中的开始日期与日期不相同，第二个日期默认清空
            second_min = "";
            second_min = "";
        }
        /*判断与后面一个的复合情况*/
        this.setState({
            first_year: value.split("-")[0] * 1,
            first_month: value.split("-")[1] * 1,
            first_day: value.split("-")[2] * 1,
            first_min: min_day,
            first_max: max_day,
            second_min: second_min,
            second_max: second_max,
            first_time: this.refs.begin.getValue(),
            second_time: this.refs.end.getValue(),
        });
    }
    secondHandler(value) {//结束日期选择事
        if (value && value.indexOf(" ") > -1) {//有时间
            value = value.split(" ")[0];
        }
        var min_day = this.state.second_min;
        var max_day = this.state.second_max;
        /*单向选择判断*/
        if ((!min_day && !max_day) || min_day != max_day) {
            //都为空，或者已经选择过了，重新选择
            min_day = value.split("-")[2] * 1;
            max_day = value.split("-")[2] * 1;
        }
        else if (min_day == max_day) {
            //已经选择了一个
            if (min_day < value.split("-")[2] * 1) {
                //比最小值大
                max_day = value.split("-")[2] * 1;
            }
            else {//比最小值小，调换
                max_day = min_day;
                min_day = value.split("-")[2] * 1;

            }
        }
        /*单向选择判断*/

        /*判断与第一个的复合情况*/
        var first_min = this.state.first_min;
        var first_max = this.state.first_max;
        if (min_day == max_day) {//第二个日期只选择了一个
            if (this.state.second_min != this.state.second_max) {//第二个日期之前已经选择过了属于重新选择，第一个日期清空
                first_min = first_max = "";

            } else {  //第二个日期之前没有选择过不属于重新选择
                if (first_min) {//第一个日期框有选择
                    first_max = 31;//设置第一个日期 的结束日期为最大
                    min_day = 1;//设置第二个日期 的开始日期为最为1
                }
            }
        }
        else {//第二个日期中的开始日期与日期不相同，第一个日期默认清空
            first_min = "";
            first_max = "";
        }
        this.setState({
            second_year: value.split("-")[0] * 1,
            second_month: value.split("-")[1] * 1,
            second_day: value.split("-")[2] * 1,
            second_min: min_day,
            second_max: max_day,
            first_min: first_min,
            first_max: first_max,
            first_time: this.refs.begin.getValue(),
            second_time: this.refs.end.getValue(),
        });
    }
    onSelectHandler() {
        var firstDate, secondDate;
        if (this.state.first_min != "") {
            firstDate = this.state.first_year + "-" + (this.state.first_month.toString().length == 1 ? "0" + this.state.first_month : this.state.first_month) + "-" + (this.state.first_min.toString().length == 1 ? "0" + this.state.first_min : this.state.first_min);
        }
        else if (this.state.second_min != "") {
            firstDate = this.state.second_year + "-" + (this.state.second_month.toString().length == 1 ? "0" + this.state.second_month : this.state.second_month) + "-" + (this.state.second_min.toString().length == 1 ? "0" + this.state.second_min : this.state.second_min);
        }

        if (this.state.second_max != "") {
            secondDate = this.state.second_year + "-" + (this.state.second_month.toString().length == 1 ? "0" + this.state.second_month : this.state.second_month) + "-" + (this.state.second_max.toString().length == 1 ? "0" + this.state.second_max : this.state.second_max);
        }
        else if (this.state.first_max != "") {
            secondDate = this.state.first_year + "-" + (this.state.first_month.toString().length == 1 ? "0" + this.state.first_month : this.state.first_month) + "-" + (this.state.first_max.toString().length == 1 ? "0" + this.state.first_max : this.state.first_max);
        }
        if (firstDate && secondDate) {

            if (this.props.onSelect != "") {
                var first_time = " " + (this.state.first_time ? this.state.first_time : this.refs.begin.getValue());
                let second_time = " " + (this.state.second_time ? this.state.second_time : this.refs.end.getValue());
                this.props.onSelect(firstDate + first_time + "," + secondDate + second_time, firstDate + first_time + "," + secondDate + second_time, this.props.name);

            }
        }
    }
    beginTimeHandler(time) {
        this.setState({
            first_time: time,
        })
    }
    endTimeHandler(time) {
        this.setState({
            second_time: time,
        })
    }
    cancelHandler() {
        this.props.onSelect("", "", this.props.name);
    }
    render() {
        var firstHour = ""; var firstMinute = ""; var firstSecond = "";
        var secondHour = "", secondMinute = "", secondSecond = "";
        if (this.state.first_time) {
            firstHour = this.state.first_time.split(":")[0] * 1;
            firstMinute = this.state.first_time.split(":")[1] * 1;
            firstSecond = this.state.first_time.split(":")[2] * 1;
        }
        if (this.state.second_time) {
            secondHour = this.state.second_time.split(":")[0] * 1;
            secondMinute = this.state.second_time.split(":")[1] * 1;
            secondSecond = this.state.second_time.split(":")[2] * 1;
        }
        return (<div>
            <div className="ok">
                <div style={{ float: "left", marginLeft: 5, marginTop: 5 }} >
                    <Time name="begin" type="time" key="begin" onSelect={this.beginTimeHandler} ref="begin"
                        hour={firstHour} minute={firstMinute} second={firstSecond}></Time>
                </div>
                <div style={{ float: "left", marginLeft: 68, marginTop: 5, height: 32 }}>
                    <Time name="end" type="time" key="end" ref="end" onSelect={this.endTimeHandler} hour={secondHour} minute={secondMinute} second={secondSecond}></Time>
                </div>
                <Button title="确定" name="ok" size="small" theme="primary" onClick={this.onSelectHandler}></Button>
                <Button title="取消" name="cancel" rsize="small" theme="cancel" onClick={this.cancelHandler}></Button>
            </div>
            <DateD isRange={true} year={this.state.first_year} month={this.state.first_month} day={this.state.first_day}
                min={this.state.first_min} max={this.state.first_max}
                onSelect={this.firstHandler}
                updateYearAndMonth={this.firstMonthHandler}
            ></DateD>
            <DateD isRange={true} year={this.state.second_year} month={this.state.second_month} day={this.state.second_day}
                min={this.state.second_min} max={this.state.second_max}
                onSelect={this.secondHandler}
                updateYearAndMonth={this.secondMonthHandler}
            ></DateD>

        </div>)
    }
}
DateTimeRange.propTypes = {
    name: PropTypes.string,//名称
    firstDate: PropTypes.string,//第一个日期
    firstTime: PropTypes.string,//第一个时间
    secondDate: PropTypes.string,//第二个日期
    secondTime: PropTypes.string,//第二个时间
    onSelect: PropTypes.func,//确定事件
};

export default DateTimeRange;
