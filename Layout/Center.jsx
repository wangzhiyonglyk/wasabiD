/*
 create by wangzhiyong
 date:2017-02-09
 desc:圣杯布局，中间内容
 */
import React from "react";
class Center extends  React.Component{
    constructor(props)
    {
        super(props);
    }
    render() {
        let style = this.props.style ? this.props.style : {};
        return <div className={"wasabi-layout-center " +this.props.className} style={style}>
            {  this.props.children}
        </div>
    }
}
Center.defaultProps={
    ...Center.defaultProps,
    style: null,
    className: "",
}
Center.propTypes={
    style:React.PropTypes.object,
    className:React.PropTypes.string,
}
module .exports= Center;