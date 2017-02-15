/*
 create by wangzhiyong
 date:2017-02-10
 desc:页面基类
 */
import React from "react";
import  unit from "../libs/unit";
import  FetchModel from "../Model/FetchModel"
class Page extends React.Component {
    constructor(props) {
        super(props)
        this.state={

        }

    }
    componentDidMount() {
        let isalog = window.localStorage.getItem("wasabi-alog");
        if (isalog) {//是心怡项目
            var script = document.createElement("script");
            script.src = "http://g.tbcdn.cn/sj/securesdk/0.0.3/securesdk_v2.js";
            script.id = "J_secure_sdk_v2";
            script.setAttribute("id", "J_secure_sdk_v2");
            script.setAttribute("data-appkey", "23421795");
            document.body.appendChild(script);
        }

        if (this.state.powerUrl) {
            var fetchModel = new FetchModel(this.state.powerUrl, this.powerSuccess, {title: this.state.pageTitle}, this.powerError);
            unit.fetch.post(fetchModel);
        }

    }
    powerSuccess() {

    }

    powerError() {

    }
    render()
    {
        return <div className="wasabi-page">
            {
                 React.Children.map(this.props.children, child => {
                return React.cloneElement(child, this.state)
            })
            }

        </div>
    }


};
Page.propTypes={
    width: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.string,

    ]),//宽度
    height: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.string,
    ]),//高度
    style:React.PropTypes.object,
    className:React.PropTypes.string,

}
Page.defaultProps={
    ...Page.defaultProps,
    width:"100%",
    height:"100%",
    style:null,
    className:""
}
module.exports=Page;