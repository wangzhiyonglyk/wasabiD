/**
 * Created by 12295 on 2016/10/21.
 */
require("../sass/Unit/Progress.scss");
const React = require('react');
var Progress = React.createClass({
    propTypes:{
        width: React.PropTypes.number,//宽度（线性进步条的宽度   环形进度条的大小-宽高相等）
        percent:React.PropTypes.number,//进度条的百分数
        type:React.PropTypes.oneOf(['line', 'circle']),//进度条的类型
        height:React.PropTypes.number,//高度（线性进度条的高度）
        status:React.PropTypes.oneOf(['','active', 'exception']),//线性进步条的主题效果
        percent: function(props, propName, componentName) {//percent  的范围为0-100的正数
            if (!/^(\d{1,2}(\.\d+)?|100|NA)$/.test(props[propName])) {
                return new Error('Invalid prop\''+propName+'\'supplied to'+'\''+componentName+'\'.validation failed');
            }
        }
    },
    getDefaultProps: function() {
        return {
            width:100,
            type:'line',
            height:10,
            status:'',
        };
    },
    getInitialState:function(){
        var percent=this.props.percent>100?100:this.props.percent;
        return{
            percent:percent,
        }
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            percent:nextProps.percent>100?100:nextProps.percent,
        });
    },
    componentDidMount(){

        if(this.props.type=="circle"){
            var percent=0;
            var timer=setInterval(function(){
                percent+=1;
                if(percent>=this.state.percent){
                    clearInterval(timer);
                    percent=this.state.percent.toFixed(1);
                };
                if(!(percent-100)){
                   var percentShow="-99.99999s";
                }else{
                   var percentShow="-"+percent+"s";
                }
                document.getElementsByClassName("wasabi-pie")[0].style.animationDelay=percentShow;
                document.getElementsByClassName("pie-showInfo")[0].innerHTML=percent+"%";
            }.bind(this),12)
        };
        if(this.props.type=="line"&&this.props.status=="active"){//如果父组件的status为active   则需要执行下面代码   界面将动态加载进步条的进度
                    var percent=0
                    setInterval(function(){
                        if(percent==100){
                            percent=0;
                        }
                        percent+=1;
                        document.getElementsByClassName("wasabi-percentShowActive")[0].style.width=percent+"%";
                        document.getElementsByClassName("wasabi-percentShowActive")[0].style.opacity=0.8-percent/100*0.8;
                    }.bind(this),12)
                };
    },
    showInfo(){
        if(this.props.status=="exception"||this.state.percent==100){
            return (
                <div className={"progress-showIcon "+(this.state.percent==100?"success":"")} style={{height:this.props.height/1.2,width:this.props.height/1.2}}>
                    <i className="icon"></i>
                </div>
            )
        }else{
            return <span style={{fontSize:this.props.height/1.2}}>{this.state.percent.toFixed(1)}%</span>
        }
    },
    render(){
        switch (this.props.type){//通过父组件的type  判断需要渲染哪类进度条
            case 'line'://线性进步条
                var percentIsShow;//判断动态进步条层  是否显示
                percentIsShow=this.props.status=="active"?"block":"none";
                percentIsShow=this.state.percent==100?"none":"block";
                return (
                    <div className="wasabi-lineProgress-wrap">
                        <div className="wasabi-lineProgress" style={{width:this.props.width,height:this.props.height}}>
                            <div className={"wasabi-lineProgress-percentShow "+this.props.status+" "+(this.state.percent==100?"success":"")} style={{width:this.props.width*(this.state.percent/100),height:this.props.height}}>
                                <div className="wasabi-percentShowActive" style={{height:this.props.height,display:percentIsShow}}></div>
                            </div>
                        </div>
                        <div className="wasabi-showInfo" style={{lineHeight:this.props.height+"px"}}>
                            {
                                this.showInfo()
                            }
                        </div>
                    </div>
                );
                break;
            case 'circle'://环形进步条
                var marginLeft=-this.props.width*0.7/2;
                var percent="-"+this.state.percent+"s";
                return(
                    <div className="wasabi-pie" style={{width:this.props.width,height:this.props.width}}>
                        <div className="wasabi-pie-cover" style={{marginLeft:marginLeft,marginTop:marginLeft}}>
                            <span style={{fontSize:this.props.width/5+"px",color:"#666",width:"100%"}} className="pie-showInfo"></span>
                        </div>
                    </div>
                );
                break;
            default:
                console.log("传入的type值出错");
        }
    }
});
module.exports=Progress;