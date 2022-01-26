/*
create by wangzhiyong
date:2016-04-05后开始独立改造
 edit 2019-12-18
desc:链接按钮
 */
import React from 'react';
import PropTypes from 'prop-types';
import './linkbutton.css'
class LinkButton extends React.PureComponent {
    constructor(props) {
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
    }
    clickHandler(event) {
        if (this.props.disabled == true) {
            return;
        }

        if (this.props.onClick !==null) {
            this.props.onClick(this.props.name, this.props.title, event);
        }
    }
    onMouseOver(event) {
        if (this.props.onMouseOver) {
            this.props.onMouseOver(event);
        }
    }
    onMouseOut(event) {
        if (this.props.onMouseOut) {
            this.props.onMouseOut(event);
        }
    }
  

    render() {
        let className = "wasabi-linkbutton "+ (this.props.className || "") + " " + (this.props.theme || "default"); //按钮样式
        //如果没有图标，只有文字
        if (!this.props.iconCls) {
            className += ' ' + 'onlytext'; //只有文字
        }
        let style = this.props.style ? this.props.style : {}; //设置按钮样式
        let icon = <i
            className={this.props.iconCls + " " + this.props.iconAlign}
            style={{
                color: this.props.iconColor,
                display: this.props.iconCls == '' ? 'none' : 'inline-block'
            }}
        ></i>;
        return <a title={this.props.title}
            href={this.props.href}
            onClick={this.clickHandler}
            onMouseOut={this.onMouseOut}
            onMouseOver={this.onMouseOver}
            className={className}
            disabled={this.props.disabled}
            name={this.props.name}
            style={style}
        >
            {this.props.iconAlign === "left" ? icon : null}
            {this.props.children}
            {this.props.iconAlign !== "left" ? icon : null}
          {this.props.dot?  <div style={{
            width: 12,
            height: 12,
            backgroundColor:(this.props.dotColor||"#f14d41"),
            position: "absolute",
            top: -5,
            right: -7,
            borderRadius: "50%",
            transform: "scale(0.5)"
        }}></div>:null}
        </a>

    }
}

LinkButton.propTypes = {
    name: PropTypes.string, //名称
    className: PropTypes.string,//样式
    style: PropTypes.object,//样式
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    iconCls: PropTypes.string, //图片
    iconAlign: PropTypes.oneOf(['left', 'right', 'rightTop']), //图标的位置
    iconColor: PropTypes.string,//图标的颜色值
    dot:PropTypes.bool,//是否带红点
    dotColor:PropTypes.string,//红点的颜色
    theme: PropTypes.oneOf([
        //主题
        'primary',
        'success',
        'info',
        'warning',
        'danger',
        'cancel'
    ]),
    textStyle: PropTypes.object,
    href: PropTypes.string, //链接地址
    onClick: PropTypes.func, //单击地址
    disabled: PropTypes.bool, //是否有效

};
LinkButton.defaultProps = {
    iconAlign: 'left', //图标位置
    theme: 'primary',


};
export default LinkButton;
