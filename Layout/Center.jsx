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
    static defaultProps = {
        title:"center",
        top:null,
        left:null,
        width:null,
        height:null,
    }
    static propTypes={
        top: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        left :React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        width: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        height: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    }
    render() {  
        return <div className={" wasabi-layout-center  layout-panel" }
       style={{ top:this.props.top,left:this.props.left, width: (this.props.width?"calc(100% - "+(this.props.width).toString()+"px":null), height: (this.props.height?"calc(100% - "+(this.props.height).toString()+"px":null) }} 
       >
          {  this.props.children}
        </div>
    }
}


module .exports= Center;