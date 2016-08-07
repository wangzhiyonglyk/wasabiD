/**
 * Created by zhiyongwang on 2016-04-14.
 * 能够翻转的层
 */
var React=require("react");
require("../../sass/Base/Layout/reverse.scss");
var Reverse=React.createClass({
    propTypes: {
        front: React.PropTypes.object.isRequired,//正面
        reverse: React.PropTypes.object.isRequired,//反面
        dblReverse: React.PropTypes.bool,//是否允许双击翻转
        className: React.PropTypes.string,
    },

    getDefaultProps:function() {
        return {
            className:"",
            dblReverse:true
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
        if(!this.props.dblReverse)
        {
            return ;
        }
        if (this.state.isReverse) {

            this.mouseOutHandler();


        }
        else {

            this.mouseoverHandler()
        }

    },
    reverseHandler:function()
    {//用于父组件调用
      this.onDblClick();
    },
    render:function()
    {
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