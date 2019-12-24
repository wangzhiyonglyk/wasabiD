/*
create by wangzy
date:2016-05-20
desc:将日期控件表头独立出来
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Lang from "../Lang/language.js";

require("../Sass/Form/DateTime.css");
class CalendarHeader  extends Component{
    constructor(props)
    {
        super(props);
        this.state={
            year:this.props.year,
            month:this.props.month,
            day:this.props.day,
        }
        this._dealMonthClick=this._dealMonthClick.bind(this);
        this.handleLeftClick=this.handleLeftClick.bind(this);
        this.handleRightClick=this.handleRightClick.bind(this);
        this.changeYear=this.changeYear.bind(this);
        this.changeMonth=this.changeMonth.bind(this);
    }
  
    componentWillReceiveProps(nextProps) {
        this.setState({
            year:nextProps.year,
            month:nextProps.month,
            day:nextProps.day,
        })
    }
    /*
    * 处理月份变化
    *@param {Number} month 月份变化数1或-1
    *@return
    * */
    _dealMonthClick(month){
        let m = parseInt(this.state.month,10) + month;
        if( m < 1 ){
            this.state.year --;
            m = 12;
        }else if( m > 12 ){
            this.state.year ++;
            m = 1;
        }
        this.state.month = m;
        this.setState({
            month:m
        });
        this.props.updateFilter(this.state.year,m);// 执行父组件回调函数，改变父组件状态值
    }
    handleLeftClick(){
        this._dealMonthClick(-1);
    }
    handleRightClick(){
        this._dealMonthClick(1);
    }
    //改变年份
    changeYear () {
        if(this.props.changeYear)
        {
            this.props.changeYear();
        }

    }
    //改变月份
    changeMonth () {
        if(this.props.changeMonth)
        {
            this.props.changeMonth();
        }

    }
    render(){
        return(
            <div className="wasabi-datetime-header">
                <div className="header-text" ><a  style={{marginRight:8}} onClick={this.changeYear}>
                    <span>{this.state.year}</span><i style={{fontSize:12,marginTop:2}} className="icon-down"></i></a>
                    <a   onClick={this.changeMonth}><span>{Lang.cn.Month[this.state.month-1]}</span><i style={{fontSize:12,marginTop:2}} className="icon-down"></i></a></div>
                <a   className="triangle-left"    onClick={this.handleLeftClick}>
                </a>
                <a   className="triangle-right" onClick={this.handleRightClick}></a>
            </div>
        )
    }
}
export default CalendarHeader;