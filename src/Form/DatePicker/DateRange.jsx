/*
create by wangzhiyong
date:2016-05-20
desc:日期范围选择控件
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Calendar from "./Calendar";
import DateRangeHoc from "./DateRangeHoc";
import func from "../../libs/func"
class DateRange extends React.PureComponent {
    constructor(props) {
        super(props)
    }
    onClick(type) {
        let secondDate = new Date();
        let firstDate;
        switch (type) {
            case 1:
                firstDate = func.getNextDay(secondDate, -1);
                break;
            case 2:
                firstDate = func.getNextDay(secondDate, -7);
                break;
            case 3:
                firstDate = func.getNextMonth(secondDate, -1);
                break;
            case 4:
                firstDate = func.getNextMonth(secondDate, -3);
                break;
            case 5:
                firstDate = func.getNextYear(secondDate, -1);
                break;
            default:
                break;
        }
        this.props.onSelect&&this.props.onSelect(func.dateformat(firstDate,"yyyy-MM-dd")+","+func.dateformat(secondDate,"yyyy-MM-dd"))
    }
    render() {
        return (<React.Fragment >
            <div className="wasabi-date-qick">
                <a key="1" onClick={this.onClick.bind(this, 1)}>最近一天</a>
                <a key="2" onClick={this.onClick.bind(this, 2)}>最近一周</a>
                <a key="3" onClick={this.onClick.bind(this, 3)}>最近一月</a>
                <a key="4" onClick={this.onClick.bind(this, 4)}>最近三个月</a>
                <a key="5" onClick={this.onClick.bind(this, 5)}> 最近一年</a>
            </div>
            <Calendar isRange={true} year={this.props.first_year} month={this.props.first_month} day={this.props.first_day}
                rangeBegin={this.props.first_rangeBegin} rangeEnd={this.props.first_rangeEnd}
                onSelect={this.props.firstHandler}
                updateYearAndMonth={this.props.firstMonthHandler}
            ></Calendar>
            <Calendar isRange={true} year={this.props.second_year} month={this.props.second_month} day={this.props.second_day}
                rangeBegin={this.props.second_rangeBegin} rangeEnd={this.props.second_rangeEnd}
                onSelect={this.props.secondHandler}
                updateYearAndMonth={this.props.secondMonthHandler}
            ></Calendar>

        </React.Fragment>)
    }
}
DateRange.propTypes = {
    name: PropTypes.string,//名称
    firstDate: PropTypes.string,//第一个日期
    secondDate: PropTypes.string,//第二个日期
    onSelect: PropTypes.func,//确定事件
};

export default DateRangeHoc(DateRange);
