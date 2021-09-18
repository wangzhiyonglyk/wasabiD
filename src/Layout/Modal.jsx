//create by wangzhiyong
//date:2016-03-22
//desc:模态窗口

import React from "react";
import PropTypes from "prop-types";

import Button from "../Buttons/Button";
import Resize from "./Resize.jsx";
import func from "../libs/func";
import "../Sass/Layout/Modal.css"
class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.resizeref = React.createRef();
        let style = (this.props.style && func.clone(this.props.style)) || {};
        let width = (this.props.style && this.props.style.width) ? (this.props.style.width) : 800;
        let height = (this.props.style && this.props.style.height) ? (this.props.style.height) : 400;
        style.width = width;
        style.height = height;
        style.left = style.left || "calc(50% - " + (parseInt(width) / 2).toFixed(2) +(typeof width==="string"&&width.indexOf("%")>-1?"%)": "px)");
        if(typeof height==="number"&& height<600){
            style.top="100px";
        }
      
        else if( typeof height==="string"&& height=="100%")
        {
            style.top="0px";
        }
        else {
            style.top="40px";
        }
        this.state = {
            headerid: func.uuid(),
            title: this.props.title,
            style: style,
            visible: false,
        }
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.mouseDownHandler = this.mouseDownHandler.bind(this);

        this.mouseUpHandler = this.mouseUpHandler.bind(this);
        this.OKHandler = this.OKHandler.bind(this);
        this.cancelHandler = this.cancelHandler.bind(this);
    }
    componentDidMount() {
      let headercontrol=  document.getElementById(this.state.headerid);
      headercontrol.addEventListener("mousedown", this.mouseDownHandler)
    }

    close() {//关闭事件
        window.modalZindex = window.modalZindex || 10;
        window.modalZinde -= 1;
        this.setState({ visible: false });
        if (this.props.close != null) {
            this.props.close();
        }
    }

    open(title) {//打开事件
        window.modalZindex = window.modalZindex || 8;
        window.modalZindex += 1;
        this.setState({ visible: true, title: title ? title : this.state.title });
    }
    /**
     * 鼠标移动事件
     * @param {*} event 
     */
    mouseMoveHandler(event) {

        if (this.position != null) {
            let target = this.resizeref.current.target();
            if (event.clientX - this.oldClientX > 5 || event.clientX - this.oldClientX < -5) {//防止抖动
                target.style.left = (this.position.left + event.clientX - this.oldClientX) + "px";
                target.style.top = (this.position.top + event.clientY - this.oldClientY) + "px";
            }

        }
    }
    /**
     * 鼠标按下事件
     * @param {*} event 
     */
    mouseDownHandler(event) {
           document.addEventListener("mousemove", this.mouseMoveHandler)
            document.addEventListener("mouseup", this.mouseUpHandler)

            //记住原始位置
            this.oldClientX = event.clientX;
            this.oldClientY = event.clientY;
            let target = this.resizeref.current.target();
            this.position = target.getBoundingClientRect();

        

    }

    /**
     * 鼠标松开事件
     * @param {*} event 
     */
    mouseUpHandler(event) {
        this.position = null;
        document.removeEventListener("mouseup", this.mouseUpHandler)
        document.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    OKHandler() {
        if (this.props.OKHandler != null) {
            this.props.OKHandler();
        }
    }
    cancelHandler() {
        this.close();//关闭
        if (this.props.cancelHandler != null) {
            this.props.cancelHandler();
        }
    }
    render() {
        let style = func.clone(this.state.style) || {};
        style.zIndex = (window.modalZindex + 1) || 10;
        //因为要提前调用children内容，所以不能在visible=false时，返回null
        let activename = "wasabi-modal-container ";
        if (this.state.visible == true) {
            activename = "wasabi-modal-container active";
        }
        let footer = null;
        let buttons = [];

        buttons.push(
            <Button title="确定" key="ok" theme="primary" onClick={this.OKHandler}
               >确定</Button>
        )

        buttons.push(
            <Button title="取消" key="cancel" theme="cancel" onClick={this.cancelHandler}
              
            >取消</Button>
        )
            
        footer = <div className="wasabi-modal-footer">
            {
                buttons
            }
        </div>;
    
    //如果有destroy销毁字段，在隐藏的时候破坏子组件，这样就可以把表单的内容清空
    return <div className = { activename }>
    <div className={" wasabi-overlay " + (this.state.visible ? "active" : "")}
></div>
    <Resize ref={this.resizeref}
        className={"wasabi-modal " + (this.state.visible ? " wasabi-fade-in" : "wasabi-fade-out")
            + this.props.className} style={style} resize={true}>
        <i className="icon-close wasabi-modal-close" onClick={this.close.bind(this)}></i>
        <div className="wasabi-modal-header" id={this.state.headerid} >
            {this.state.title}
        </div>
        <div className="wasabi-modal-content" >
            {
                this.props.destroy && this.state.visible == false ? null : this.props.children
            }
        </div>
        {
            footer
        }
    </Resize>
</div >
    }
}

Modal.propTypes = {
    className: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    style: PropTypes.object,
    resize: PropTypes.bool,//是否可以改变大小
    destroy: PropTypes.bool,//是否销毁
    close: PropTypes.func,//关闭事件
    OKHandler: PropTypes.func,//确定事件
    cancelHandler: PropTypes.func,
}

Modal.defaultProps = {
    className: "",
    style: {},
    resize: false,//是否可以改变大小
    destroy: false,
    close: null,
    OKHandler: null,//确定按钮的事件,
    cancelHandler: null,
}

export default Modal;