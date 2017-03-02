/*
create by wangzy
date:2016-05-20
desc:日期范围选择控件
 */
let React=require("react");
let Lang=require("../Lang/language.js");
let regs=require("../Lang/regs.js");
let DateD=require("./DateD.jsx");
let Button=require("../Buttons/Button.jsx");
var shouldComponentUpdate=require("../Mixins/shouldComponentUpdate.js");
let DateRange=React.createClass({
    mixins:[shouldComponentUpdate],
    PropTypes:{
        name:React.PropTypes.string,//名称
        firstDate:React.PropTypes.string,//第一个日期
        secondDate:React.PropTypes.string,//第二个日期
        onSelect:React.PropTypes.func,//确定事件
        attachTime:React.PropTypes.bool,//j是否附加时间格式
        time:React.PropTypes.string,
        timeEnd:React.PropTypes.string,
    },
    getDefaultProps:function () {
        return{
            name:null,
            firstDate:null,
            secondDate:null,
            onSelect:null,//

            attachTime:true,
            time:"00:00:00",
            timeEnd:"23:59:59"
        }
    },
    getInitialState:function() {
        //先设置默认值的，再判断用户是否有输入值

        return  this.setDefaultState(this.props);
    },
    componentWillReceiveProps:function(nextProps) {
       this.setDefaultState(nextProps);
    },
    setDefaultState(props){
        //先设置默认值的，再判断用户是否有输入值

        var newDate =  new Date();
        var first_year=newDate.getFullYear();
        var first_month=newDate.getMonth()+1;
        var first_day=null;
        let first_min=null; let first_max=null;
        let second_min=null;let second_max=null;
        var firstDate=props.firstDate;

        if(firstDate&&firstDate.indexOf(" ")>-1&&regs.datetime(firstDate)) {//有时间
            firstDate= props.firstDate.split(" ")[0];
        }
        else if(regs.date.test(firstDate)) {//正规的日期格式

        }
        else{
            firstDate=null;

        }
        if(firstDate) {
            first_year = firstDate.split("-")[0] * 1;
            first_month = firstDate.split("-")[1] * 1;
            first_day = firstDate.split("-")[2] * 1;
        }
        //设置第二日期的默认值
        var second_year=first_year;var second_month;var second_day=null;
        second_month = parseInt(first_month) + 1;
        if( second_month > 12 ){
            second_year ++;
            second_month = 1;
        }
        else {

        }
        //第二个日期
        var secondDate = props.secondDate;
        if (secondDate&&secondDate.indexOf(" ") > -1 && regs.datetime(secondDate)) {//有时间
            secondDate = props.secondDate.split(" ")[0];
        }
        else if (secondDate&&regs.date.test(secondDate)) {//正规的日期格式

        }
        else {
            secondDate = null;


        }
        if(secondDate)
        {//输入了值
            if(secondDate.split("-")[0]*1>first_year||secondDate.split("-")[1]*1>first_month) {//不相等才赋值
                second_year = secondDate.split("-")[0] * 1;
                second_month = secondDate.split("-")[1] * 1;
                second_max=  second_day = secondDate.split("-")[2] * 1;
                second_min=1;
                first_min=first_day;
                first_max=31;
            }
            else  if(secondDate.split("-")[0]*1==first_year||secondDate.split("-")[1]*1==first_month) {//不相等才赋值

                first_max =secondDate.split("-")[2] * 1;
                first_min=first_day;
            }
        }
        else {//第二日期没有值
            first_min=first_max=first_day;
        }
        return{
            first_year:first_year,
            first_month:first_month,
            first_day:first_day,
            first_min:first_min,
            first_max:first_max,
            second_year:second_year,
            second_month:second_month,
            second_day:second_day,
            second_min:second_min,
            second_max:second_max,
        }
    },
    firstMonthHandler:function(year,month) {
          this.setState({
              first_year:year,
              first_month:month,
              first_day:null,
              first_min:null,
              first_max:null,
          })
    },
    secondMonthHandler:function(year,month) {
        this.setState({
            second_year:year,
            second_month:month,
            second_day:null,
            second_min:null,
            second_max:null,
        })
    },
    firstHandler:function(value) {//开始日期选择事件
        if(value&&value.indexOf(" ")>-1)
        {//有时间
            value=value.split(" ")[0];
        }
        var min_day=this.state.first_min;
        var max_day=this.state.first_max;
        /*单向选择判断*/
        if((!min_day&&!max_day)||min_day!=max_day) {
            //都为空，或者已经选择过了，重新选择
            min_day=value.split("-")[2]*1;
            max_day=value.split("-")[2]*1;}
        else if(min_day==max_day) {
            //已经选择了一个
            if(min_day<value.split("-")[2]*1) {
                //比最小值大
                max_day=value.split("-")[2]*1;
            }
           else
            {//比最小值小，调换
                max_day=min_day;
                min_day=value.split("-")[2]*1;

            }
        }
        /*单向选择判断*/

        /*判断与第二个日期的复合情况*/
        var second_min=this.state.second_min;
        var second_max=this.state.second_max;
        if(min_day==max_day) {//第一个日期只选择了一个
            if(this.state.beign_min!=this.state.first_max)
            {//第一个日期之前已经选择过了属于重新选择，第二个日期清空
                second_min=second_max=null;
            }
            else {
              //第一个日期之前没有选择过不属于重新选择
                if(second_min) {//第二个日期框有选择
                    second_min=1;//设置第二个日期中的开始日期为1
                    max_day=31;//设置第一个日期中的结束日期为最大
                }
            }

        }
        else {//第一个日期中的开始日期与日期不相同，第二个日期默认清空
            second_min=null;
            second_min=null;
        }
        /*判断与后面一个的复合情况*/
            this.setState({
                first_year:value.split("-")[0]*1,
                first_month:value.split("-")[1]*1,
                first_day:value.split("-")[2]*1,
                first_min:min_day,
                first_max:max_day,
                second_min:second_min,
                second_max:second_max,
            });
    },
    secondHandler:function(value) {//结束日期选择事
        if(value&&value.indexOf(" ")>-1)
        {//有时间
            value=value.split(" ")[0];
        }
        var min_day=this.state.second_min;
        var max_day=this.state.second_max;
        /*单向选择判断*/
        if((!min_day&&!max_day)||min_day!=max_day) {
            //都为空，或者已经选择过了，重新选择
            min_day=value.split("-")[2]*1;
            max_day=value.split("-")[2]*1;}
        else if(min_day==max_day) {
            //已经选择了一个
            if(min_day<value.split("-")[2]*1) {
                //比最小值大
                max_day=value.split("-")[2]*1;
            }
            else
            {//比最小值小，调换
                max_day=min_day;
                min_day=value.split("-")[2]*1;

            }
        }
        /*单向选择判断*/

        /*判断与第一个的复合情况*/
        var first_min=this.state.first_min;
        var first_max=this.state.first_max;
        if(min_day==max_day) {//第二个日期只选择了一个
            if(this.state.second_min!=this.state.second_max)
            {//第二个日期之前已经选择过了属于重新选择，第一个日期清空
                first_min=   first_max=null;

            }else {  //第二个日期之前没有选择过不属于重新选择
                if (first_min) {//第一个日期框有选择
                    first_max = 31;//设置第一个日期 的结束日期为最大
                    min_day = 1;//设置第二个日期 的开始日期为最为1
                }
            }
        }
        else {//第二个日期中的开始日期与日期不相同，第一个日期默认清空
            first_min=null;
            first_max=null;
        }
         this.setState({
                    second_year:value.split("-")[0]*1,
                    second_month:value.split("-")[1]*1,
                    second_day:value.split("-")[2]*1,
                    second_min:min_day,
                    second_max:max_day,
                    first_min:first_min,
                    first_max:first_max,
         });
    },
    onSelectHandler:function() {
        var firstDate,secondDate;
        if(this.state.first_min!=null)
        {
            firstDate=this.state.first_year+"-"+(this.state.first_month.toString().length==1?"0"+this.state.first_month:this.state.first_month)+"-"+(this.state.first_min.toString().length==1?"0"+this.state.first_min:this.state.first_min);
        }
        else if(this.state.second_min!=null){
            firstDate=this.state.second_year+"-"+(this.state.second_month.toString().length==1?"0"+this.state.second_month:this.state.second_month)+"-"+(this.state.second_min.toString().length==1?"0"+this.state.second_min:this.state.second_min);
        }

        if(this.state.second_max!=null){
            secondDate=this.state.second_year+"-"+(this.state.second_month.toString().length==1?"0"+this.state.second_month:this.state.second_month)+"-"+(this.state.second_max.toString().length==1?"0"+this.state.second_max:this.state.second_max);
        }
        else   if(this.state.first_max!=null)
        {
            secondDate=this.state.first_year+"-"+(this.state.first_month.toString().length==1?"0"+this.state.first_month:this.state.first_month)+"-"+(this.state.first_max.toString().length==1?"0"+this.state.first_max:this.state.first_max);
        }

        if(this.props.onSelect!=null)
        {

               if(firstDate&&secondDate) {
                   if(this.props.attachTime)
                   {
                       firstDate+=" "+this.props.time;
                       secondDate+=" "+this.props.timeEnd;
                   }
                   this.props.onSelect(firstDate + "," + secondDate, firstDate + "," + secondDate, this.props.name);
               }

        }

    },
    cancelHandler:function() {
        this.props.onSelect(null,null,this.props.name);
    },
    render:function() {
         return (<div>
             <div className="ok">
                 <Button title="确定" name="ok" ripple={false}  theme="green" onClick={this.onSelectHandler}></Button>
                 <Button title="取消" name="ok"  ripple={false} theme="cancel" onClick={this.cancelHandler}></Button>
             </div>
            <DateD   isRange={true}  year={this.state.first_year} month={this.state.first_month} day={this.state.first_day}
                        min={this.state.first_min} max={this.state.first_max}
                        onSelect={this.firstHandler}
                        updateYearAndMonth={this.firstMonthHandler}
            ></DateD>
             <DateD  isRange={true}   year={this.state.second_year} month={this.state.second_month} day={this.state.second_day}
                        min={this.state.second_min} max={this.state.second_max}
                        onSelect={this.secondHandler }
                        updateYearAndMonth={this.secondMonthHandler}
             ></DateD>

         </div>)
    },
});
module.exports=DateRange;
