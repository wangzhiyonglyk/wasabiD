/*
 create by wangzhiyong
 date:2017-02-09
 desc:圣杯布局，右侧
 */
import React from "react";
import PropTypes from "prop-types";
import func from "../libs/func"
import dom from "../libs/dom"
class Right extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            min: 5,
            separatorid: Math.random().toString(36).slice(-8)
        }
        this.targets = [];//用于清除
        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        this.mouseUpHandler = this.mouseUpHandler.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    }
    static defaultProps = {
        type: "right",
        top: 0,
        width: 0,
        height: 0
    }
    static propTypes = {
        top: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        reduceHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }
    componentDidMount() {//设置鼠标事件
        let center = document.getElementById(this.props.centerid);
        if(center){
           document.addEventListener( "mousedown", this.mouseDownHandler)
        }
      
    }
    /**
       * 鼠标移动事件
       * @param {*} event 
       */
    mouseMoveHandler(event) {
        let center = document.getElementById(this.props.centerid);
        if (this.position !==null && center) {
            let target = document.getElementById(this.state.separatorid);
            let right = document.getElementById(this.props.rightid);
            let left = document.getElementById(this.props.leftid);

            let leftWidth = left && left.getBoundingClientRect().width || 0;//左边的宽度
           right? right.style.cursor = "ew-resize":null;
            center.style.cursor = "ew-resize";
            right? right.style.userSelect = "none":null;
            center.style.userSelect = "none";
            event.target.style.cursor = "ew-resize";
            if (this.targets.push(event.target));//保留，用于还原
        
            if (event.clientX - this.oldClientX > 2 || event.clientX - this.oldClientX < -2) {//防止抖动
                target.style.right = (   this.position.rightWidth + (event.clientX - this.oldClientX) * -1) + "px";
                right.style.width = (   this.position.rightWidth + (event.clientX - this.oldClientX) * -1) + "px";

                center.style.width = "calc(100% - " + (leftWidth +    this.position.rightWidth+ (event.clientX - this.oldClientX) * -1) + "px)";
            }

        }
    }
    /**
     * 鼠标按下事件
     * @param {*} event 
     */
    mouseDownHandler(event) {


        if (dom.isDescendant(document.getElementById(this.state.separatorid), event.target) || event.target.className == "wasabi-separator-right") {
           document.addEventListener( "mousemove", this.mouseMoveHandler)
           document.addEventListener( "mouseup", this.mouseUpHandler)
            //记住原始位置
            this.oldClientX = event.clientX;
            this.oldClientY = event.clientY;
            let target = document.getElementById(this.state.separatorid);
            this.position = target.getBoundingClientRect();
            let right = document.getElementById(this.props.rightid);
            this.position.rightWidth=right.getBoundingClientRect().width;
        } else {
            this.position = null;
        }

    }

    /**
     * 鼠标松开事件
     * @param {*} event 
     */
    mouseUpHandler(event) {
        this.position = null;
        let left = document.getElementById(this.props.leftid);
        let center = document.getElementById(this.props.centerid);
        let right = document.getElementById(this.props.rightid);

        left ? left.style.cursor = "pointer" : null;
        center ? center.style.cursor = "pointer" : null;
        right ? right.style.cursor = "pointer" : null;
        left ? left.style.userSelect = "text" : null;
        center ? center.style.userSelect = "text" : null;
        right ? right.style.userSelect = "text" : null;
        for (let i = 0; i < this.targets.length; i++) {
            this.targets[i].style.cursor = "pointer";
        }
        this.targets = [];//清空
        let target = document.getElementById(this.state.separatorid);
        target.style.cursor = "ew-resize";
       document.removeEventListener( "mouseup", this.mouseUpHandler)
       document.removeEventListener( "mousemove", this.mouseMoveHandler)
    }

    render() {
        return <div className={"wasabi-layout-right  layout-panel "} id={this.props.rightid}
            style={{ top: this.props.top, width: this.props.width, height: (this.props.reduceHeight ? "calc(100% - " + (this.props.reduceHeight).toString() + "px" : null) }}>
            <div  id={this.state.separatorid} className="wasabi-separator-right" style={{ top: this.props.top, right: this.props.width, height: (this.props.reduceHeight ? "calc(100% - " + (this.props.reduceHeight).toString() + "px" : null) }}>

            </div>
            {this.props.children}
        </div>
    }
}

export default Right;