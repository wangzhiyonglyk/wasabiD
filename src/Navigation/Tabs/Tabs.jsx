//create by wangzhiyong
//date:2016-02-18
//标签页组
import React from "react";
import PropTypes from "prop-types";
import func from "../../libs/func"
import LinkButton from "../../Buttons/LinkButton";
require("./tabs.css");
class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.tabpanels = [];
        this.state = {
            navid: func.uuid(),//id
            activeIndex: 0,

            childrenlength: React.Children.count(this.props.children) || 0,//旧的子节点个数
        }
        this.tabClick = this.tabClick.bind(this);
        this.onClose = this.onClose.bind(this);
        this.changeActive = this.changeActive.bind(this);
    }
    static getDerivedStateFromProps(props, state) {
        let newState = {};
        if (React.Children.count(props.children) != state.childrenlength) {
            newState.activeIndex = props.children.length - 1
            newState.childrenlength = React.Children.count(props.children) || 0
            return newState;
        }
        return null;
    }
    componentDidUpdate() {
        try {
            let dot = document.getElementById(this.state.navid);
            if (dot && dot.children && dot.children.length > 0) {
                if (dot.children[this.state.activeIndex].offsetLeft - 40 > dot.clientWidth) {
                    dot.scrollLeft = dot.children[this.state.activeIndex].offsetLeft - 40 - dot.clientWidth + dot.children[this.state.activeIndex].clientWidth;
                }
            }
        }
        catch (e) {

        }

    }
    tabClick(index, event) {
        //页签单击事件
        this.setState({
            activeIndex: index
        })
        this.props.tabClick && this.props.tabClick(index)
    }
    onClose(index, event) {
        event.stopPropagation();//阻止事件，
        this.setState({
            activeIndex: index - 1
        })
        this.props.onClose && this.props.onClose(index, this.state.activeIndex);
    }
    changeActive(index) {
        if (this.props.children && index > -1 && index < React.Children.count(this.props.children)) {
            this.setState({
                activeIndex: index
            })
            this.props.tabClick && this.props.tabClick(index)
        }
    }
    preClick() {
        let nav = document.getElementById(this.state.navid);
        nav.scrollLeft -= 80;
    }
    nextClick() {
        let nav = document.getElementById(this.state.navid);
        nav.scrollLeft += 80;
    }
    //刷新
    refresh() {
        try {
            this.tabpanels[this.state.activeIndex].current.refresh();
        }
        catch (e) {

        }


    }
    render() {
        this.tabpanels = [];
        return (
            <div className={"wasabi-tabs " + (this.props.className || "")} style={this.props.style} >
                <div className={"wasabi-tab-nav " + (this.props.plain ? "plain" : "")}  >
                    {this.props.plain ? null : <div key="pre" title="上一个" onClick={this.preClick.bind(this)} className={"wasabi-tab "}
                        style={{ float: "left", textAlign: "center", width: 40, borderRight: React.Children.count(this.props.children) > 0 ? null : "1px solid var(--border-color)" }}> <LinkButton theme="info" style={{ transform: "translateY(-3px)" }} iconCls="icon-angle-double-left"></LinkButton></div>}
                    <div id={this.state.navid} style={{ width: "calc(100% - 120px)", float: "left", height: "42px", overflow: "hidden", display: "flex", flexDirection: "row", flexWrap: "nowrap" }}>
                        {
                            React.Children.map(this.props.children, (child, index) => {
                                if (child) {
                                    let iconCls = child && child.props.iconCls ? child.props.iconCls : "txt";
                                    return <div key={index} onClick={this.tabClick.bind(this, index)} className={"wasabi-tab " + this.props.theme + " " + (this.state.activeIndex == index ? "active " : "")} >
                                        <i className={"" + iconCls} style={{ marginRight: 5 }}></i>
                                        {child.props.title}
                                        <i className="tab-icon icon-close" style={{ display: child.props.closeAble ? "inline" : "none" }} onClick={this.onClose.bind(this, index)}></i>
                                    </div>
                                }
                                return null;

                            })

                        }

                    </div>
                    {this.props.plain ? null : <div key="next" onClick={this.nextClick.bind(this)} title="下一个" className={"wasabi-tab "} style={{ float: "left", textAlign: "center", width: 40 }}>  <LinkButton style={{ transform: "translateY(-3px)" }} theme="info" iconCls="icon-angle-double-right"></LinkButton></div>}
                    {this.props.plain ? null : <div onClick={this.refresh.bind(this)} key="refresh" title="刷新" className={"wasabi-tab "} style={{ float: "right", textAlign: "center", width: 40 }}>  <LinkButton style={{ transform: "translateY(-3px)" }} theme="info" iconCls="icon-refresh"></LinkButton></div>}
                </div>
                {
                    React.Children.map(this.props.children, (child, index) => {
                        if (child) {
                            let ref = React.createRef();
                            this.tabpanels.push(ref);
                            return React.cloneElement(child, { index:index, ref: ref, key: index, active: this.state.activeIndex === index })
                        } else {
                            return null;
                        }

                    })
                }

            </div>)

    }
}

Tabs.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    theme: PropTypes.oneOf([//主题
        "primary",
        "warning",
        "info",
        "danger",
        "success",
    ]),
    activeIndex: PropTypes.number,//活动下标
    onClose: PropTypes.func,//关闭事件
    tabClick: PropTypes.func,//单击事件
};
Tabs.defaultProps = {
    theme: "primary",
    activeIndex: 0,
    plain: false,


};
export default Tabs;
