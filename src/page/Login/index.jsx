/**
 * 登录页组件
 * create by wangzhiyong
 * date:2021-02-02
 */
import React from "react";
import PropTypes from 'prop-types';
import Msg from "../../Info/Msg";
import api from "wasabi-api";
import("./index.css")
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.usernameref = React.createRef();
        this.state = {
            username: "",
            password: ""
        }
        this.usernameChange = this
            .usernameChange
            .bind(this);
        this.passwordChange = this
            .passwordChange
            .bind(this);
        this.onSumbit = this
            .onSumbit
            .bind(this)
    }
    componentDidMount() {
        this.usernameref.current.focus();
        document.addEventListener("keydown", (event) => {
            if (event.keyCode == 13) //回车键的键值为13
                this.onSumbit();
        }
        )
    }
    usernameChange(event) {
        this.setState({
            username: event
                .target
                .value
                .trim()
        })
    }
    passwordChange(event) {
        this.setState({
            password: event
                .target
                .value
                .trim()
        })
    }
    /**
     * 登陆
     */
    onSumbit() {
        if (this.props.url || this.props.loginHandler) {
            if (this.state.username && this.state.password) {
                if (this.props.loginHandler && typeof this.props.loginHandler === "function") {
                    this.props.loginHandler(this.state.username, this.state.password);
                } else {
                    api.ajax({
                        url: this.props.url,
                        type: "post",
                        contentType: this.props.contentType,
                        data: this
                            .props
                            .contentType
                            .indexOf("json") > -1
                            ? JSON.stringify({ username: this.state.username, password: this.state.password })
                            : {
                                username: this.state.username,
                                password: this.state.password
                            },
                        success: (res) => {
                            //做兼容性处理
                            res.statusCode = res.statusCode || res.code || res.status;
                            if (res.success) {
                                res.statusCode == 200;
                            }
                            if (res.statusCode == 200) {

                                window
                                    .sessionStorage
                                    .setItem("user", JSON.stringify(res.data));
                                if (typeof res.data == "object") {
                                    window
                                        .sessionStorage
                                        .setItem("token", res.data.token);
                                } else if (typeof res.data == "string") {
                                    window
                                        .sessionStorage
                                        .setItem("token", res.data);
                                }
                                window.location.href = "/"; //跳转到主页
                            }
                        },
                        error: (message) => {
                            Msg.error(message);
                        }

                    })
                }

            } else {
                Msg.error("用户名与密码不能为空");
            }

        } else {
            Msg.error("请先设置登陆接口地址或处理方法");
        }
    }
    render() {
        return <div className="wasabi-page">

            <img
                className="bgone"
                src={this.props.backgroundImage
                    ? this.props.backgroundImage
                    : require("./img/1.jpg")} />
            <img
                className="pic"
                src={this.props.leftImage
                    ? this.props.leftImage
                    : require("./img/a.png")} />

            <div className="login-table">
                <div className="welcome">{this.props.title || ""}</div>

                <div className="user">
                    <div ><img src={require("./img/yhm.png")} /></div>
                    <input
                        type="text"
                        ref={this.usernameref}
                        name="username"
                        placeholder="用户名"
                        value={this.state.username}
                        onChange={this.usernameChange} />
                </div>
                <div className="password">
                    <div ><img src={require("./img/mm.png")} /></div>
                    <input
                        type="password"
                        name="密码"
                        placeholder="密码"
                        value={this.state.password}
                        onChange={this.passwordChange} />
                </div>
                <button className="login-btn" type="button" onClick={this.onSumbit}>登录</button>
            </div>

        </div>

    }
}
Login.propTypes = {
    title: PropTypes.string.isRequired, //系统名称
    url: PropTypes.string.isRequired,
    contentType: PropTypes.string,
    backgroundImage: PropTypes.string, //背景图片,
    leftImage: PropTypes.string, //左侧图片,
    loginHandler: PropTypes.func, //自定义登陆事件

}
Login.defaultProps = {
    contentType: "application/x-www-form-urlencoded",
}
export default Login;