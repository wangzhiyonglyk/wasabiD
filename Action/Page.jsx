/*
create by wangzhiyong
date:2017-02-10
desc:页面基类
 */
import React from "react";
class  Page extends  React.Component{
    constructor(props)
    {
        super(props);

    }
    componentDidMount() {
        let isalog=window.localStorage.getItem("wasabi-alog");
        if(isalog) {//是心怡项目
            var script=document.createElement("script");
            script.src="http://g.tbcdn.cn/sj/securesdk/0.0.3/securesdk_v2.js";
            script.id="J_secure_sdk_v2";
            script.setAttribute("id", "J_secure_sdk_v2");
            script.setAttribute("data-appkey", "23421795");
            document.body.appendChild(script);
        }
    }
    render()
    {
        let style = this.props.style ? this.props.style : {};
        style.width=this.props.width;
        style.height=this.props.height;
        return <div className={"wasabi-page "+this.props.className} style={style}>{this.props.children}</div>
    }
}
Page.propTypes= {
    width: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.string,

    ]),//宽度
    height: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.string,
    ]),//高度
    style: React.PropTypes.object,
    className: React.PropTypes.string,

}

Page.defaultProps= {
    width: "100%",
    height: "100%",
    style: null,
    className: ""
}
module.exports=Page;