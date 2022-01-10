/*
 create by wangzhiyong
 date:2017-02-09
 desc:圣杯布局，底部
 */
import React from "react";
import PropTypes from "prop-types";

class Footer extends  React.Component{
    constructor(props)
    {
        super(props);
    }
    static defaultProps = {
        type:"footer",
        height:null
    }
    static propTypes={
        height:PropTypes.oneOfType([PropTypes.number,PropTypes.string]),
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
export default Footer;