/*
 create by wangzhiyong
 date:2020-11-11 create
 desc:标记组件

 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.css'
class Badge extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hide:this.props.hide,
            oldPropsHide:this.props.hide,
        }
    }
    static getDerivedStateFromProps(props, state) {
        if(props.hide!=state.oldPropsHide){
            return {
                hide:props.hide
            }
        }
        return null;
    }
    hide(hide){
        this.setState({
            hide:hide
        })
    }

    render() {
        return <div className={"wasabi-badge " +(this.props.className||"") +" "+ (this.props.theme||"primary")} style={this.props.style} onClick={this.props.onClick}>
            {this.props.children}
            <sup className="wasabi-badge-content" style={{display:this.state.hide?"none":"block"}}>{this.props.tag>this.props.max?this.props.max+"+":this.props.tag}</sup></div>
    }
}
Badge.propTypes={
    style:PropTypes.object,
    className:PropTypes.string,
    tag:PropTypes.oneOfType([PropTypes.string,PropTypes.number]),//标签
    max:PropTypes.oneOfType([PropTypes.string,PropTypes.number]),//最大值
    theme: PropTypes.oneOf([
        //主题
        'primary',
        'success',
        'info',
        'warning',
        'danger',
        'cancel'
      ]),
      style:PropTypes.object,//样式
      hide:PropTypes.bool,
      onClick:PropTypes.func,
}
Badge.defaultProps={
    max:99,
    theme:"primary",
   
}

export default Badge;