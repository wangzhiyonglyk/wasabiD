/*
 create by wangzhiyong
 date:2017-02-09
 desc:圣杯布局，头部
 */
import React from "react";
import PropTypes from "prop-types";

class Header extends  React.Component{
    constructor(props)
    {
        super(props);
    }
  
    static  defaultProps= {
       type:"header",
       height:null,
    }
    static propTypes={
        height:PropTypes.oneOfType([PropTypes.number,PropTypes.string]),
    }
    
    render() {
        return <div className={"wasabi-layout-header  layout-panel "+(this.props.className||"")  }
         style={ {height:this.props.height}}>
            {  this.props.children}
        </div>
    }
}

export default  Header;