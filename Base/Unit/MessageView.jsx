
var React=require("react");
var Button=require("../Buttons/Button.jsx");
require("../../sass/Base/Unit/Message.scss");
let MessageView= React.createClass({
    propTypes: {
        type:React.PropTypes.oneOf([
            "alert",
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
            visible:true,//可见性
        }
    },
    componentDidMount:function() {
     if(this.props.type!="confirm")
     {
         setTimeout(()=> {
              this.setState({
                  visible:false
              })
         },this.props.timeout)
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
    renderInfo:function(){
      return   <div className={"wasabi-message "+this.props.type} style={{display:this.state.visible?"inline-block":"none"}} >
            <div className="notice">{this.props.msg}</div>
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
            case "alert":
                return this.renderInfo();
            case "success":
                return this.renderInfo();
            case "error":
                return this.renderInfo();
            case "confirm":
                return this.renderConfirm() ;
        }
        return null;
    }
});
module.exports=MessageView;