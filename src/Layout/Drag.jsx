/**
 * create by wangzhiyong
 * date:2020-08-09
 * 一个可以看拖动的盒子
 */
import React from 'react';
import PropTypes from "prop-types";
import func from '../libs/func'
import "../Sass/Layout/Drag.css"
class Drag extends React.Component {
  constructor() {
    super();
    this.state = {
      cantainerid: Math.random().toString(36).slice(-8) + 'drag' + func.dateformat(new Date(), 'yyyyMMddHHmmss'),
      dotid: Math.random().toString(36).slice(-8) + 'dot' + func.dateformat(new Date(), 'yyyyMMddHHmmss'),
    };
    // this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    // this.mouseUpHandler = this.mouseUpHandler.bind(this)
    this.onDragStart=this.onDragStart.bind(this);
    this.onDragEnd=this.onDragEnd.bind(this);
  }
  // onMouseDown(event) {
  //   return ;
  //   let cantainer = document.getElementById(this.state.cantainerid);
  //   let position = cantainer.getBoundingClientRect();
  //   if (position) {
  //     this.position = position;//记住方向
  //     //记住原始位置
  //     this.oldClientX = event.clientX;
  //     this.oldClientY = event.clientY;
  //     document.body.addEventListener("mousemove", this.mouseMoveHandler);
  //     document.body.addEventListener("mouseup", this.mouseUpHandler);
  //     let dot = document.getElementById(this.state.dotid);
  //     dot.style.left = position.left + "px";
  //     dot.style.top = position.top + "px";
  //     dot.style.width = (position.width + 4) + "px";
  //     dot.style.height = (position.height + 4) + "px";
  //     this.mouse = false;//标记不可移动
  //   }
  // }

  // mouseMoveHandler(event) {
  //   if (this.position != null) {
  //     let dot = document.getElementById(this.state.dotid);
  //     dot.style.left = (this.position.left + event.clientX - this.oldClientX) + "px";
  //     dot.style.top = (this.position.top + event.clientY - this.oldClientY) + "px";
  //     if (Math.abs(event.clientX - this.oldClientX) > 20) {
  //       dot.style.display = "block";
  //     }
  //     if (this.position.width < Math.abs(event.clientX - this.oldClientX) || this.position.height < Math.abs(event.clientY - this.oldClientY)) {
  //       this.mouse = true;//可移动
  //       this.props.dragBegin && this.props.dragBegin(this.props.data);


  //     }
  //   }
  // }
  // mouseUpHandler(event) {
  //   this.position = null;
  //   let dot = document.getElementById(this.state.dotid);
  //   dot.style.display = "none";
  //   document.body.removeEventListener("mousemove", this.mouseMoveHandler);
  //   document.body.removeEventListener("mouseup", this.mouseUpHandler);
  //   if (this.mouse) {
  //     window.localStorage.setItem("wasabi-dragItem",JSON.stringify(this.state.data));
  //     this.props.dragHanlder && this.props.dragHanlder(this.props.data);
  //   }

  // }
  onDragStart(){
    window.localStorage.setItem("wasabi-dragItem",JSON.stringify(this.props.data||""));
        this.props.onDragStart && this.props.onDragStart(this.props.data);
  }
  onDragEnd(){
    this.props.onDragEnd && this.props.onDragEnd(this.props.data);
  }

  render() {
    return <div draggable={true} id={this.state.cantainerid} className={"wasabi-drag-box " + this.props.className} style={this.props.style} onDragStart={this.onDragStart}  
    onDragEnd={this.onDragEnd}
    >
      {this.props.children}
      {/* <div id={this.state.dotid} className={"wasabi-drag-box-dot " + this.props.className} style={this.props.style}>
        {this.props.children}
      </div> */}

    </div>
  }

}

Drag.propTypes = {
  data: PropTypes.any, //其他数据
  style: PropTypes.object,
  className: PropTypes.string,
  widthChid: PropTypes.bool, //拖动时是否带上子节点影子
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
}
Drag.defaultProps = {
  name: "",
  data: {},
  style: {},
  className: "",
  widthChid: true,
  onDragStart: null,
  onDragEnd: null
}
export default Drag;
