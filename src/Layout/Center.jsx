/*
 create by wangzhiyong
 date:2017-02-09
 desc:圣杯布局，中间内容
 */
import React from "react";
import PropTypes from "prop-types";

class Center extends  React.Component{
    constructor(props)
    {
        super(props);
        
    }
    static defaultProps = {
        type:"center",
        top:0,
        left:0,
        reduceWidth:0,
        reduceHeight:0,
    }
    static propTypes={
        top: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        left :PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        reduceWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        reduceHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }
    render() {  
       
        return <div className={" wasabi-layout-center  layout-panel" } id={this.props.centerid}
       style={{ top:this.props.top,left:this.props.left, width: (this.props.reduceWidth!=null&&this.props.reduceWidth!=undefined?"calc(100% - "+(this.props.reduceWidth).toString()+"px":null), height: (this.props.reduceHeight?"calc(100% - "+(this.props.reduceHeight).toString()+"px":null) }} 
       >
          {  this.props.children}
        </div>
    }
}


export default Center;