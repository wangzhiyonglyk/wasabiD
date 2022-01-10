/*
create by wangzhiyong
date:2016-05-20
desc:日期范围/[日期时间范围]选择控件 todo 这里要改
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import propsTran from "../../libs/propsTran";
export default function (WrappedComponent) {
    class DateRangeHoc extends Component {
        constructor(props) {
            super(props)
            this.state = propsTran.setDateRangeDefaultState(props);//初始化状态值
            this.firstMonthHandler = this.firstMonthHandler.bind(this);
            this.secondMonthHandler = this.secondMonthHandler.bind(this);
            this.firstHandler = this.firstHandler.bind(this);
            this.secondHandler = this.secondHandler.bind(this);
            this.beginTimeHandler = this.beginTimeHandler.bind(this);
            this.endTimeHandler = this.endTimeHandler.bind(this);
            this.onSelect = this.onSelect.bind(this);
        }

        static getDerivedStateFromProps(props, state) {

            if ((props.firstDate || "") + (props.firstTime || "") + (props.secondDate || "") + (props.secondTime || "") != state.oldPropsValue) {
                return propsTran.setDateRangeDefaultState(props);
            }
            return null;

        }
        /**
         * 第一个日期的年与月选择事件
         * @param {*} year 
         * @param {*} month 
         */
        firstMonthHandler(year, month) {
            let newDate = new Date(year, month, 1);
            let oldDate = new Date(this.state.second_year, this.state.second_month - 1, 1);
            if (oldDate > newDate) {
                newDate = oldDate;
            }
            this.setState({
                first_year: year,
                first_month: month,
                second_year: newDate.getFullYear(),
                second_month: newDate.getMonth() + 1,
                first_day: null,
                second_day: null,
                first_rangeBegin: null,
                first_rangeEnd: null,
                second_rangeBegin: null,
                second_rangeEnd: null,
            })
        }
        /**
         * 第二个日期的年与月选择事件
         * @param {*} year 
         * @param {*} month 
         */
        secondMonthHandler(year, month) {
            let newDate = new Date(year, month - 2, 1);
            let oldDate = new Date(this.state.first_year, this.state.first_month - 1, 1)
            if (oldDate < newDate) {
                newDate = oldDate;
            }

            this.setState({
                first_year: newDate.getFullYear(),
                first_month: newDate.getMonth() + 1,
                second_year: year,
                second_month: month,
                first_day: null,
                second_day: null,
                first_rangeBegin: null,
                first_rangeEnd: null,
                second_rangeBegin: null,
                second_rangeEnd: null,
            })
        }
        /**
         * 第一个日期选择事件
         * @param {*} value 值
         */
        firstHandler(value) {//
            if (value && value.indexOf(" ") > -1) {//有时间
                value = value.split(" ")[0];
            }
            let newState = {
                first_year: value.split("-")[0] * 1,
                first_month: value.split("-")[1] * 1,
                first_day: value.split("-")[2] * 1,
            };
            let first_rangeBegin = this.state.first_rangeBegin;
            let first_rangeEnd = this.state.first_rangeEnd;
            let second_rangeBegin = this.state.second_rangeBegin;
            let second_rangeEnd = this.state.second_rangeEnd;
            if (!first_rangeBegin) {//第一个日期的开始日期日期为空
                newState.first_rangeBegin = newState.first_day;
                if (second_rangeBegin && second_rangeEnd) {//第二个日期的日期不为空
                    //清空
                    newState.second_rangeBegin = null;
                    newState.second_rangeEnd = null;
                    newState.second_day = null;
                }
                else if (second_rangeBegin) {//第二个日期的开始日期不为空
                    newState.first_rangeEnd = 32;
                    newState.second_rangeEnd = second_rangeBegin;
                    newState.second_rangeBegin = -1;
                }
            }
            else {//不为空
                //清空第二个日期
                newState.second_rangeBegin = null;
                newState.second_rangeEnd = null;
                newState.second_day = null;
                if (first_rangeEnd) {//第一个日期的结束日期也不为空或者第二个日期的开始日期不为空，初始化开始日期
                    newState.first_rangeBegin = newState.first_day;
                    newState.first_rangeEnd = null;
                }
                else {

                    if (newState.first_day * 1 < first_rangeBegin * 1) {//选择的日期比第二个日期的开始日期还要小，对换
                        newState.first_rangeBegin = newState.first_day;
                        newState.first_rangeEnd = first_rangeBegin;
                    }
                    else {
                        newState.first_rangeEnd = newState.first_day; //第二次点击
                    }

                }

            }

            /*判断与后面一个的复合情况*/
            this.setState(newState, () => {
                this.onSelect(this.props.type == "daterange" ? true : false);
            });
        }
        /**
         * 第二个日期的选择事件
         * @param {*} value 
         */
        secondHandler(value) {//
            if (value && value.indexOf(" ") > -1) {//有时间
                value = value.split(" ")[0];
            }
            let newState = {
                second_year: value.split("-")[0] * 1,
                second_month: value.split("-")[1] * 1,
                second_day: value.split("-")[2] * 1,
            };
            let first_rangeBegin = this.state.first_rangeBegin;
            let first_rangeEnd = this.state.first_rangeEnd;
            let second_rangeBegin = this.state.second_rangeBegin;
            let second_rangeEnd = this.state.second_rangeEnd;
            if (!second_rangeBegin) {//第二个日期的开始日期为空
                newState.second_rangeBegin = newState.second_day;
                if (first_rangeBegin && first_rangeEnd) {  //第一日期的结束日期不为空
                    newState.first_rangeBegin = null;
                    newState.first_rangeEnd = null;
                    newState.first_day = null;
                }
                else if (first_rangeBegin) {
                    //第一个日期的开始日期不为空
                    newState.first_rangeEnd = 32;
                    newState.second_rangeBegin = -1;
                    newState.second_rangeEnd = newState.second_day;
                }
            }
            else {
                //清空第一个日期
                newState.first_rangeBegin = null;
                newState.first_rangeEnd = null;
                newState.first_day = null;
                if (second_rangeEnd) {//第二个日期的结束日期不为空
                    newState.second_rangeBegin = newState.second_day;
                    newState.second_rangeEnd = null;
                }
                else {
                    if (newState.second_day * 1 < second_rangeBegin * 1) {//选择的日期比第二个日期的开始日期还要小，对换
                        newState.second_rangeBegin = newState.second_day;
                        newState.second_rangeEnd = second_rangeBegin;
                    }
                    else {
                        newState.second_rangeEnd = newState.second_day;;
                    }

                }
            }
            /*判断与后面一个的复合情况*/
            this.setState(newState, () => {
                this.onSelect();
            });
        }
        /**
         * 第一个时间选择
         * @param {*} time 
         */
        beginTimeHandler(time) {//  
            this.setState({
                firstTime: time,

            }, () => {
                this.onSelect(false);
            })

        }
        /**
         * 第二个时间选择
         * @param {*} time 
         */
        endTimeHandler(time) {//
            this.state.secondTime = time;
            this.setState({
                secondTime: time,

            }, () => {
                this.onSelect(true);
            })

        }
        /**
         * 值确认事件
         */
        onSelect() {
            let firstDate, secondDate;
            if (this.state.first_rangeBegin) {
                firstDate = this.state.first_year + "-" + (this.state.first_month.toString().length == 1 ? "0" + this.state.first_month : this.state.first_month) + "-" + (this.state.first_rangeBegin.toString().length == 1 ? "0" + this.state.first_rangeBegin : this.state.first_rangeBegin);
            }
            else if (this.state.second_rangeBegin) {
                firstDate = this.state.second_year + "-" + (this.state.second_month.toString().length == 1 ? "0" + this.state.second_month : this.state.second_month) + "-" + (this.state.second_rangeBegin.toString().length == 1 ? "0" + this.state.second_rangeBegin : this.state.second_rangeBegin);
            }
            if (this.state.second_rangeEnd) {
                secondDate = this.state.second_year + "-" + (this.state.second_month.toString().length == 1 ? "0" + this.state.second_month : this.state.second_month) + "-" + (this.state.second_rangeEnd.toString().length == 1 ? "0" + this.state.second_rangeEnd : this.state.second_rangeEnd);
            }
            else if (this.state.first_rangeEnd) {
                secondDate = this.state.first_year + "-" + (this.state.first_month.toString().length == 1 ? "0" + this.state.first_month : this.state.first_month) + "-" + (this.state.first_rangeEnd.toString().length == 1 ? "0" + this.state.first_rangeEnd : this.state.first_rangeEnd);
            }
            if (this.props.onSelect) {
                if (firstDate && secondDate) {
                    firstDate = firstDate + (this.state.firstTime ? " " + this.state.firstTime : "");
                    secondDate = secondDate + (this.state.secondTime ? " " + this.state.secondTime : "");
                    this.props.onSelect(firstDate + "," + secondDate, firstDate + "," + secondDate, this.props.name);
                }
            }
        }

        render() {
            return <WrappedComponent {...this.props} {...this.state}
                firstHandler={this.firstHandler}
                secondHandler={this.secondHandler}
                firstMonthHandler={this.firstMonthHandler}
                secondMonthHandler={this.secondMonthHandler}
                beginTimeHandler={this.beginTimeHandler}
                endTimeHandler={this.endTimeHandler}

                // onSelect={this.props.onSelect}
            ></WrappedComponent>
        }
    }
    DateRangeHoc.propTypes = {
        name: PropTypes.string,//名称
        firstDate: PropTypes.string,//第一个日期
        secondDate: PropTypes.string,//第二个日期
        firstTime: PropTypes.string,//第一个时间
        secondTime: PropTypes.string,//第二个时间
        attachSecond: PropTypes.bool,//是否带上秒
        onSelect: PropTypes.func,//确定事件
    };
    DateRangeHoc.defaultProps = {
        attachSecond: true,  
    };
    return DateRangeHoc;
}
