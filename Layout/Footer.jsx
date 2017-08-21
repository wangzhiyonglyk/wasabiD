/*
 create by wangzhiyong
 date:2017-02-09
 desc:圣杯布局，底部
 */
import React from "react";
class Footer extends  React.Component{
    constructor(props)
    {
        super(props);
    }
    static defaultProps = {
        title:"footer",
        height:null
    }
    static propTypes={
        height:React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.string]),
    }
    render() {
        return <div className={"wasabi-layout-footer  layout-panel" } 
        style={ {height:this.props.height}}>
            {  this.props.children}
        </div>
    }
}
Footer.propTypes={
   
}
module .exports= Footer;