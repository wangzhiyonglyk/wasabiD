
var React=require("react");
var Button=require("../Buttons/Button.jsx");
require("../Sass/Unit/Message.scss");
let MessageView= React.createClass({
    propTypes: {
        type:React.PropTypes.oneOf([
            "alert",
            "info",
            "success",
            "error",
            "confirm",
        ]),
        msg: React.PropTypes.string.isRequired,//消息
        timeout:React.PropTypes.number,//自动消失时间
        cancelHandler:React.PropTypes.func,//取消事件
        OKHandler:React.PropTypes.func,//确定事件

    },
    getDefaultProps: function () {
        return {
            type:"alert",
            msg: "",
            timeout:2000,
            showOK:true,
            showCancel:true,
        }
    },
    getInitialState:function() {
        return {
            opacity:1,//透明度
            visible:true,//可见性
        }
    },
    componentDidMount:function() {
        this.onmouse = false;////初始化
        if (this.props.type == "confirm"||this.props.type=="alert") {

        }
        else {
            this.timeOutHandler();//设置定时器
        }

    },
    OKHandler:function() {
        this.setState({
            visible:false
        })
        if(this.props.OKHandler!=null)
        {
            this.props.OKHandler();
        }
    },
    cancelHandler:function() {
        this.setState({
            visible:false
        })
        if(this.props.cancelHandler!=null)
        {
            this.props.cancelHandler();
        }
    },
    onMouseOver:function()
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
    },
    onMouseOut:function()
    {
        this.onmouse=false;//标记属性在上面

        this.timeOutHandler();//设置定时器
    },
    timeOutHandler:function() {

       this.timeoutArray=[];
       this.timeoutArray.push( setTimeout(()=> {
           if(this.onmouse==false) {
               this.setState({
                   opacity: 0.7,
               })
           }
       }, 1000));
      this.timeoutArray.push(
          setTimeout(()=> {
              if(this.onmouse==false) {
                  this.setState({

                      visible: false,
                  })
              }
          }, this.props.timeout *2)

        );

    },

    renderInfo:function(){
        return   <div onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} className={"wasabi-message "+this.props.type}
                      style={{display:this.state.visible?"inline-block":"none",opacity:this.state.opacity,transition:("opacity "+(this.props.timeout/1000).toString()+"s")}} >
            <div className="notice">{this.props.msg}</div>
        </div>
    },

    renderAlert:function () {
        return <div className="wasabi-confirm" style={{display:this.state.visible?"inline-block":"none"}}>
            <div className="message">
                {(this.props.msg==null||this.props.msg=="")?"友情提示?":this.props.msg}
            </div>
            <div className="buttons">
                <Button theme="green" name="ok" title="确定" onClick={this.cancelHandler}></Button>
            </div>
        </div>
    },
    renderConfirm:function() {
        return <div className="wasabi-confirm" style={{display:this.state.visible?"inline-block":"none"}}>
            <div className="message">
                {(this.props.msg==null||this.props.msg=="")?"确定删除这条信息吗?":this.props.msg}
            </div>
            <div className="buttons">
                <Button theme="green" name="ok" title="确定" onClick={this.OKHandler}></Button>
                <Button theme="cancel" name="cancel" title="取消"  onClick={this.cancelHandler}></Button>
            </div>
        </div>
    },
    render: function () {
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
});
module.exports=MessageView;