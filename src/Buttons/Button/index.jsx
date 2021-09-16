/*
 create by wangzhiyong
 date:2016-04-05后开始独立改造
 edit 2019-12-18
 desc:按钮组件,从linkbutton独立出来
 */
import React from 'react';
import PropTypes from 'prop-types';
import func from "../../libs/func"
import ripple from "./ripple"
import regs from '../../libs/regs';
import './button.css'
class Button extends React.Component {
    constructor(props) {
        super(props);
        this.buttonid = func.uuid();
        this.ripple = {};
        this.state = {
            isdelay: false
        }
        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
    }
    componentDidMount() {
        try {
            ripple(document.getElementById(this.buttonid));
        }
        catch (e) {
            console.log("ripple error", e)
        }

    }
    onClick(event) {
        if (this.props.disabled === true || this.state.isdelay === true) {
            return;
        }
        if (this.props.delay && regs.integer.test(this.props.delay)) {
            this.setState({
                isdelay: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        isdelay: false
                    })
                }, this.props.delay);
            })
        }
        this.props.onClick && this.props.onClick(this.props.name, this.props.title, event);
    }
    onDoubleClick(event) {
        if (this.props.disabled === true || this.state.isdelay === true) {
            return;
        }
        if (this.props.delay && regs.integer.test(this.props.delay)) {
            this.setState({
                isdelay: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        isdelay: false
                    })
                }, this.props.delay);
            })
        }
        this.props.onDoubleClick && this.props.onDoubleClick(this.props.name, this.props.title, event);
    }
    setDelay(){
        this.setState({
            isdelay:true
        })
    }
    cancelDelay(){
        this.setState({
            isdelay:false
        })
    }
    shouldComponentUpdate(nextProps, nextState) {

        if (func.diffOrder(nextProps, this.props)) {
            return true;
        }
        if (func.diff(nextState, this.state)) {
            return true;
        }
        return false;
    }
    render() {
        let props = {
            className: "  wasabi-button " + (this.props.theme || " default ") + ' ' + (this.props.className || "") + " size-" + (this.props.size || ""),
            style: this.props.style ? this.props.style : {},
            disabled: (this.props.disabled === true || this.state.isdelay === true) ? 'disabled' : null,
            //文字提示
            title: this.props.title
        };
        return (this.props.children || this.props.iconCls) ? <button {...props} id={this.buttonid} onDoubleClick={this.onDoubleClick} onClick={this.onClick} type='button' >

            <span style={{ display: "flex" }}>
                {this.props.iconCls && this.props.iconAlign === "left" ? <i style={{ marginRight: 3 , color: this.props.iconColor}}
                 className={"wasabi-button-icon " + this.props.iconCls + " " + (this.state.isdelay ? "loading" : "")}></i> : null}
                {!this.props.iconCls&&this.state.isdelay? <i style={{ marginRight: 3 }} className={"wasabi-button-icon icon-loading loading" }></i> : null}
                {this.props.children}
                {this.props.iconAlign === "right" ? <i style={{ marginLeft: 3, color: this.props.iconColor }} className={"wasabi-button-icon " + this.props.iconCls + " " + (this.state.isdelay ? "loading" : "")}></i> : null}
            </span>

        </button> : null
    }

}
Button.propTypes = {
    name: PropTypes.string, //按钮名称
    title: PropTypes.string, //按钮提示信息
    iconCls: PropTypes.string, //图标
    iconAlign: PropTypes.oneOf(["left", "right"]),//图标的位置
    iconColor: PropTypes.string,//图标的颜色值
    theme: PropTypes.oneOf([
        //主题
        'primary',
        'success',
        'info',
        'warning',
        'danger',
        "cancel"
    ]),
    size: PropTypes.oneOf(["large", "default", "small", "mini"]),//图标的位置
    onClick: PropTypes.func, //按钮单击事件
    style: PropTypes.object, //样式
    className: PropTypes.string, //自定义样式
    disabled: PropTypes.bool, //按钮是否无效
    delay: PropTypes.number,//延迟几毫秒
};
Button.defaultProps = {
    iconAlign: "left",
    theme: 'primary',
    size: 'default',
};
export default Button;
