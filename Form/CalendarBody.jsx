/*
 create by wangzy
 date:2016-05-20
 desc:将日期控件表头独立出来
 */
let React=require("react");
let Lang=require("../Lang/language.js");
let Text=require("./Text.jsx");
let Message=require("../Unit/Message.jsx");
require("../Sass/Form/DateTime.scss");
let CalendarBody = React.createClass({
    PropTypes:{
        year: React.PropTypes.number,//年
        month:React.PropTypes.number,//月
        day:React.PropTypes.number,//日
        isRange:React.PropTypes.bool,//是否为范围选择
        min:React.PropTypes.number,//最小值，用于日期范围选择
        max:React.PropTypes.number,//最大值,用于日期范围选择
        dayHandler:React.PropTypes.func,//选择后的事件
        changeYear:React.PropTypes.bool,
        changeMonth:React.PropTypes.bool,
        changeYearHandler:React.PropTypes.func,
        changeMonthHandler:React.PropTypes.func,
    },
    getInitialState:function(){
        return {
            year:this.props.year,
            tempyear:this.props.tempyear,//临时的，防止输入框改变后对整个组件产生影响
            month:this.props.month,
            day:this.props.day,
            isRange:this.props.isRange,
            min:this.props.min,
            max:this.props.max,
            changeYear:this.props.changeYear,
            changeMonth:this.props.changeMonth,
        };
    },
    componentWillReceiveProps:function(nextProps) {
        this.setState({
            year:nextProps.year,
            tempyear:nextProps.year,
            month:nextProps.month,
            day:nextProps.day,
            isRange:nextProps.isRange,
            min:nextProps.min,
            max:nextProps.max,
            changeYear:nextProps.changeYear,
            changeMonth:nextProps.changeMonth,
        })
    },
    getMonthDays:function(){
        //根据月份获取当月总天数
        return new Date(this.state.year,this.state.month,0).getDate();
    },
    getFirstDayWeek:function(){
        //获取当月第一天是星期几
        return new Date(this.state.year,this.state.month - 1,1).getDay();
    },
    dayHandler:function(day) {
        this.setState({
            day:day
        })
        this.props.dayHandler(day); // 执行父组件回调函数，改变父组件状态值
    },
    yearOnChange:function (event) {
        this.setState({
            tempyear: event.target.value,
        })
    },
    changeYearHandler:function (value) {
        if(this.props.changeYearHandler){
            this.props.changeYearHandler(value);
        }
    },
    changeMonthHandler:function (value) {
        if(this.props.changeMonthHandler){
            this.props.changeMonthHandler(value);
        }
    },
    yearOKHandler:function (event) {
        if (event.keyCode == 13) {
            this.yearonBlur(event);//共用函数
        }
    },
    yearonBlur:function (event) {
        let year = event.target.value << 0;//转成数字
        year < 1900 || year > 9999 ? Message.error("不是有效年份") : this.changeYearHandler(event.target.value);
    },

    render:function(){
        //TODO 以下代码有待优化
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
                if(this.state.isRange)
                {
                    control=<div className={"datespan chosed"} key={"li2"+index}  onClick={this.dayHandler.bind(this,item)}>{item}</div>;

                }
                else
                {
                    control=<div className={"datespan "} key={"li2"+index}  onClick={this.dayHandler.bind(this,item)}><div className="onlyradius">{item}</div></div>;

                }
           }
            else {

                control=<div className={"datespan "} key={"li2"+index}  onClick={this.dayHandler.bind(this,item)}><div className="radius">{item}</div></div>;
            }
             return control;
        })

        var yearControl=[];
        for(var index=this.state.year*1-7;index<=this.state.year*1+4;index++) {
            if(index==this.state.year*1)
            {
                yearControl.push(<div className="datespan chosed" onClick={this.changeYearHandler.bind(this,index)} key={"year" + index}>{index}</div>);
            }
            else{
                yearControl.push(<div className="datespan"  onClick={this.changeYearHandler.bind(this,index)} key={"year" + index}>{index}</div>);
            }

        }
        return(
            <div className="wasabi-datetime-body">
                <div className="weekul" style={{display:(!this.state.changeMonth&&!this.state.changeYear)?"block":"none"}}>
                    <div className="weekspan">{Lang.cn.SUN}</div>
                    <div className="weekspan">{Lang.cn.MON}</div>
                    <div className="weekspan">{Lang.cn.TUE}</div>
                    <div className="weekspan">{Lang.cn.WED}</div>
                    <div className="weekspan">{Lang.cn.THU}</div>
                    <div className="weekspan">{Lang.cn.FRI}</div>
                    <div className="weekspan">{Lang.cn.SAT}</div>
                </div>
                <div className="dayul" style={{display:(!this.state.changeMonth&&!this.state.changeYear)?"block":"none"}}>{node1} {node2}</div>
                <div  className="wasabi-datetime-month" style={{display:this.state.changeMonth?"block":"none"}}>

                    <div  className={"datespan "+((this.state.month==1)?"chosed":"")} onClick={this.changeMonthHandler.bind(this,1)}>一月</div>
                    <div  className={"datespan "+((this.state.month==2)?"chosed":"")} onClick={this.changeMonthHandler.bind(this,2)}>二月</div>
                    <div  className={"datespan "+((this.state.month==3)?"chosed":"")} onClick={this.changeMonthHandler.bind(this,3)}  >三月</div>
                    <div  className={"datespan "+((this.state.month==4)?"chosed":"")} onClick={this.changeMonthHandler.bind(this,4)}>四月</div>
                    <div  className={"datespan "+((this.state.month==5)?"chosed":"")} onClick={this.changeMonthHandler.bind(this,5)}>五月</div>
                    <div  className={"datespan "+((this.state.month==6)?"chosed":"")} onClick={this.changeMonthHandler.bind(this,6)}>六月</div>
                    <div  className={"datespan "+((this.state.month==7)?"chosed":"")} onClick={this.changeMonthHandler.bind(this,7)}>七月</div>
                    <div  className={"datespan "+((this.state.month==8)?"chosed":"")} onClick={this.changeMonthHandler.bind(this,8)}>八月</div>
                    <div  className={"datespan "+((this.state.month==9)?"chosed":"")} onClick={this.changeMonthHandler.bind(this,9)}>九月</div>
                    <div  className={"datespan "+((this.state.month==10)?"chosed":"")} onClick={this.changeMonthHandler.bind(this,10)}>十月</div>
                    <div  className={"datespan "+((this.state.month==11)?"chosed":"")} onClick={this.changeMonthHandler.bind(this,11)}>十一月</div>
                    <div  className={"datespan "+((this.state.month==12)?"chosed":"")} onClick={this.changeMonthHandler.bind(this,12)}>十二月</div>
                </div>
                <div  className="wasabi-datetime-year" style={{display:this.state.changeYear?"block":"none"}}>
                    <div style={{display:"block",textAlign:"center",marginBottom:10}}><input value={this.state.tempyear} name="year" onBlur={this.yearonBlur} onKeyUp={this.yearOKHandler} style={{width:60,height:30,paddingLeft:5}} title="回车确认" onChange={this.yearOnChange}></input></div>
                    {yearControl}</div>
            </div>
        )
    }
});
module .exports=CalendarBody;