/*
 create by wangzy
 date:2016-05-20
 desc:将日期控件表头独立出来
 */
let React=require("react");
let Lang=require("../Lang/language.js");
require("../../sass/Base/Form/DateTime.scss");
let CalendarBody = React.createClass({
    PropTypes:{
        year: React.PropTypes.number,//年
        month:React.PropTypes.number,//月
        day:React.PropTypes.number,//日
        isRange:React.PropTypes.bool,//是否为范围选择
        min:React.PropTypes.number,//最小值，用于日期范围选择
        max:React.PropTypes.number,//最大值,用于日期范围选择
        dayHandler:React.PropTypes.func,//选择后的事件
    },
    getInitialState:function(){
        return {
            year:this.props.year,
            month:this.props.month,
            day:this.props.day,
            isRange:this.props.isRange,
            min:this.props.min,
            max:this.props.max,
        };
    },
    componentWillReceiveProps:function(nextProps) {
        this.setState({
            year:nextProps.year,
            month:nextProps.month,
            day:nextProps.day,
            isRange:nextProps.isRange,
            min:nextProps.min,
            max:nextProps.max,

        })
    },
    getMonthDays:function(){
        //根据月份获取当前天数
        var year = this.state.year,
            month = this.state.month;
        var temp = new Date(year,month,0);
        return temp.getDate();
    },
    getFirstDayWeek:function(){
        //获取当月第一天是星期几
        var year = this.state.year,
          month = this.state.month;
        var dt = new Date(year+'/'+month+'/1');
        var Weekdays = dt.getDay();
        return Weekdays;
    },
    dayHandler:function(day) {
        this.setState({
            day:day
        })
        this.props.dayHandler(day); // 执行父组件回调函数，改变父组件状态值
    },
    render:function(){
        var arry1 = [],arry2 = [];
        var getDays = this.getMonthDays(), FirstDayWeek = this.getFirstDayWeek();
        for(var i = 0 ;i < FirstDayWeek; i++ ){
            arry1[i] = i;
        }
        for(var i = 0 ;i < getDays; i++ ){
            arry2[i] = (i+1);
        }
        var node1 = arry1.map(function(item,i){
            return <div className="datespan" key={i}></div>
        })
        var node2 = arry2.map((item,index)=>{
            let choseed=false;//当前日期是否被选中
            if(this.state.isRange)
            {
                if(this.state.min&&this.state.max&&this.state.min<=item&&this.state.max>=item)
                {
                    choseed=true;
                }
            }
            else if(this.state.day==item) {
                choseed=true;
            }
            var control=null;
            if(item==this.state.min&&item==this.state.max)
            {
                control=<div className={"datespan "} key={"li2"+index}  onClick={this.dayHandler.bind(this,item)}><div className="onlyradius">{item}</div></div>;
            }
           else if(item==this.state.min)
            {
                control=<div className={"datespan begin"} key={"li2"+index}  onClick={this.dayHandler.bind(this,item)}>
                    <div className="blank"><div className="radius">{item}</div></div></div>;
            }
            else if(item==this.state.max)
            {
                control=<div className={"datespan end"} key={"li2"+index}  onClick={this.dayHandler.bind(this,item)}>
                    <div className="blank"><div className="radius">{item}</div></div></div>;
            }
            else if(choseed)
            {
                control=<div className={"datespan chosed"} key={"li2"+index}  onClick={this.dayHandler.bind(this,item)}>{item}</div>;
            }
            else {

                control=<div className={"datespan "} key={"li2"+index}  onClick={this.dayHandler.bind(this,item)}><div className="radius">{item}</div></div>;
            }
             return control;
        })
        return(
            <div className="wasabi-datetime-body">
                <div className="weekul">
                    <div className="weekspan">{Lang.cn.SUN}</div>
                    <div className="weekspan">{Lang.cn.MON}</div>
                    <div className="weekspan">{Lang.cn.TUE}</div>
                    <div className="weekspan">{Lang.cn.WED}</div>
                    <div className="weekspan">{Lang.cn.THU}</div>
                    <div className="weekspan">{Lang.cn.FRI}</div>
                    <div className="weekspan">{Lang.cn.SAT}</div>
                </div>
                <div className="dayul">{node1} {node2}</div>
            </div>
        )
    }
});
module .exports=CalendarBody;