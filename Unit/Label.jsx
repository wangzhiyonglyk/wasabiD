/**
 * Created by wangzhiyong on 16/9/28.
 * desc 将表单组件中的label单独出来,
 *
 */

import React, { Component } from "react";
import PropTypes from "prop-types";

class Label extends Component{
  constructor(props)
  {
      super(props);
      this.state={

        showHelp:false,
       
      }
  }
 
    helpHandler () {
        this.setState({
            showHelp:!this.state.showHelp
        })
    }
    hideHelp () {//给父组件调用
        this.setState({
            showHelp:false
        })
    }
    componentWillReceiveProps(nextProps) {
       
    }
    render(){
        let style=this.props.style?this.props.style:{};
        style.display=(this.props.hide?"none":(this.props.name&&this.props.name!="")?"table":"none");
        return  <div className={"wasabi-form-group-label "+(this.props.required?"required":"") }
                     style={style}>
            <label>{this.props.name}<a className="help" onClick={this.helpHandler} style={{display:(this.props.help?"inline-block":"none")}}>?</a><div className="heip-text" style={{display:(this.state.showHelp?"block":"none")}} >{this.props.help}</div></label>
        </div>
    }
}

Label.propTypes ={

    name:PropTypes.oneOfType([PropTypes.string,PropTypes.object,PropTypes.element,PropTypes.node]),//名称
    hide:PropTypes.bool,//是否隐藏
    help:PropTypes.string,//帮助文字
    required:PropTypes.bool,//是否必填项
};
Label.dfaultProps= {
    
        name: "",
        hide: false,
        help:null,
        required: false
    

};
export default Label;