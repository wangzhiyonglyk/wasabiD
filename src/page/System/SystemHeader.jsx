import React from "react";
import LinkButton from "../../Buttons/LinkButton";

import Header from "../../Layout/Header";
import dom from "../../libs/dom";
import SystemNoitce from "./SytemNotice";
class SystemHeader extends React.Component {
    constructor(props) {
        super(props);
        this.isfullScreen = false;
        this.state = {
            isuserExpand: false,
            isnoticeExpand: false
        }
        this.close = this.close.bind(this);
        this.logout = this.logout.bind(this);
    }
    componentDidMount() {
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
                this.isfullScreen = false;
            }
        });
    }
    /**
  * 全屏
  */
    fullScreen() {
        if (this.isfullScreen) {
            this.isfullScreen = false;
            dom.exitFullscreen();

        }
        else {
            this.isfullScreen = true;
            dom.fullScreen();
        }
    }
    /**
  * 个人设置
  */
    userExpand(event) {
        event.stopPropagation();//阻止冒泡
        this.target = event.target;
        this.setState({
            isnoticeExpand: false,
            isuserExpand: true
        }, () => {
            document.addEventListener("click", this.close)
        });
    }
    /**
     * 通知
     * @param {*} event 
     */
    noticeExpand(event) {
        event.stopPropagation();//阻止冒泡
        this.target = event.target;
        this.setState({
            isuserExpand: false,
            isnoticeExpand: true
        }, () => {
            document.addEventListener("click", this.close)
        });
    }
    /**
    * 关闭弹出层
    * @param {*} event 
    */
    close(event) {
        if (!event || event && !dom.isDescendant(this.target, event.target)) {
            this.setState({
                isnoticeExpand: false,
                isuserExpand: false
            });
            document.removeEventListener("click", this.close)
        }
    }


    /**
     * 退出登陆
     */
    logout() {
        window.sessionStorage.clear();
        window.location.href = "./login.html"
    }
    render() {
        let props = this.props;
        return <Header height={props.height} className={"header " + (this.props.headerTheme || "white")}>
            {this.props.navTheme === "leftTop" ? <div style={{ width: props.leftWidth - 1, float: "left" }}
                className={"system "}>
                {this.props.logo ? <img className='logo' src={this.props.logo}></img> : null}
                <span className='title'>{this.props.title}</span>
            </div> : null}
            <LinkButton onClick={props.setLeftWidth} iconCls="icon-bars" theme="info" style={{ float: "left", marginLeft: 10, marginTop: 5, width: 30, height: 30 }}></LinkButton>
            <span style={{ marginLeft: 10 }}>{props.groupTitle ? props.groupTitle + "  /  " : ""}{props.activeMenu}</span>
            <div className='system-icon' onClick={props.systemOpen}>
                <i
                    style={{
                        height: 42,
                        lineHeight: "42px",
                        marginLeft: 5,
                        marginRight: 5,
                    }}
                    title="系统设置"
                    className={"icon-setting"}
                ></i>
            </div>
            <div className='system-icon' onClick={this.fullScreen.bind(this)}>
                <i
                    style={{
                        height: 42,
                        lineHeight: "42px",
                        marginLeft: 5,
                        marginRight: 5,
                    }}
                    title="全屏"
                    className={"icon-arrow-salt"}
                ></i>
            </div>
            <div className='user' onClick={this.userExpand.bind(this)}>
                <img
                    style={{
                        height: 30,
                        lineHeight: "30px",
                        marginLeft: 5,
                        marginRight: 5,
                        borderRadius: "50%",
                        transform: "translateY(-2px)"
                    }}
                    src={props.headerImg || require("./img/header.jpg")}
                ></img>
                <span className='title'>{props.nick}</span>
                <dl
                    className={
                        this.state.isuserExpand ? "icon-menus show" : "icon-menus hide"
                    }
                    style={{ padding: 5 }}
                >
                    <dd className='user-menu' onClick={this.props.userSet}>
                        <i className=' icon-user' style={{ marginRight: 10 }}></i>
                        <span>个人设置</span>
                    </dd>
                    <dd className='user-menu' onClick={this.props.changePassword} >
                        <i className=' icon-edit' style={{ marginRight: 10 }}></i>
                        <span>修改密码</span>
                    </dd>
                    <dd className='user-menu' onClick={this.logout}>
                        <i className=' icon-switch' style={{ marginRight: 10 }}></i>
                        <span>退出</span>
                    </dd>
                </dl>
            </div>
            {this.props.notices && this.props.notices.length > 0 ? <SystemNoitce
                isnoticeExpand={this.state.isnoticeExpand}
                noticeExpand={this.noticeExpand.bind(this)}
                notices={this.props.notices}
                noticeClick={this.props.noticeClick}
                headerTheme={this.props.headerTheme}
            ></SystemNoitce> : null}
            <div className='system-icon' onClick={props.searchOpen}>
                <i style={{
                    height: 42,
                    lineHeight: "42px",
                    marginLeft: 5,
                    marginRight: 5,
                }}
                    title="搜索"
                    className={"icon-search"}
                ></i>
            </div>
            <div className='nav'>
                {" "}
                <ul>
                    {props.shortcuts && props.shortcuts.map((item, index) => {
                        return (
                            <li
                                key={index}
                                onClick={props.activeShortHandler.bind(this, index, item.name, item.title, item.url)}
                                className={
                                    props.activeShortCuts == index ? "active" : ""
                                }
                            >
                                {" "}
                                <i className={item.iconCls}></i> {item.title}
                            </li>
                        );
                    })}
                </ul>
            </div>

        </Header>
    }
}
SystemHeader.defaultProps = {
    height: 42,
    type: "header"
}

export default SystemHeader;