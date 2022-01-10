
import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "../../Buttons/Button";
import func from "../../libs/func"
import "./msg.css"
class MessageView extends Component {
    constructor(props) {
        super(props);
        this.messageid = func.uuid();
        this.state = {
            loading: true,//正在加载
            opacity: 1,//透明度
            visible: true,//可见性

        }
        this.close = this.close.bind(this)
        this.OKHandler = this.OKHandler.bind(this);
        this.cancelHandler = this.cancelHandler.bind(this);
        this.timeOutHandler = this.timeOutHandler.bind(this);
    }

    componentDidMount() {
        if (this.props.type == "confirm") {

        }
        else {
            this.timeOutHandler();//设置定时器
        }

    }
    componentWillUnmount() {
        try {
            if (this.timeoutArray.length > 0) {
                for (let i = 0; i < this.timeoutArray.length; i++) {
                    clearTimeout(this.timeoutArray[i])
                }
            }
        } catch (e) {

        }
    }
    OKHandler() {
        this.setState({
            visible: false
        })
        if (this.props.OKHandler != null) {
            this.props.OKHandler();
        }
    }
    cancelHandler() {
        this.setState({
            visible: false
        })
        if (this.props.cancelHandler != null) {
            this.props.cancelHandler();
        }
    }
    close() {
        this.setState({
            visible: false
        })
    }

    timeOutHandler() {
        this.timeoutArray = [];
        this.timeoutArray.push(setTimeout(() => {
            this.setState({
                visible: false,
            })
        }, this.props.timeout));


    }
    renderLoading() {
        return <div>
            <div
                className='wasabi-loading'
                style={{ zIndex: 9999, position: "fixed", display: this.state.loading == true ? 'block' : 'none' }}
            ></div>
            <div
                className='wasabi-load-icon'
                style={{ display: this.state.loading == true ? 'block' : 'none' }}
            ></div>
        </div>
    }
    renderInfo() {
        let iconCls = "icon-";
        switch (this.props.type) {
            case "success":
                iconCls += "success";
                break;
            case "error":
                iconCls += "error";
                break;
            default:
                iconCls += "info"
        }
        return <div className={"wasabi-message " + this.props.type}
            style={{ display: this.state.visible ? "block" : "none" }}  >
            <div className="notice"><i className={iconCls} style={{ marginRight: 10, fontSize: 16 }}></i>{this.props.msg}</div>
        </div>
    }
    renderConfirm() {
        return <div className={" wasabi-overlay " + (this.state.visible == true ? "active " : "")} >
            <div className={"wasabi-confirm " + (this.state.visible ? " wasabi-scale-in" : " wasabi-scale-out")} style={{ display: this.state.visible ? "block" : "none" }} >
                <div className="wasabi-confirm-title"><i className="icon-question" style={{ marginRight: 5 }}></i>提示</div>
                <div className="wasabi-confirm-message">
                    {(this.props.msg == null || this.props.msg == "") ? "确定删除这条信息吗?" : this.props.msg}
                </div>
                {this.state.visible ? <div className="buttons" >
                    <button type="button" className="cancel" onClick={this.cancelHandler}>取消</button>
                    <button type="button" className="ok" onClick={this.OKHandler}>确定</button>
                </div> : null}
            </div>
        </div>
    }
    render() {
        switch (this.props.type) {
            case "loading":
                return this.renderLoading();
            case "alert":
                return this.renderInfo();
            case "success":
                return this.renderInfo();
            case "error":
                return this.renderInfo();

            case "confirm":
                return this.renderConfirm();
        }
        return null;
    }
}
MessageView.propTypes = {
    type: PropTypes.oneOf([
        "loading",
        "alert",
        "success",
        "error",
        "confirm",
    ]),
    msg: PropTypes.any.isRequired,//消息
    timeout: PropTypes.number,//自动消失时间
    cancelHandler: PropTypes.func,//取消事件
    OKHandler: PropTypes.func,//确定事件

};
MessageView.defaultProps = {

    type: "alert",
    msg: "",
    timeout: 2000,
    showOK: true,
    showCancel: true,

};
export default MessageView;