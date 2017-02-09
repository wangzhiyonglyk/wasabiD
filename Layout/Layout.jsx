/*
create by wangzhiyong
date:2017-02-09
desc:圣杯布局
 */

import React from "react";
require("../Sass/Layout/Layout.scss");
class Layout extends  React.Component{
constructor(props)
{
    super(props);

}
    static propTypes = {
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
    static  defaultProps= {
        width:"100%",
        height:document.body.getBoundingClientRect().height,
        style:null,
        className:""
    }
    render() {
    console.log("etst");
        let style = this.props.style ? this.props.style : {};
         style.width=this.props.width;
         style.height=this.props.height;
        return <div className="wasabi-layout" style={style}>{  this.props.children}</div>
    }
}
module .exports= Layout;