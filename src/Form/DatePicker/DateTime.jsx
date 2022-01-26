//create by wangzhiyong
//date:2016-04-25
//desc:日期时间组件，

import React, { Component } from "react";
import PropTypes from "prop-types";
import Time from "./Time.jsx";
import Msg from '../../Info/Msg'
import func from '../../libs/func'
import Calendar from "./Calendar";
class DateTime extends Component {
    constructor(props) {
        super(props);
        let newDate = new Date();
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        this.state = {
            oldPropsValue: "",
            year: this.props.year ? this.props.year : year * 1,
            month: this.props.month ? this.props.month : month * 1,
            day: this.props.day ? this.props.day : newDate.getDate(),
            time: this.props.time ? this.props.time : this.props.attachSecond ? func.dateformat(newDate, 'HH:mm:') + "00" : func.dateformat(newDate, 'HH:mm'),
            showTime: false,
        }

        this.dateChange = this.dateChange.bind(this)
    }
    static getDerivedStateFromProps(props, state) {
        let newState = {};
        if ((props.year || "") + "-" + (props.month || "") + "-" + (props.day || "") + " " + (props.time || "") !==state.oldPropsValue) {
            newState.year = props.year ? props.year : state.year;
            newState.month = props.month ? props.month : state.month;
            newState.day = props.day || state.day;
            newState.time = props.time || state.time;
            newState.oldPropsValue = (props.year || "") + "-" + (props.month || "") + "-" + (props.day || "") + " " + (props.time || "");
            return newState;
        }
        return null;
    }
    dateChange(value) {
        value = value.split("-");
        this.setState({
            year: value[0] * 1,
            month: value[1] * 1,
            day: value[2] * 1
        }, () => {
            this.onSelect(false);
        })
    }

    onSelect(hide) {
        if (this.state.year && this.state.month && this.state.day) {
            let value = this.state.year + "-" + (this.state.month.toString().length == 1 ? "0" + this.state.month.toString() : this.state.month)
                + "-" + (this.state.day < 10 ? "0" + this.state.day.toString() : this.state.day.toString());
            this.props.onSelect && this.props.onSelect(value + " " + this.state.time, value + " " + this.state.time, this.props.name, hide)
        } else {
            Msg.alert("请选择日期");
        }

    }

    timeHandler() {
        this.setState({
            showTime: true,
        })
    }
    timeOnChange(value) {
        this.setState({
            time: value,
            showTime: false
        }, () => {
            this.onSelect(true);
        })

    }
    shouldComponentUpdate(nextProps, nextState) {
        if (func.diff(nextProps, this.props,false)) {
            return true;
        }
        if (func.diff(nextState, this.state)) {
            return true;
        }
        return false;
    }
    render() {
        return (
            <React.Fragment>
                <div style={{ height: 40 ,width:"100%"}}>
                    <input className=" wasabi-input timeinput"
                        value={this.state.time} onClick={this.timeHandler.bind(this)} onChange={() => { }}></input>
                    <div style={{ display: this.state.showTime ? "inline-block" : "none", zIndex: 1 }}>
                        <Time
                            onSelect={this.timeOnChange.bind(this)}
                            key="end"
                            value={this.state.time} attachSecond={this.props.attachSecond}
                        ></Time></div>
                </div>
                <Calendar year={this.state.year}
                    month={this.state.month}
                    day={this.state.day} onSelect={this.dateChange} ></Calendar>
            </React.Fragment>


        )
    }
}
DateTime.propTypes = {
    name: PropTypes.string,//字段名称，对应于表单
    year: PropTypes.number,//年
    month: PropTypes.number,//月
    day: PropTypes.number,//日
    time: PropTypes.string,//时间
    attachSecond: PropTypes.bool,//是否带上秒
    allMinute: PropTypes.bool,//是否显示全部分钟
    onSelect: PropTypes.func,//选择后的事件

}
export default DateTime