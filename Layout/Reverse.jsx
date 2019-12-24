/**
 * Created by zhiyongwang on 2016-04-14.
 * 能够翻转的层
 */
var React=require("react");
require("../sass/Layout/reverse.css");
var Reverse=React.createClass({
    propTypes: {
        dblAble: React.PropTypes.bool,//是否允许双击翻转
        className: React.PropTypes.string,
    },
    getDefaultProps:function() {
        return {
            className:"",
            dblAble:true
        }
    },
    getInitialState: function () {
        return {
           isReverse:false,
            frontClassName:"",
            reverseClassName:"flip out",
            frontDisplay:"block",
            reverseDisplay:"none"

        }

    },
    componentWillReceiveProps:function(nextProps) {
    },
    mouseoverHandler:function() {

       this.setState({
           frontClassName:"flip out",
           isReverse:true,
       })
        var  parent=this;
        setTimeout(
            function()
            {
             parent.setState({
                 frontDisplay:"none",
                 reverseDisplay:"block",
                 reverseClassName:"flip in"
             })
            },300
        )
    },
    mouseOutHandler:function() {
        this.setState({
            reverseClassName:"flip out",
            isReverse:false
        })
        var  parent=this;
        setTimeout(
            function()
            {
                parent.setState({
                    frontDisplay:"block",
                    reverseDisplay:"none",
                    frontClassName:"flip in"
                })
            },300
        )
    },
    onDblClick:function() {
        if(!this.props.dblAble)
        {
            return ;
        }
        this.reverseHandler();
    },
    getState:function()
    {//用获取状态用于父组件

        return this.state.isReverse;
    },
    reverseHandler:function() {//用于父组件调用
        if (this.state.isReverse) {

            this.mouseOutHandler();


        }
        else {

            this.mouseoverHandler()
        }

    },
    render:function() {
        var props=
        {
            style:this.props.style,
            className:this.props.className+" reverse"
        }
        return (
            <div  onDoubleClick={this.onDblClick}  {...props}>
                <div  ref="front" className={this.state.frontClassName} style={{display:this.state.frontDisplay}} >
                    {this.props.front}
                </div>
                <div  ref="reverse"  className={this.state.reverseClassName} style={{display:this.state.reverseDisplay}} >
                    {this.props.reverse}
                </div>
            </div>
        )
    }
});
module .exports=Reverse;