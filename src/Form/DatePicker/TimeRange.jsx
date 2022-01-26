/*
 create by wangzhiyong
 date:2016-06-12
 desc:时间选择组件 TODO 需要重新改造
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import Time from "./Time"
class TimeRange extends Component {
    constructor(props) {
        super(props);
        this.state = this.setValue(this.props.value);
        this.getValue = this.getValue.bind(this);
        this.setValue = this.setValue.bind(this);

        this.firstHandler = this.firstHandler.bind(this);
        this.secondHandler = this.secondHandler.bind(this);

    }


    getValue() {//获取值
        return this.state.firstTime + "," + this.state.secondTime
    }
    setValue(value) {//设置值 
        let state = {};
        state.firstTime = "";
        state.secondTime = "";
        if (value && value.indexOf(",") > -1) {
            value = value.split(",");
            state.firstTime = value[0];
            state.secondTime = value[1];
        }
        else {
            state.firstTime = value;
        }
        if (state.firstTime && state.firstTime.split(":").length >= 2) {

            let hour = state.firstTime.split(":")[0] * 1;
            let minute = state.firstTime.split(":")[1] * 1;
            state.first_hour = hour;
            state.first_minute = minute;

        }
        if (state.secondTime && state.secondTime.split(":").length >= 2) {

            let hour = state.secondTime.split(":")[0] * 1;
            let minute = state.secondTime.split(":")[1] * 1;
            state.second_hour = hour;
            state.second_minute = minute;

        }
        return state;

    }

    /**
     * 开始时间
     * @param {*} value 
     */
    firstHandler(value) {

        this.setState({
            firstTime: value,

        }, () => {
            if (this.props.onSelect !==null) {

                this.props.onSelect(this.getValue(), this.getValue(), this.props.name, null);
            }
        })

    }
    /**
     * 结束时间
     * @param {*} value 
     */
    secondHandler(value) {

        if (this.props.attachSecond) {
            value = value.split(":");
            value = value[0] + ":" + value[1] + ":59";//结束时间如果带上秒一定是59
        }
        this.setState({
            firstTime:this.state.firstTime?this.state.firstTime:value,
            secondTime: value,

        }, () => {
            if (this.props.onSelect !==null) {
                this.props.onSelect(this.getValue(), this.getValue(), this.props.name, true);
            }

        })

    }
    render() {

        return <div style={{ display: "flex" }} >
            <div style={{ marginRight: 19 }}><Time key="begin"
                hour={this.state.first_hour} minute={this.state.first_minute} attachSecond={this.props.attachSecond} allMinute={this.props.allMinute}
                onSelect={this.firstHandler.bind(this)}
            ></Time></div>
            <div>  <Time key="end"
                onSelect={this.secondHandler.bind(this)}
                hour={this.state.second_hour} minute={this.state.second_minute} attachSecond={this.props.attachSecond} allMinute={this.props.allMinute}></Time></div>

        </div>
    }
}

TimeRange.propTypes = {
 
    firstTime: PropTypes.string,//第一个时间
    secondTime: PropTypes.string,//第二个时间
    attachSecond: PropTypes.bool,//附带秒
};
TimeRange.defaultProps = {
    attachSecond: true,  
}
export default TimeRange;