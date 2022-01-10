/*
滑动菜单
create by wangzhiyong
date:2016-04-05
desc:从原来的滑动面板而来
*/
import React from "react";
import PropTypes from "prop-types";
import "./slidemenu.css";
import func from "../../libs/func";
class SlideMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            overid: func.uuid(),
            menuid: func.uuid(),
            visible: false,
        }
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);

    }
    static propTypes = {
        title: PropTypes.string,//标题
        buttons: PropTypes.array,//自定义按钮
        buttonClick: PropTypes.func,//按钮的单击事件,
    }
    open() {//打开事件，用于外部调用
        this.setState({
            visible: true
        }, () => {
            document.getElementById(this.state.overid).style.backgroundColor = "rgba(0, 0, 0, 0.4)";
            document.getElementById(this.state.menuid).style.width = this.props.width + "px";
            this.props.onOpen && this.props.onOpen();
        });
    }
    close() {//关闭事件,用于外部调用
        document.getElementById(this.state.overid).style.backgroundColor = "rgba(0, 0, 0, 0)";
        document.getElementById(this.state.menuid).style.width = "0px";
        this.timeout = setTimeout(() => {
            this.setState({
                visible: false
            }, () => {
                this.props.onClose && this.props.onClose();
            });
        }, 300);

    }
    componentWillUnmount() {
        try {
            clearTimeout(this.timeout);
        }
        catch (e) {

        }

    }
    render() {
        return <div className={"wasabi-slidemenu "} style={{ width: this.state.visible ? "100%" : 0, height: this.state.visible ? "100%" : 0 }} >
            <div id={this.state.overid} className="slide-overlay" onClick={this.close} ></div>
            <div id={this.state.menuid} className="slide-container" >
                {
                    this.props.children
                }
            </div>
        </div>
    }
};
SlideMenu.defaultProps = {
    width: 300
}
export default SlideMenu;