/*
 create by wangzhiyong
 date:2017-02-09
 desc:圣杯布局，头部
 */
import React from "react";
class North extends  React.Component{
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
        return <div className={"wasabi-layout-north " +this.props.className} style={style}>
            {  this.props.children}
        </div>
    }
}
North.propTypes={

    style:React.PropTypes.object,
    className:React.PropTypes.string,
}
North.defaultProps={
    ...North.defaultProps,
    style: null,
    className: "",
}
module .exports= North;