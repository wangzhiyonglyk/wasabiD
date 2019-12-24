
import   React ,{Component} from "react";
import PropTypes from "prop-types";
import  Button from "../Buttons/Button.jsx";
import ("../Sass/Unit/Message.css");
class  MessageView extends Component{
constructor(props)
{
    super(props);
    this.state={
      
            opacity:1,//透明度
            visible:true,//可见性
        
    }
}
  
    componentDidMount() {
        this.onmouse = false;////初始化
        if (this.props.type == "confirm"||this.props.type=="alert") {

        }
        else {
            this.timeOutHandler();//设置定时器
        }

    }
    OKHandler() {
        this.setState({
            visible:false
        })
        if(this.props.OKHandler!=null)
        {
            this.props.OKHandler();
        }
    }
    cancelHandler() {
        this.setState({
            visible:false
        })
        if(this.props.cancelHandler!=null)
        {
            this.props.cancelHandler();
        }
    }
    onMouseOver()
    {

        //先清空所有定时器
        this.onmouse=true;//标记属性在上面
        for(var  index=0;index<this.timeoutArray.length;index++)
        {
            clearTimeout(this.timeoutArray[index]);//清除定时器
        }

        this.setState({
            opacity:1,
        })
    }
    onMouseOut()
    {
        this.onmouse=false;//标记属性在上面

        this.timeOutHandler();//设置定时器
    }
    timeOutHandler() {

       this.timeoutArray=[];
       this.timeoutArray.push( setTimeout(()=> {
           if(this.onmouse==false) {
               this.setState({
                visible: false,
               })
           }
       }, this.props.timeout));
  

    }
    renderInfo(){
        return   <div onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} className={"wasabi-message "+this.props.type}
                      style={{display:this.state.visible?"inline-block":"none",opacity:this.state.opacity,transition:("opacity "+(this.props.timeout/1000).toString()+"s")}} >
            <div className="notice">{this.props.msg}</div>
        </div>
    }

    renderAlert () {
        return <div className="wasabi-confirm" style={{display:this.state.visible?"inline-block":"none"}}>
            <div className="message">
                {(this.props.msg==null||this.props.msg=="")?"友情提示?":this.props.msg}
            </div>
            <div className="buttons">
                <Button  name="ok" title="确定" onClick={this.cancelHandler}></Button>
            </div>
        </div>
    }
    renderConfirm() {
        return <div className="wasabi-confirm" style={{display:this.state.visible?"inline-block":"none"}}>
            <div className="message">
                {(this.props.msg==null||this.props.msg=="")?"确定删除这条信息吗?":this.props.msg}
            </div>
            <div className="buttons">
                <Button  name="ok" title="确定" onClick={this.OKHandler}></Button>
                <Button theme="cancel" name="cancel" title="取消"  onClick={this.cancelHandler}></Button>
            </div>
        </div>
    }
    render() {
        switch (this.props.type)
        {
            case "info":
                return this.renderInfo();
            case "success":
                return this.renderInfo();
            case "error":
                return this.renderInfo();
            case "alert":
                return this.renderAlert();
            case "confirm":
                return this.renderConfirm() ;
        }
        return null;
    }
}
MessageView. propTypes={
    type:PropTypes.oneOf([
        "alert",
        "info",
        "success",
        "error",
        "confirm",
    ]),
    msg: PropTypes.string.isRequired,//消息
    timeout:PropTypes.number,//自动消失时间
    cancelHandler:PropTypes.func,//取消事件
    OKHandler:PropTypes.func,//确定事件

};
MessageView.defaultProps = {
     
        type:"alert",
        msg: "",
        timeout:2000,
        showOK:true,
        showCancel:true,
    
};
 export default MessageView;