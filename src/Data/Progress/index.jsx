/*
 create by wangzhiyong
 date:2020-11-29
 desc 进度条组件重新开发
 */
import React from "react";
import PropTypes from "prop-types";
import LineProgress from "./lineProgress"
import CircleProgress from "./CircleProgress"
import ("./index.css")
class Progress extends React.PureComponent{
  
    constructor(props){
        super(props);
        this.p=React.createRef();
    }
    setValue(value){
         this.p.current.setValue(value);
    }
    getValue(){
        return this.p.current.getValue();
    }
    render(){
        if(this.props.type=="circle"){
            return <CircleProgress ref={this.p} {...this.props}></CircleProgress>
        }
        else{
            return <LineProgress ref={this.p} {...this.props}></LineProgress>
        }
    }
}
export default Progress;