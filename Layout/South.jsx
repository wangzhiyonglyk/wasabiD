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

    render() {
        let style = this.props.style ? this.props.style : {};
        return <div className={"wasabi-layout-south " +this.props.className} style={style}>
            {  this.props.children}
        </div>
    }
}
South.propTypes={

    style:React.PropTypes.object,
    className:React.PropTypes.string,
}
South.defaultProps={
    ...South.defaultProps,
    style: null,
    className: "",
}
module .exports= South;