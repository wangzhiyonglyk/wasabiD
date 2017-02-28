//create by wangzy
//date:2016-03-22
//desc:模态窗口
var React=require("react");
var ReactDOM=require("react-dom");
var MessageView=require("./MessageView.jsx");
var Message= {
    info(msg,timeout) {
        if(!timeout)
        {
            timeout=2000;
        }
        if (!!document.getElementById("alog-info")) {
            //存在
            let child=document.getElementById("alog-info");
            document.body.removeChild(child);
            let info = document.createElement("div");
            info.id="alog-info";
            document.body.appendChild(info);
            ReactDOM.render(<MessageView  type="info" timeout={timeout} msg={msg}/>, document.getElementById("alog-info"));

        }
        else {
            let info = document.createElement("div");
            info.id="alog-info";
            document.body.appendChild(info);
            ReactDOM.render(<MessageView  type="info" timeout={timeout} msg={msg} />, document.getElementById("alog-info"));
        }

    },
    success(msg,timeout) {
        if(!timeout)
        {
            timeout=2000;
        }
        if (!!document.getElementById("alog-success")) {
            //存在
            let child=document.getElementById("alog-success");
            document.body.removeChild(child);
            let success = document.createElement("div");
            success.id="alog-success";
            document.body.appendChild(success);
            ReactDOM.render(<MessageView  type="success" timeout={timeout} msg={msg}/>, document.getElementById("alog-success"));

        }
        else {
            let success = document.createElement("div");
            success.id="alog-success";
            document.body.appendChild(success);
            ReactDOM.render(<MessageView  type="success" timeout={timeout} msg={msg} />, document.getElementById("alog-success"));
        }

    },
    error(msg,timeout) {
        if(!timeout)
        {
            timeout=2000;
        }
        if (!!document.getElementById("alog-error")) {
            //存在
            let child=document.getElementById("alog-error");
            document.body.removeChild(child);
            let error = document.createElement("div");
            error.id="alog-error";
            document.body.appendChild(error);
            ReactDOM.render(<MessageView  type="error" timeout={timeout} msg={msg}/>, document.getElementById("alog-error"));

        }
        else {
            let error = document.createElement("div");
            error.id="alog-error";
            document.body.appendChild(error);
            ReactDOM.render(<MessageView  type="error" timeout={timeout} msg={msg} />, document.getElementById("alog-error"));
        }

    },
    alert(msg){
        if (!!document.getElementById("alog-alert")) {
            //存在
            let child=document.getElementById("alog-alert");
            document.body.removeChild(child);
            let alert = document.createElement("div");
            alert.id="alog-alert";
            document.body.appendChild(alert);
            ReactDOM.render(<MessageView type="alert" msg={msg}  />, document.getElementById("alog-alert"));
        }
        else {
            let alert = document.createElement("div");
            alert.id="alog-alert";
            document.body.appendChild(alert);
            ReactDOM.render(<MessageView  type="alert" msg={msg}  />, document.getElementById("alog-alert"));
        }
    },
    confirm(msg,success,cancel) {
        if (!!document.getElementById("alog-confirm")) {
            //存在
            let child=document.getElementById("alog-confirm");
            document.body.removeChild(child);
            let confirm = document.createElement("div");
            confirm.id="alog-confirm";
            document.body.appendChild(confirm);
            ReactDOM.render(<MessageView type="confirm" msg={msg} OKHandler={success} cancelHandler={cancel} />, document.getElementById("alog-confirm"));
        }
        else {
            let confirm = document.createElement("div");
            confirm.id="alog-confirm";
            document.body.appendChild(confirm);
            ReactDOM.render(<MessageView  type="confirm" msg={msg}  OKHandler={success} cancelHandler={cancel}/>, document.getElementById("alog-confirm"));
        }
    }
};
module.exports=Message;
