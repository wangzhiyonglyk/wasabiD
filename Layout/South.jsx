/*
 create by wangzhiyong
 date:2017-02-09
 desc:圣杯布局，底部
 */
import React from "react";
class South extends  React.Component{
    constructor(props)
    {
        super(props);
    }
    static propTypes = {
        style:React.PropTypes.object,
        className:React.PropTypes.string,
    }
    static  defaultProps= {
        style: null,
        className: "",
    }
    render() {
        let style = this.props.style ? this.props.style : {};
        return <div className={"wasabi-layout-south " +this.props.className} style={style}>
            {  this.props.children}
        </div>
    }
}
module .exports= South;