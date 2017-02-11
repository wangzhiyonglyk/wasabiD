/*
 create by wangzhiyong
 date:2017-02-09
 desc:圣杯布局，右侧
 */
import React from "react";
class West extends  React.Component{
    constructor(props) {
        super(props);

    }
    render() {
        let style = this.props.style ? this.props.style : {};
        return <div className={"wasabi-layout-west "} style={style}>
            <div className="wasabi-layout-title">{this.props.title}</div>
            <div className={"wasabi-layout-nav"}>{  this.props.children}</div>
        </div>
    }
}
West.propTypes={
    style:React.PropTypes.object,
    className:React.PropTypes.string,
    title:React.PropTypes.string,
}
West.defaultProps={
    ...West.defaultProps,

    style:null,
    className:"",
    title:"East",
}
module .exports= West;