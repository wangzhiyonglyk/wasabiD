/*
 create by wangzy
 date:2016-05-20
 edit 2019-12-18
 desc:将日期控件表体全独立出来
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Lang from "../Lang/language.js";

import Message from "../Unit/Message.jsx";

require("../Sass/Form/DateTime.css");
class CalendarBody extends Component {
    constructor(props) {
        super(props);
        this.state = {

            year: this.props.year,
            tempyear: this.props.year,//临时的，防止输入框改变后对整个组件产生影响
            month: this.props.month,
            day: this.props.day,
            isRange: this.props.isRange,
            min: this.props.min,
            max: this.props.max,
           

        };
        this.getMonthDays=this.getMonthDays.bind(this);
        this.getFirstDayWeek=this.getFirstDayWeek.bind(this);
        this.dayHandler=this.dayHandler.bind(this);
       
        this.yearOnChange=this.yearOnChange.bind(this);
        this.changeYearHandler=this.changeYearHandler.bind(this);
        this.changeMonthHandler=this.changeMonthHandler.bind(this);
        this.yearOKHandler=this.yearOKHandler.bind(this);
        this.yearonBlur=this.yearonBlur.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
           
            tempyear: nextProps.year,
           
            
        })
    }
    getMonthDays() {
        //根据月份获取当月总天数
        return new Date(this.props.year, this.props.month, 0).getDate();
    }
    getFirstDayWeek() {
        //获取当月第一天是星期几
        return new Date(this.props.year, this.props.month - 1, 1).getDay();
    }
    dayHandler(day) {
        this.setState({
            day: day
        })
       this.props.dayHandler&& this.props.dayHandler(day); // 执行父组件回调函数，改变父组件状态值
    }
    yearOnChange(event) {
        this.setState({
            tempyear: event.target.value,
        })
    }
    changeYearHandler(value) {
       
        if (this.props.changeYearHandler) {
            this.props.changeYearHandler(value);
        }
    }
    changeMonthHandler(value) {
        if (this.props.changeMonthHandler) {
            this.props.changeMonthHandler(value);
        }
    }
    yearOKHandler(event) {
        if (event.keyCode == 13) {
            this.yearonBlur(event);//共用函数
        }
    }
    yearonBlur(event) {
        let year = event.target.value << 0;//转成数字
        year < 1900 || year > 9999 ? Message.error("不是有效年份") : this.changeYearHandler(year);
    }
    render() {
        //TODO 以下代码有待优化
        var arry1 = [], arry2 = [];
        var getDays = this.getMonthDays(), FirstDayWeek = this.getFirstDayWeek();
        for (var i = 0; i < FirstDayWeek; i++) {
            arry1[i] = i;
        }
        for (var i = 0; i < getDays; i++) {
            arry2[i] = (i + 1);
        }
        var node1 = arry1.map(function (item, i) {
            return <div className="datespan" key={i}></div>
        })
        var node2 = arry2.map((item, index) => {
            let choseed = false;//当前日期是否被选中
            if (this.props.isRange) {
                if (this.props.min && this.props.max && this.props.min <= item && this.props.max >= item) {
                    choseed = true;
                }
            }
            else if (this.props.day == item) {
                choseed = true;
            }
            var control = null;
            if (item == this.props.min && item == this.props.max) {
                control = <div className={"datespan "} key={"li2" + index} onClick={this.dayHandler.bind(this, item)}><div className="onlyradius">{item}</div></div>;
            }
            else if (item == this.props.min) {
                control = <div className={"datespan begin"} key={"li2" + index} onClick={this.dayHandler.bind(this, item)}>
                    <div className="blank"><div className="radius">{item}</div></div></div>;
            }
            else if (item == this.props.max) {
                control = <div className={"datespan end"} key={"li2" + index} onClick={this.dayHandler.bind(this, item)}>
                    <div className="blank"><div className="radius">{item}</div></div></div>;
            }
            else if (choseed) {
                if (this.props.isRange) {
                    control = <div className={"datespan chosed"} key={"li2" + index} onClick={this.dayHandler.bind(this, item)}>{item}</div>;

                }
                else {
                    control = <div className={"datespan "} key={"li2" + index} onClick={this.dayHandler.bind(this, item)}><div className="onlyradius">{item}</div></div>;

                }
            }
            else {

                control = <div className={"datespan "} key={"li2" + index} onClick={this.dayHandler.bind(this, item)}><div className="radius">{item}</div></div>;
            }
            return control;
        })

        var yearControl = [];
        for (var index = this.props.year * 1 - 7; index <= this.props.year * 1 + 4; index++) {
            if (index == this.props.year * 1) {
                yearControl.push(<div className="datespan chosed" onClick={this.changeYearHandler.bind(this, index)} key={"year" + index}>{index}</div>);
            }
            else {
                yearControl.push(<div className="datespan" onClick={this.changeYearHandler.bind(this, index)} key={"year" + index}>{index}</div>);
            }

        }
        return (
            <div className="wasabi-datetime-body">
                <div className="weekul" style={{ display: (!this.props.changeMonth && !this.props.changeYear) ? "block" : "none" }}>
                    <div className="weekspan">{Lang.cn.SUN}</div>
                    <div className="weekspan">{Lang.cn.MON}</div>
                    <div className="weekspan">{Lang.cn.TUE}</div>
                    <div className="weekspan">{Lang.cn.WED}</div>
                    <div className="weekspan">{Lang.cn.THU}</div>
                    <div className="weekspan">{Lang.cn.FRI}</div>
                    <div className="weekspan">{Lang.cn.SAT}</div>
                </div>
                <div className="dayul" style={{ display: (!this.props.changeMonth && !this.props.changeYear) ? "block" : "none" }}>{node1} {node2}</div>
                <div className="wasabi-datetime-month" style={{ display: this.props.changeMonth ? "block" : "none" }}>

                    <div className={"datespan " + ((this.props.month == 1) ? "chosed" : "")} onClick={this.changeMonthHandler.bind(this, 1)}>一月</div>
                    <div className={"datespan " + ((this.props.month == 2) ? "chosed" : "")} onClick={this.changeMonthHandler.bind(this, 2)}>二月</div>
                    <div className={"datespan " + ((this.props.month == 3) ? "chosed" : "")} onClick={this.changeMonthHandler.bind(this, 3)}  >三月</div>
                    <div className={"datespan " + ((this.props.month == 4) ? "chosed" : "")} onClick={this.changeMonthHandler.bind(this, 4)}>四月</div>
                    <div className={"datespan " + ((this.props.month == 5) ? "chosed" : "")} onClick={this.changeMonthHandler.bind(this, 5)}>五月</div>
                    <div className={"datespan " + ((this.props.month == 6) ? "chosed" : "")} onClick={this.changeMonthHandler.bind(this, 6)}>六月</div>
                    <div className={"datespan " + ((this.props.month == 7) ? "chosed" : "")} onClick={this.changeMonthHandler.bind(this, 7)}>七月</div>
                    <div className={"datespan " + ((this.props.month == 8) ? "chosed" : "")} onClick={this.changeMonthHandler.bind(this, 8)}>八月</div>
                    <div className={"datespan " + ((this.props.month == 9) ? "chosed" : "")} onClick={this.changeMonthHandler.bind(this, 9)}>九月</div>
                    <div className={"datespan " + ((this.props.month == 10) ? "chosed" : "")} onClick={this.changeMonthHandler.bind(this, 10)}>十月</div>
                    <div className={"datespan " + ((this.props.month == 11) ? "chosed" : "")} onClick={this.changeMonthHandler.bind(this, 11)}>十一月</div>
                    <div className={"datespan " + ((this.props.month == 12) ? "chosed" : "")} onClick={this.changeMonthHandler.bind(this, 12)}>十二月</div>
                </div>
                <div className="wasabi-datetime-year" style={{ display: this.props.changeYear ? "block" : "none" }}>
                    <div style={{ display: "block", textAlign: "center", marginBottom: 10 }}>
                    <input value={this.state.tempyear} name="year" onBlur={this.yearonBlur}
                     onKeyUp={this.yearOKHandler} style={{ width: 60, height: 30, paddingLeft: 5 }} 
                     title="回车确认" onChange={this.yearOnChange}></input></div>
                    {yearControl}</div>
            </div>
        )
    }
}

CalendarBody.propTypes = {
    year: PropTypes.number,//年
    month: PropTypes.number,//月
    day: PropTypes.number,//日
    isRange: PropTypes.bool,//是否为范围选择
    min: PropTypes.number,//最小值，用于日期范围选择
    max: PropTypes.number,//最大值,用于日期范围选择
    dayHandler: PropTypes.func,//选择后的事件
    changeYear: PropTypes.bool,
    changeMonth: PropTypes.bool,
    changeYearHandler: PropTypes.func,
    changeMonthHandler: PropTypes.func,
};

CalendarBody.defaultProps = {
    year: new Date().getFullYear
};
export default CalendarBody;