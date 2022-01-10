//create by wangzhiyong
//date:2016-03-22
//desc:模态窗口
import React from "react";
import PropTypes from "prop-types";
import func from "../libs/func"
import "../Sass/Layout/resize.css"

class Resize extends React.Component {
    constructor(props) {
        super(props);
        this.resizediv = React.createRef();
        this.state = {
            resizeid: func.uuid(),
            width: this.props.width,
            height: this.props.height,
            min: 8,//最小尺度

        }
        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.mouseUpHandler = this.mouseUpHandler.bind(this);

    }


    componentDidMount() {//设置鼠标事件
        if (this.props.resize) {
            //允许改变大小
            document.addEventListener("mousemove", this.mouseMoveHandler);
            document.addEventListener("mouseup", this.mouseUpHandler)
            document.addEventListener("mousedown", this.mouseDownHandler)

        }

    }
    mouseDownHandler(event) {
        let elment = document.getElementById(this.state.resizeid);
        //鼠标按下事件,保存鼠标位置
        let dir = this.getDirection(elment, event);
        if (dir) {
            this.dir = dir;//记住方向
            //记住原始位置
            this.oldClientX = event.clientX;
            this.oldClientY = event.clientY;

            //记住原始宽度与高度
            this.oldwidth = elment.getBoundingClientRect().width;
            this.oldheight = elment.getBoundingClientRect().height;

        }
        else {
            this.oldClientX = null;
            this.oldClientY = null;
        }


    }
    mouseUpHandler() {
        this.oldClientX = null;
        this.oldClientY = null;
        this.oldwidth = null;
        this.oldheight = null;

    }
    target() {
        let elment = document.getElementById(this.state.resizeid);
        return elment;
    }
    mouseMoveHandler(event) {//鼠标移动事件
        let elment = document.getElementById(this.state.resizeid);
        this.getDirection(elment, event);//设置方向

        //设置拖动
        if (this.oldClientX) {
            //判断是否可以拖动

            let dir = this.dir;
            try {


                if (dir && dir == ("ew")) {
                    elment.style.width = (this.oldwidth + (event.clientX - this.oldClientX)) + "px";
                }
                else if (dir && dir == ("ns")) {
                    elment.style.height = (this.oldheight + (event.clientY - this.oldClientY)) + "px";
                }
                else if (dir) {
                    elment.style.width = (this.oldwidth + (event.clientX - this.oldClientX)) + "px";
                    elment.style.height = (this.oldheight + (event.clientY - this.oldClientY)) + "px";
                }




            }
            catch (e) {

            }
        }
        else {
        }

    }
    //获取方向
    getDirection(targetElement, event) {
        //此处计算方向与光标图形分开，
        //当缩小时，要将方向向里多计算一点，否则缩小不流畅
        if (!targetElement) {
            return;
        }
        let xPos, yPos, offset;

        xPos = event.clientX;//
        yPos = event.clientY;//
        offset = this.state.min;

        let position = targetElement.getBoundingClientRect();//获取div的位置信息

        let cursor = "";
        if (yPos <= position.height + position.top + offset && yPos >= position.height + position.top - offset) {
            cursor += "ns";
        }

        if (xPos <= position.width + position.left + offset && xPos >= position.width + position.left - offset) {
            cursor += "ew";
        }

        cursor = cursor == "nsew" ? "nwse" : cursor;

        targetElement.style.cursor = cursor ? cursor + "-resize" : "default";//设置鼠标样式
        return cursor;
    }
    render() {
        return (
            <div className={"resize  " + (this.props.className || "")} id={this.state.resizeid}
                style={this.props.style}>
                {this.props.children}
            </div>)
    }
}
Resize.propTypes = {
    style: PropTypes.object.isRequired,//样式
    className: PropTypes.string,//样式

    resize: PropTypes.bool,//是否允许调整大小
}
Resize.defaultProps = {
    resize: true,//默认是可以改变大小的


};
export default Resize;