/*
 create by wangzhiyong
 date:2017-02-09
 desc:圣杯布局，右侧
 */
import React from "react";
class Right extends  React.Component{
    constructor(props)
    {
        super(props);

    }
    static defaultProps = {
        title:"right",
        top:null,
        width:null,
        height:null
    }
    static propTypes={
        top: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        width:React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.string]),
        height: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    }
    render() {
        return <div className={"wasabi-layout-right  layout-panel "}
        style={{top:this.props.top,width:this.props.width,height: (this.props.height?"calc(100% - "+(this.props.height).toString()+"px":null) }}>
            {  this.props.children}
        </div>
    }
}

module .exports= Right;