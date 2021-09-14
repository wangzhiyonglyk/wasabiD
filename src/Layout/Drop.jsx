/**
 * Created by zhiyongwang on 2016-03-26.
 * 能停靠的层与LinkButton配合使用
 */
import React from 'react';
import PropTypes from "prop-types";

class Drop extends  React.Component {
    constructor(props) {
        super(props);
        this.dragOverHandler = this.dragOverHandler.bind(this);
        this.dragEnterHandler = this.dragEnterHandler.bind(this);
        this.dragLeaveHandler = this.dragLeaveHandler.bind(this);
        this.dropHandler = this.dropHandler.bind(this);
        this.state = {
            dropClass: "drop"
        }
    }
    dragOverHandler(event) {//在ondragover中一定要执行preventDefault()，否则ondrop事件不会被触发
        event.preventDefault();
        this.setState({
            dropClass: "drop dragEnter"//停靠的背景色
        })
      
    }

    dragEnterHandler() {
        // this.setState({
        //     dropClass: "drop dragEnter"//停靠的背景色
        // })
    }

    dragLeaveHandler() {

        this.setState({
            dropClass: "drop"//
        })
    }
    dropHandler() {
        this.setState({
            dropClass: "drop"
        })
        let dragData=window.localStorage.getItem("wasabi-dragItem")||"";
        window.localStorage.removeItem("wasabi-dragItem");
        this.props.onDrop(JSON.parse(dragData));
   
    }
    render() {
        return (
            <div className={(this.props.className||"")+ " " + this.state.dropClass} style={this.props.style} onDrop={this.dropHandler}
                 onDragEnter={this.dragEnterHandler} onDragOver={this.dragOverHandler}
                 onDragLeave={this.dragLeaveHandler}>
                {
                    this.props.children
                }
            </div>
        )
    }
}
Drop.propTypes={
    onDrop: PropTypes.func.isRequired,//元素停靠事件
}
export default Drop;