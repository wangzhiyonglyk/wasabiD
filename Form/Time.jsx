/*
 create by wangzy
 date:2016-06-12
 desc:时间选择组件 TODO 需要重新改造
 */

import React, { Component } from "react";
import PropTypes from "prop-types";

import("../Sass/Form/DateTime.css");
class Time extends Component {
    constructor(props) {
        super(props);
        this.state = this.setInitValue(this.props);
    this.getValue=this.getValue.bind(this);
    this.setValue=this.setValue.bind(this);
    this.setInitValue=this.setInitValue.bind(this);
    this.showHandler=this.showHandler.bind(this);
    this.hourHandler=this.hourHandler.bind(this);
    this.minuteHandler=this.minuteHandler.bind(this);
    this.secondHandler=this.secondHandler.bind(this);
    this.scrollHandler=this.scrollHandler.bind(this);
    this.mouseOutHandler=this.mouseOutHandler.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        /*

         */
        var result = this.setInitValue(nextProps);
        result.height = this.state.height;//高度仍用旧值，因为选择时回传父组件，还不需要消失
        this.setState(result);
        //滚动到指定位置
        this.refs.hour.scrollTop = result.hour * 24;
        this.refs.minute.scrollTop = result.minute * 24;
        this.refs.second.scrollTop = result.second * 24;
    }
    componentDidMount() {
        //滚动到指定位置
        this.refs.hour.scrollTop = this.state.hour * 24;
        this.refs.minute.scrollTop = this.state.minute * 24;
        this.refs.second.scrollTop = this.state.second * 24;

    }
    getValue() {//获取值
        return this.state.hour + ":" + this.state.minute + ":" + this.state.second;
    }
    setValue(value) {//设置值 
        this.setState({
            value: value,
        })
    }
    setInitValue(props) {
        var date = new Date();

        var hour = props.hour != null && props.hour != undefined ? props.hour : date.getHours();
        var minute = props.minute != null && props.minute != undefined ? props.minute : date.getMinutes();
        var second = props.second != null && props.second != undefined ? props.second : date.getSeconds();
        return {
            hour: (hour < 10) ? "0" + hour : hour,
            minute: (minute < 10) ? "0" + minute : minute,
            second: (second < 10) ? "0" + second : second,
            height: 0,//
        }

    }
    hourHandler(value, tran) {
        let lastScrollTop = value * 24;
        this.scrollHandler(this.refs.hour, this.refs.hour.scrollTop, lastScrollTop, tran);
        this.refs.hour.style.backgroundColor = "red";
        this.setState({
            hour: value
        })
        if (this.props.onSelect != null) {
            this.props.onSelect(value + ":" + this.state.minute + ":" + this.state.second, value + ":" + this.state.minute + ":" + this.state.second, this.props.name, null);
        }
    }
    minuteHandler(value, tran) {
        let lastScrollTop = value * 24;
        this.scrollHandler(this.refs.minute, this.refs.minute.scrollTop, lastScrollTop, tran);
        this.setState({
            minute: value
        })
        if (this.props.onSelect != null) {
            this.props.onSelect(this.state.hour + ":" + value + ":" + this.state.second, this.state.hour + ":" + value + ":" + this.state.second, this.props.name, null);
        }

    }
    secondHandler(value, tran) {

        let lastScrollTop = value * 24;
        this.scrollHandler(this.refs.second, this.refs.second.scrollTop, lastScrollTop, tran);
        this.setState({
            second: value
        })
        if (this.props.onSelect != null) {
            this.props.onSelect(this.state.hour + ":" + this.state.minute + ":" + value, this.state.hour + ":" + this.state.minute + ":" + value, this.props.name, null);
        }

    }
    scrollHandler(obj, scrollTop, lastScrollTop, tran) {
        obj.scrollTop = scrollTop;
        if (scrollTop < lastScrollTop) {
            setTimeout(() => {
                this.scrollHandler(obj, scrollTop + 24, lastScrollTop, tran);
            }, tran);

        }

    }
    mouseOutHandler(event) {//鼠标移开时隐藏下拉
        var parentE = event.relatedTarget;//相关节点
        while (parentE && parentE.nodeName != "BODY") {
            if (parentE.className.indexOf("wasabi-time-picker-panel-inner") > -1) {
                break;
            }
            parentE = parentE.parentElement;
        }

        if (parentE == undefined || parentE == null || parentE.nodeName == "BODY") {
            setTimeout(() => {
                this.setState({
                    height: 0,
                });
            }, 200);

        }

    }
    renderHour() {
        let hourControl = [];
        for (let index = 0; index < 24; index++) {
            var currentHour = (index < 10) ? "0" + index : index;
            hourControl.push(<li onClick={this.hourHandler.bind(this, currentHour, 70)} key={"hour" + currentHour}
                className={(this.state.hour == currentHour) ? "wasabi-time-picker-panel-select-option-selected" : null}>{currentHour}</li>);
        }
        for (let index = 0; index < 5; index++) {
            hourControl.push(<li key={"nohour" + index}></li>);
        }
        return hourControl;
    }
    rendMinute() {
        let minuteControl = [];
        for (let index = 0; index < 60; index++) {
            var currentMinute = (index < 10) ? "0" + index : index;
            minuteControl.push(<li key={"minute" + currentMinute} onClick={this.minuteHandler.bind(this, currentMinute, 70)}
                className={(this.state.minute == currentMinute) ? "wasabi-time-picker-panel-select-option-selected" : null}>{currentMinute}</li>);
        }
        for (let index = 0; index < 5; index++) {
            minuteControl.push(<li key={"nominute" + index}></li>);
        }
        return minuteControl;
    }
    rendSecond() {
        let secondControl = [];
        for (let index = 0; index < 60; index++) {
            var currentSecond = (index < 10) ? "0" + index : index;
            secondControl.push(<li key={"second" + currentSecond} onClick={this.secondHandler.bind(this, currentSecond, 70)}
                className={(this.state.second == currentSecond) ? "wasabi-time-picker-panel-select-option-selected" : null}>{currentSecond}</li>);
        }
        for (let index = 0; index < 5; index++) {
            secondControl.push(<li key={"nosecond" + index}></li>);
        }
        return secondControl;
    }

    showHandler() {
        this.setState({
            height: 146,

        })

    }
    changeHandler() {

    }
    render() {


        return <div className="wasabi-time-picker-panel-inner" onMouseOut={this.mouseOutHandler}>
            <div className="wasabi-time-picker-panel-input-wrap">
                <input className="wasabi-time-picker-panel-input  "
                    onClick={this.showHandler} onChange={this.changeHandler} value={this.state.hour + ":" + this.state.minute + ":" + this.state.second} placeholder="请选择时间"></input>

            </div>
            <div className="wasabi-time-picker-panel-combobox" style={{ height: this.state.height }}>
                <div ref="hour" key="hour" className="wasabi-time-picker-panel-select" >
                    <ul key="hour" >{this.renderHour()} </ul>
                </div>
                <div ref="minute" key="minute" className="wasabi-time-picker-panel-select" >
                    <ul key="minute">{this.rendMinute()}</ul>
                </div>
                <div ref="second" key="second" className="wasabi-time-picker-panel-select" >
                    <ul key="second">{this.rendSecond()}</ul>
                </div>
            </div></div>
    }
}

Time.propTypes = {
    name: PropTypes.string,//表单字段名称
    hour: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),//小时
    minute: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),//分钟
    second: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) //秒

};
Time.defaultProps = () => {
    var date = new Date();
    return {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
    }
};
export default Time;