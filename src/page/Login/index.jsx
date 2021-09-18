/**
 * 登录页组件
 * create by wangzhiyong
 * date:2021-02-02
 */
import React from "react";
import PropTypes from 'prop-types';
import Msg from "../../Info/Msg";
import api from "wasabi-api";
import "./index.css"
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.usernameref = React.createRef();
        this.state = {
            username: "",
            password: ""
        }
        this.usernameChange = this.usernameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.onSumbit = this.onSumbit.bind(this)
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
            username: event.target.value.trim()
        })
    }
    passwordChange(event) {
        this.setState({
            password: event.target.value.trim()
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
                    //
                    console.log("test",this.state.username,this.state.password)
                    api.ajax({
                        url: this.props.url,
                        type: "post",
                        contentType: this.props.contentType,
                        data: {
                            username: this.state.username,
                            password: this.state.password
                        },
                        success: (res) => {
                            //做兼容性处理
                            res.statusCode = res.statusCode || res.code || res.status;
                            if (res.success) { res.statusCode == 200; }//如果使用是这个字段
                            if (res.statusCode == 200) {
                                window.sessionStorage.setItem("user", JSON.stringify(res.data));
                                if (typeof res.data == "object") {
                                    window.sessionStorage.setItem("token", res.data.token);
                                } else if (typeof res.data == "string") {
                                    window.sessionStorage.setItem("token", res.data);
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

        return <div className="wasabi-login" style={{ backgroundImage: (typeof this.props.backgroundImage === "string") ? "url(" + this.props.backgroundImage + ")" : this.props.backgroundImage ? require(this.props.backgroundImage) : null }}>

            <h1 className="title">{this.props.title || "后台登录"}</h1>

            <div className="login">
                <div style={{ padding: 40 }}>

                    <div className="wasabi-username" >
                        <label className="input-tips" >账号：</label>
                        <div className="inputOuter">

                            <input type="text" className="inputstyle" ref={this.usernameref} onInput={this.usernameChange} />
                        </div>
                    </div>
                    <div className="wasabi-password" >
                        <label className="input-tips">密码：</label>
                        <div className="inputOuter">

                            <input type="password" className="inputstyle" onInput={this.passwordChange} />
                        </div>
                    </div>
                    <input type="submit" value="登 录" onClick={this.onSumbit}
                        className="button_blue" />
                </div>
            </div>

        </div>

    }
}
Login.propTypes = {
    title: PropTypes.string, //系统名称
    url: PropTypes.string,//后台请求地址
    contentType: PropTypes.string,//请求类型
    backgroundImage: PropTypes.any, //背景图片,
    leftImage: PropTypes.string, //左侧图片,
    loginHandler: PropTypes.func, //自定义登陆事件

}
Login.defaultProps = {
    contentType: "application/x-www-form-urlencoded",
}
export default Login;