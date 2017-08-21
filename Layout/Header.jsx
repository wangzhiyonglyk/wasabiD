/*
 create by wangzhiyong
 date:2017-02-09
 desc:圣杯布局，头部
 */
import React from "react";
class Header extends  React.Component{
    constructor(props)
    {
        super(props);
    }
  
    static  defaultProps= {
       title:"header",
       height:null,
    }
    static propTypes={
        height:React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.string]),
    }
    
    render() {
        return <div className={"wasabi-layout-header  layout-panel" }
         style={ {height:this.props.height,top:this.props.top}}>
            {  this.props.children}
        </div>
    }
}

module .exports= Header;