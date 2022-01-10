//create by wangzhiyong
//date:2016-03-22
//edit 2019-12-18
//edit 2021-05-18 调整样式，loading仍然有问题
//desc:模态窗口
import React from "react";
import ReactDOM from "react-dom";
import MessageView from "./MessageView";
export default {
    /**
     * 弹出正在加载
     */
    loading() {
        if (!!document.getElementById("wasabi-loading")) {
            //存在
            let child = document.getElementById("wasabi-loading");
            if (child) {
                document.body.removeChild(child);
            }

            let info = document.createElement("div");
            info.id = "wasabi-loading";
            document.body.appendChild(info);
            ReactDOM.render(<MessageView type="loading" />, document.getElementById("wasabi-loading"));

        }
        else {
            let info = document.createElement("div");
            info.id = "wasabi-loading";
            document.body.appendChild(info);
            ReactDOM.render(<MessageView type="loading" />, document.getElementById("wasabi-loading"));

        }
    },
    /**
     * 隐藏正在加载
     */
    hide() {
        try {
            let child = document.getElementById("wasabi-loading");
            if (child) {
                document.body.removeChild(child);
            }
        }
        catch (e) {

        }
    },
    /**
     * 普通消息
     * @param {*} msg 
     */
    alert(msg) {
        if (!!document.getElementById("wasabi-alert")) {
            //存在
            let child = document.getElementById("wasabi-alert");
            document.body.removeChild(child);
            let alert = document.createElement("div");
            alert.id = "wasabi-alert";
            document.body.appendChild(alert);
            ReactDOM.render(<MessageView type="alert" msg={msg} />, document.getElementById("wasabi-alert"));
        }
        else {
            let alert = document.createElement("div");
            alert.id = "wasabi-alert";
            document.body.appendChild(alert);
            ReactDOM.render(<MessageView type="alert" msg={msg} />, document.getElementById("wasabi-alert"));
        }
    },
    /**
     * 成功消息
     * @param {*} msg 
     * @param {*} timeout 
     */
    success(msg, timeout = 3000) {
        msg = msg || "操作成功"
        if (!!document.getElementById("wasabi-success")) {
            //存在
            let child = document.getElementById("wasabi-success");
            document.body.removeChild(child);
            let success = document.createElement("div");
            success.id = "wasabi-success";
            document.body.appendChild(success);
            ReactDOM.render(<MessageView type="success" timeout={timeout} msg={msg} />, document.getElementById("wasabi-success"));

        }
        else {
            let success = document.createElement("div");
            success.id = "wasabi-success";
            document.body.appendChild(success);
            ReactDOM.render(<MessageView type="success" timeout={timeout} msg={msg} />, document.getElementById("wasabi-success"));
        }

    },
    /**
     * 错误消息
     * @param {*} msg 
     * @param {*} timeout 
     */
    error(msg, timeout = 3000) {
        msg = msg || "服务器内部错误"
        if (!!document.getElementById("wasabi-error")) {
            //存在
            let child = document.getElementById("wasabi-error");
            document.body.removeChild(child);
            let error = document.createElement("div");
            error.id = "wasabi-error";
            document.body.appendChild(error);
            ReactDOM.render(<MessageView type="error" timeout={timeout} msg={msg} />, document.getElementById("wasabi-error"));

        }
        else {
            let error = document.createElement("div");
            error.id = "wasabi-error";
            document.body.appendChild(error);
            ReactDOM.render(<MessageView type="error" timeout={timeout} msg={msg} />, document.getElementById("wasabi-error"));
        }

    },
    /**
     * 确认对话框
     * @param {*} msg 消息 
     * @param {*} ok 确认函数
     * @param {*} cancel 取消函数
     */
    confirm(msg, ok, cancel) {
        if (!!document.getElementById("wasabi-confirm")) {
            //存在
            let child = document.getElementById("wasabi-confirm");
            document.body.removeChild(child);
            let confirm = document.createElement("div");
            confirm.id = "wasabi-confirm";
            document.body.appendChild(confirm);
            ReactDOM.render(<MessageView type="confirm" msg={msg} OKHandler={ok} cancelHandler={cancel} />, document.getElementById("wasabi-confirm"));
        }
        else {
            let confirm = document.createElement("div");
            confirm.id = "wasabi-confirm";
            document.body.appendChild(confirm);
            ReactDOM.render(<MessageView type="confirm" msg={msg} OKHandler={ok} cancelHandler={cancel} />, document.getElementById("wasabi-confirm"));
        }
    }
};

