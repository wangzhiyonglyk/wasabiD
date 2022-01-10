/*create by wangzhiyong
//date:2016-04-25
//edit 2016-09-27重写
//date:2021-05-10 日期组件更名为日历（Calendar）组件作为独立组件，单独导出，其他日期组件全部放在日期选择组件中
//desc:日历组件
*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import lang from "../../Lang/language.js";
import utils from "../../libs/func";
import "./calendar.css"

function CalendarHeader({ year, month, choseYear, choseMonth }) {
    return <div className="wasabi-datetime-header">
        <div style={{ display: "inline", marginRight: 8 }} onClick={choseYear}>
            <span>{year}</span>.</div>
        <div style={{ display: "inline" }} onClick={choseMonth}><span>{(month * 1 < 10 ? "0" + (month * 1) : month)}</span>.</div>
    </div>

}

function YearView({ year, tempyear, showChangeYear, yearInputClick, yearonBlur, yearOKHandler, yearOnChange, changeYearHandler }) {
    let yearControl = [];
    for (let index = year * 1 - 7; index <= year * 1 + 7; index++) {
        let className = index === year * 1 ? "yearspan chosed" : "yearspan";
        yearControl.push(<div key={index} className={className} onClick={changeYearHandler.bind(this, index)} key={"year" + index}>{index}</div>);
    }
    return <div className="wasabi-datetime-year" style={{ display: showChangeYear ? "flex" : "none" }}>
        <div style={{ display: "block", textAlign: "center", marginBottom: 10 ,width:"100%"}}>
            <input type="text" value={tempyear} name="year" onClick={yearInputClick} onBlur={yearonBlur}
                onKeyUp={yearOKHandler}
                title="回车确认" onChange={yearOnChange}></input></div>
        {yearControl}</div>
}

function MonthView({ month, showChangeMonth, changeMonthHandler }) {
    let control = [];
    for (let i = 1; i <= 12; i++) {
        control.push(<div  key={i} className={"monthspan " + ((month === i) ? "chosed" : "")} onClick={changeMonthHandler.bind(this, i)}>{i < 10 ? "0" + i : i}</div>
        )
    }
    return <div className="wasabi-datetime-month" style={{ display: showChangeMonth ? "flex" : "none" }}> {control}
    </div>
}

function WeekView({ visible }) {
    return <div className="weekul" style={{ display: visible ? "block" : "none" }}>
        <div key={lang.cn.SUN} className="weekspan">{lang.cn.SUN}</div>
        <div key={lang.cn.MON} className="weekspan">{lang.cn.MON}</div>
        <div key={lang.cn.TUE} className="weekspan">{lang.cn.TUE}</div>
        <div key={lang.cn.WED} className="weekspan">{lang.cn.WED}</div>
        <div key={lang.cn.THU} className="weekspan">{lang.cn.THU}</div>
        <div key={lang.cn.FRI} className="weekspan">{lang.cn.FRI}</div>
        <div key={lang.cn.SAT} className="weekspan">{lang.cn.SAT}</div>
    </div>
}

function DayView({ year, month, day, visible, isRange, rangeBegin, rangeEnd, dayHandler }) {

    let preMonthWeekDays = [], thisMonthDays = [];
    //总天数
    const daytotal = new Date(year, month, 0).getDate();
    //头一天星期几
    const FirstDayWeek = new Date(year, month - 1, 1).getDay();
    for (let i = 0; i < FirstDayWeek; i++) {
        preMonthWeekDays[i] = i;
    }
    for (let i = 0; i < daytotal; i++) {
        thisMonthDays[i] = (i + 1);
    }
    let preMonthWeekDaysNodes = preMonthWeekDays.map(function (item, i) {
        return <div className="datespan" key={i}></div>
    })
    let thisMonthDaysNodes = thisMonthDays.map((item, index) => {
        let chosed = false;//当前日期是否被选中
        if (isRange) {
            if (rangeBegin && rangeEnd && rangeBegin <= item && rangeEnd >= item) {
                chosed = true;
            }
        }
        else if (day === item) {
            chosed = true;
        }
        let control = null;
         if (item === rangeBegin&&item !== rangeEnd) {
            control = <div className={"datespan begin rangespan"}
             key={"li2" + index} onClick={dayHandler.bind(this, item)}>
             <div className="radius">{item}</div></div>;
        }
        else if (item !== rangeBegin&&item === rangeEnd) {
            control = <div className={"datespan end rangespan"} 
            key={"li2" + index} onClick={dayHandler.bind(this, item)}>
             <div className="radius">{item}</div></div>;
        }
        else{
            control = <div className={"datespan  "+(chosed&&isRange?"rangespan":"")} key={"li2" + index} 
            onClick={dayHandler.bind(this, item)}>
                <div className={"radius "+(chosed&&!isRange?"chosed":"")}>{item}</div></div>;
        }
        return control;
    })
    return <div className="dayul" style={{ display: visible ? "block" : "none" }}>{preMonthWeekDaysNodes} {thisMonthDaysNodes}</div>
}
class Calendar extends Component {
    constructor(props) {
        super(props)
        let newDate = new Date();
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let day = newDate.getDate();
        this.state = {
            oldPropsValue: (this.props.year || "") + "-" + (this.props.month || "") + "-" + (this.props.day || ""),//保留原来的值,方便父组件强制更新
            tempyear: year,//年份输入框值
            year: this.props.year ? this.props.year : year,//年，
            month: this.props.month ? this.props.month : month,//月
            day: this.props.day || day,//日
            showChangeYear: false,//选择年份
            showChangeMonth: false,//选择月份
        }
        this.setValue = this.setValue.bind(this)
        this.choseYear = this.choseYear.bind(this);
        this.yearInputClick = this.yearInputClick.bind(this);
        this.yearOnChange = this.yearOnChange.bind(this);
        this.yearOKHandler = this.yearOKHandler.bind(this);
        this.yearonBlur = this.yearonBlur.bind(this);
        this.changeYearHandler = this.changeYearHandler.bind(this);
        this.choseMonth = this.choseMonth.bind(this);
        this.changeMonthHandler = this.changeMonthHandler.bind(this);
        this.dayHandler = this.dayHandler.bind(this);

    }
    static getDerivedStateFromProps(props, state) {
        let newState = {};
        if ((props.year || "") + "-" + (props.month || "") + "-" + (props.day || "") !== state.oldPropsValue) {
            newState.year = props.year ? props.year : state.year;
            newState.month = props.month ? props.month : state.month;
            newState.day = props.day;
            newState.oldPropsValue = (props.year || "") + "-" + (props.month || "") + "-" + (props.day || "");
            return newState;
        }
        return null;
    }

    /**
     * 设置值
     * @param {*} year 
     * @param {*} month 
     * @param {*} day 
     */
    setValue(year, month, day) {
        let date = new Date();
        year = year ? year : date.getFullYear();
        month = month ? month : date.getMonth() + 1;
        day = day ? day : date.getDate();
        this.setState({
            year: year,
            month: month,
            day: day

        })
    }
    /**
   * 选择年份
   */
    choseYear() {
        this.setState({
            showChangeYear: !this.state.showChangeYear,
            showChangeMonth: false,
        })
    }
    yearInputClick(event) {
        event.target.select();
    }
    /**
     * 年份的onchange事件
     * @param {*} event 
     */
    yearOnChange(event) {
        this.setState({
            tempyear: event.target.value.toString(),
        })
    }
    /**
     * 年份回车事件
     * @param {*} event 
     */
    yearOKHandler(event) {
        if (event.keyCode === 13) {
            this.yearonBlur(event);//共用函数
        }
    }
    /**
     * 年份失去焦点，确认事件
     * @param {*} event 
     */
    yearonBlur(event) {
        let year = event.target.value.trim() << 0;//转成数字
        year < 1900 || year > 9999 ? Msg.error("不是有效年份") : this.changeYearHandler(year);
    }
    /**
     * 年份改变事件
     * @param {*} value 
     */
    changeYearHandler(value) {
        this.setState({
            showChangeYear: false,
            year: value,
            day: null,//清空，防止没有
        }, () => {

            this.props.updateYearAndMonth && this.props.updateYearAndMonth(value, this.state.month);
        })

    }
    /**
     * 选择月份
     */
    choseMonth() {
        this.setState({
            showChangeYear: false,
            showChangeMonth: !this.state.showChangeMonth,
        })
    }

    /**
   * 月份点击事件
   * @param {*} value 
   */
    changeMonthHandler(value) {
        this.setState({
            month: value,
            showChangeYear: false,
            showChangeMonth: false,
            day: null,

        }, () => {
            this.props.updateYearAndMonth && this.props.updateYearAndMonth(this.state.year, value);
        })



    }

    /**
     * 日点击事件
     * @param {*} day 
     * @param {*} event 
     */
    dayHandler(day, event) {
        event && event.stopPropagation();//阻止冒泡，防止下拉时注册的全局事件找不到父节点
        this.setState({
            day: day,

        })
        if (this.props.onSelect) {
            let value = this.state.year + "-" + (this.state.month.toString().length === 1 ? "0" + this.state.month.toString() : this.state.month)
                + "-" + (day < 10 ? "0" + day.toString() : day);

            this.props.onSelect(value, value, this.props.name);
        }

    }


    shouldComponentUpdate(nextProps, nextState) {
        if (utils.diff(nextProps, this.props,false)) {
            return true;
        }
        if (utils.diff(nextState, this.state)) {
            return true;
        }
        return false;
    }

    /**
     * 渲染上一部分
     * @returns 
     */
    renderHeader() {
        return <div className="wasabi-datetime-header">
            <div style={{ display: "inline", marginRight: 8 }} onClick={this.choseYear}>
                <span>{this.state.year}</span>.</div>
            <div style={{ display: "inline" }} onClick={this.choseMonth}><span>{(this.state.month * 1 < 10 ? "0" + (this.state.month * 1) : this.state.month)}</span>.</div>
        </div>


    }


    /**
     * 渲染下一部分
     * @returns 
     */
    renderBody() {
        const visible = (!this.state.showChangeMonth && !this.state.showChangeYear);
        const dayProps = {
            year: this.state.year,
            month: this.state.month,
            day: this.state.day,
            visible,
            isRange:this.props.isRange,
            rangeBegin: this.props.rangeBegin,
            rangeEnd: this.props.rangeEnd,
            dayHandler: this.dayHandler
        }
        const yearProps = {
            year: this.state.year,
            tempyear: this.state.tempyear,
            showChangeYear: this.state.showChangeYear,
            yearInputClick: this.yearInputClick,
            yearonBlur: this.yearonBlur,
            yearOKHandler: this.yearOKHandler,
            yearOnChange: this.yearOnChange,
            changeYearHandler: this.changeYearHandler
        }
        return (
            <div className="wasabi-datetime-body">
                <WeekView visible={visible}></WeekView>
                <DayView {...dayProps} ></DayView>
                <MonthView month={this.state.month} showChangeMonth={this.state.showChangeMonth} changeMonthHandler={this.changeMonthHandler}></MonthView>
                <YearView {...yearProps}></YearView>
            </div>
        )

    }
    render() {
        return (
            <div className="wasabi-datetime"  >
                <CalendarHeader year={this.state.year} month={this.state.month} choseYear={this.choseYear} choseMonth={this.choseMonth}></CalendarHeader>
                {this.renderBody()}
            </div>
        )
    }
}
Calendar.propTypes = {
    name: PropTypes.string,//字段名称，对应于表单
    year: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),//年
    month: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),//月
    day: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),//日
    isRange: PropTypes.bool,//是否为范围选择
    // 日期范围选择时开始值
    rangeBegin: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),//日期范围选择时开始值
    rangeEnd: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),//日期范围选择时结果值
    onSelect: PropTypes.func,//选择后的事件


};

export default Calendar;