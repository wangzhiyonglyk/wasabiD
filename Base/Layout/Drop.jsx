/**
 * Created by zhiyongwang on 2016-03-26.
 * 能停靠的层与LinkButton配合使用
 */
var React=require("react");
var LinkButton=require("../Buttons/LinkButton.jsx");
require("../../sass/Base/Layout/Drop.scss");
var Drop=React.createClass({
    propTypes: {
        onDrop:React.PropTypes.func.isRequired,//元素停靠事件

    },
    getInitialState:function() {
        return {
            dropClass: "drop"
        }
    },
    dragOverHandler:function(event) {//在ondragover中一定要执行preventDefault()，否则ondrop事件不会被触发
        event.preventDefault();
        return  true;
    },
    dragEnterHandler:function()
    {
        this.setState({
            dropClass:"drop dragEnter"//停靠的背景色
        })
    },
    dropHandler:function()
    {
        this.setState({
            dropClass:"drop"
        })
        this.props.onDrop();
    },
    render:function()
    {


        var props=
        {
            style:this.props.style,
        }
        return (
            <div className={this.props.className+" "+this.state.dropClass} {...props}   onDrop={this.dropHandler} onDragEnter={this.dragEnterHandler} onDragOver={this.dragOverHandler}>
                {
                    this.props.children
                }
            </div>
        )
    }
})

module .exports=Drop;