/*
create by wangzy
date:2016-05-20
desc:将日期控件表头独立出来
 */
let React=require("react");
let Lang=require("../Lang/language.js");
require("../Sass/Form/DateTime.scss");
let CalendarHeader = React.createClass({
    getInitialState:function(){
        return {
            year:this.props.year,
            month:this.props.month,
            day:this.props.day,
        };
    },
    componentWillReceiveProps:function(nextProps) {
        this.setState({
            year:nextProps.year,
            month:nextProps.month,
            day:nextProps.day,
        })
    },
    /*
    * 处理月份变化
    *@param {Number} month 月份变化数1或-1
    *@return
    * */
    _dealMonthClick:function(month){
        let m = parseInt(this.state.month,10) + month;
        if( m < 1 ){
            this.state.year --;
            m = 12;
        }else if( m > 12 ){
            this.state.year ++;
            m = 1;
        }
        this.state.month = m;
        this.setState(this.state);
        this.props.updateFilter(this.state.year,m);// 执行父组件回调函数，改变父组件状态值
    },
    handleLeftClick:function(){
        this._dealMonthClick(-1);
    },
    handleRightClick:function(){
        this._dealMonthClick(1);
    },
    changeYear:function () {
        if(this.props.changeYear)
        {
            this.props.changeYear();
        }

    },
    changeMonth:function () {
        if(this.props.changeMonth)
        {
            this.props.changeMonth();
        }

    },
    render:function(){
        return(
            <div className="wasabi-datetime-header">
                <div className="header-text" ><a href="javascript:void(0);" style={{marginRight:8}} onClick={this.changeYear}>
                    <span>{this.state.year+"年"}</span><i style={{fontSize:12,marginTop:2}} className="icon-down"></i></a>
                    <a  href="javascript:void(0);" onClick={this.changeMonth}><span>{Lang.cn.Month[this.state.month-1]+"月"}</span><i style={{fontSize:12,marginTop:2}} className="icon-down"></i></a></div>
                <a  href="javascript:void(0);" className="triangle-left"    onClick={this.handleLeftClick}>
                </a>
                <a  href="javascript:void(0);" className="triangle-right" onClick={this.handleRightClick}></a>
            </div>
        )
    }
});
module .exports=CalendarHeader;