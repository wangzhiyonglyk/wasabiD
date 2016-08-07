/*
create by wangzy
date:2016-06-12
desc:时间选择组件
 */
let React=require("react");
let Time=React.createClass({
    PropTypes: {
        name:React.PropTypes.string,//表单字段名称
        hour: React.PropTypes.number,//小时
        minute: React.PropTypes.number,//分钟
        second: React.PropTypes.number, //秒

    },
    getDefaultProps:function() {
        var date=new Date();
      return {
          hour:date.getHours(),
          minute:date.getMinutes(),
          second:date.getSeconds(),
      }
    },
    getInitialState:function() {
        return {
            hour:(this.props.hour<10)?"0"+this.props.hour:this.props.hour,
            minute:(this.props.minute<10)?"0"+this.props.minute:this.props.minute,
            second:(this.props.second<10)?"0"+this.props.second:this.props.second,
            height:0,
        }
    },
    componentDidMount:function() {
        this.onSelect();
    },
    hourHandler:function(value,tran) {
        let scrollTop=parseInt(this.refs.hour.scrollTop/24)*24;
        let lastScrollTop=value*24;
        this.scrollHandler(this.refs.hour,scrollTop,lastScrollTop,tran);
        this.setState({
            hour:value
        })
    },
    minuteHandler:function(value,tran) {
        let scrollTop=parseInt(this.refs.minute.scrollTop/24)*24;
        let lastScrollTop=value*24;
        this.scrollHandler(this.refs.minute,scrollTop,lastScrollTop,tran);
        this.setState({
            minute:value
        })

    },
    secondHandler:function(value,tran) {
        let scrollTop=parseInt(this.refs.second.scrollTop/24)*24;
        let lastScrollTop=value*24;
        this.scrollHandler(this.refs.second,scrollTop,lastScrollTop,tran);
        this.setState({
            second:value
        })

    },
    scrollHandler:function(obj,scrollTop,lastScrollTop,tran) {
          obj.scrollTop=scrollTop;
        if(scrollTop<lastScrollTop)
        {
            setTimeout(()=>
            {
                this.scrollHandler(obj,scrollTop+24,lastScrollTop,tran) ;
            },tran);

        }

    },
    mouseOutHandler:function(event) {//鼠标移开时隐藏下拉
        var parentE=event.relatedTarget;//相关节点
        while (parentE&&parentE.nodeName!="BODY")
        {
            if(parentE.className.indexOf("wasabi-time-picker-panel-inner")>-1)
            {
                break;
            }
            parentE=parentE.parentElement;
        }

        if(parentE==undefined||parentE==null||parentE.nodeName=="BODY")
        {
            setTimeout(()=>
            {
                this.setState({
                    height: 0,
                });
            },200);

        }

    },
    renderHour:function() {
        let hourControl=[];
        for(let index=0;index<24;index++)
        {
            var currentHour=(index<10)?"0"+index:index;
            hourControl.push(<li  className="timeitem" onClick={this.hourHandler.bind(this,currentHour,70)} key={"hour"+currentHour}
                                 className={(this.state.hour==currentHour)?"wasabi-time-picker-panel-select-option-selected":null}>{currentHour}</li>);
        }
        for(let index=0;index<5;index++)
        {
            hourControl.push(<li key={"nohour"+index}></li>);
        }
        return hourControl;
    },
    rendMinute:function() {
        let minuteControl=[];
        for(let index=0;index<60;index++)
        {
            var currentMinute=(index<10)?"0"+index:index;
                minuteControl.push(<li  className="timeitem" key={"minute"+currentMinute} onClick={this.minuteHandler.bind(this,currentMinute,70)}
                                        className={(this.state.minute==currentMinute)?"wasabi-time-picker-panel-select-option-selected":null}>{currentMinute}</li>);
        }
        for(let index=0;index<5;index++)
        {
            minuteControl.push(<li key={"nominute"+index}></li>);
        }
        return minuteControl;
    },
    rendSecond:function() {
        let secondControl=[];
        for(let index=0;index<60;index++)
        {
            var currentSecond=(index<10)?"0"+index:index;
            secondControl.push(<li className="timeitem" key={"second"+currentSecond} onClick={this.secondHandler.bind(this,currentSecond,70)}
                                   className={(this.state.second==currentSecond)?"wasabi-time-picker-panel-select-option-selected":null}>{currentSecond}</li>);
        }
        for(let index=0;index<5;index++)
        {
            secondControl.push(<li key={"nosecond"+index}></li>);
        }
        return secondControl;
    },
    onSelect:function(event) {
        this.setState({
            height:0,
        })
            if(this.props.onSelect!=null)
            {
                this.props.onSelect(this.state.hour+":"+this.state.minute+":"+this.state.second,this.state.hour+":"+this.state.minute+":"+this.state.second,this.props.name,null);
            }
    },
    showHandler:function() {
        this.setState({
            height:144,
        })
        this.hourHandler(this.state.hour,0);
        this.minuteHandler(this.state.minute,0);
        this.secondHandler(this.state.second,0);
    },
    changeHandler:function() {

    },
    render:function() {
      return <div className="wasabi-time-picker-panel-inner" onMouseOut={this.mouseOutHandler}>
          <div className="wasabi-time-picker-panel-input-wrap">
              <input className="wasabi-time-picker-panel-input  "
                     onClick={this.showHandler} onChange={this.changeHandler} value={this.state.hour+":"+this.state.minute+":"+this.state.second} placeholder="请选择时间"></input>

          </div>
            <div className="wasabi-time-picker-panel-combobox"  style={{height:this.state.height}}>
        <div ref="hour" key="hour" className="wasabi-time-picker-panel-select">
            <ul key="hour">{this.renderHour()}</ul>
            </div>
                <div ref="minute" key="minute" className="wasabi-time-picker-panel-select">
            <ul key="minute">{this.rendMinute()}</ul>
                    </div>
                <div ref="second" key="second" className="wasabi-time-picker-panel-select">
            <ul key="second">{this.rendSecond()}</ul>
            </div>
</div></div>
    }
})
module.exports=Time;