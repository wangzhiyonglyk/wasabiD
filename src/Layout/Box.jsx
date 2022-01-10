/*
 create by wangzhiyong
 date:2019-02-02
 desc:统计使用的盒子
 */
import React from "react";
import PropTypes from "prop-types";
import "../Sass/Layout/Box.css"
class Box extends  React.Component{
    constructor(props)
    {
        super(props);
        this.state={

        }
        
    }
 
    render(){
    return     <div   className={"box "+(this.props.className||"")} style={this.props.style}>
        <div className="box-title">
    <span className={"label label-"+this.props.theme}>{this.props.dateTitle}</span>
    <h5>{this.props.title||""}</h5>
        </div>
        <div className="box-content">
            <h1 className="no-margins">{this.props.content}</h1>
            <div className={"text text-"+this.props.theme}>{this.props.bottomRightTitle} 
            </div>
            <small>{this.props.bottomLeftTitle}</small>
        </div>
    </div>
    }
}
Box. defaultProps = {
    theme:"info",
    dateTitle:"日",
    bottomLeftTitle:"",
    bottomRightTitle:""
   
}
Box. propTypes={
    style: PropTypes.object,//样式
className: PropTypes.string,//自定义样式
    theme: PropTypes.oneOf([
       
        "primary",
        "success",
        "info",
        "danger",
    ]),//主题

    title: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    dateTitle :PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    content: PropTypes.any,
    bottomLeftTitle: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bottomRightTitle :PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}
export default Box;