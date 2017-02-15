/**
 * Created by shine 2017/02/08.
 */
let React = require("react");
let ReactDOM = require("react-dom");
let wasabi = require("wasabiD");

let Button = wasabi.Button;
let Message = wasabi.Message;

let TestToolbar = React.createClass({
    getInitialState: function () {
        return {
            title: "新增",
            addDisabled: false,
            updateDisabled: false
        }
    },
    ClickAlert:function(){
        Message.alert("弹出信息");
    },
    ClickConfirm:() => {
        Message.confirm("确定要购买吗？",function(){
            Message.info("是");
        },function(){
            Message.success("否");
        })
    },
    render: function () {
        return <div>
            <Button name="alert" theme="success" title="按钮Alert" tip="tip" size="large" onClick={this.ClickAlert}/>
            <Button name="Confirm" theme="success" title="按钮Confirm" tip="tip" size="large" onClick={this.ClickConfirm}/>
        </div>
    }
});
ReactDOM.render(<TestToolbar/>, document.getElementById("root"));
