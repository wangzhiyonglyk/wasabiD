/*
 create by wangzy
 date:2016-04-05后开始独立改造
 desc:按钮组件,从linkbutton独立出来

 */
require("../Sass/Buttons/button.scss");
var React = require("react");

let Button = React.createClass({
    propTypes: {
        name: React.PropTypes.string, //按钮名称
        title: React.PropTypes.string, //按钮标题
        tip: React.PropTypes.string, //按钮提示信息
        theme: React
            .PropTypes
            .oneOf([ //主题
                "primary",
                "default",
                "success",
                "info",
                "warning",
                "danger",
                "cancel"
            ]),
        size: React
            .PropTypes
            .oneOf([ //按钮大小
                "large",
                "default",
                "small"
            ]),
        onClick: React.PropTypes.func, //按钮单击事件
        className: React.PropTypes.string, //按钮自定义样式
        disabled: React.PropTypes.bool, //按钮是否无效
        hide: React.PropTypes.bool, //按钮是否隐藏
        delay: React.PropTypes.number, //第二次点击的间隔时间
       
    },
    getDefaultProps: function () {
        return {
            title: null,
            tip: null,
            theme: "primary",
            size: "default",
            className: "",
            onClick: null,
            disabled: false,
            hide: false,
            delay: 0,
          
        }
    },
    getInitialState: function () {
        this.title = null; //初始化
        return {theme: this.props.theme, disabled: this.props.disabled, title: this.props.title, tip: this.props.tip, hide: this.props.hide}
    },
    componentWillReceiveProps: function (nextProps) {

        this.setState({
            theme: nextProps.theme,
            disabled: nextProps.disabled,
            title: (nextProps.title)
                ? nextProps.title
                : this.state.title,
            tip: nextProps.tip,
            hide: nextProps.hide
        })
    },
    componentDidUpdate: function () {
        if (this.delay == 1) { //开始延迟,执行父组件方法
            this.delay = 2; //处理中
            setTimeout(() => {
                this.delay = null; //清空
                this.setState({title: this.title, disabled: false})

            }, this.props.delay);

            if (this.props.onClick) {
                this
                    .props
                    .onClick(this.props.name, this.props.title, this.event);

            }

        }

    },
    shouldComponentUpdate: function (nextProps, nextState) {
        if (this.delay == 2) {
            return false;
        }
        return true;
    },
    clickHandler: function (event) {

        if (this.state.disabled == true) {
            return;
        }
      
        if (this.props.delay > 0) { //不立即执行父组件方法
            this.title = this.state.title; //保存原来的title
            this.delay = 1; //处理开始
            this.event = event;
            this.setState({title: "处理中...", disabled: true})
        } else {
            if (this.props.onClick) {
                this
                    .props
                    .onClick(this.props.name, this.props.title, event);
            }
        }

    },
    render: function () {
        var style = this.props.style;
        if (style) {
            if (style.display) {} else {
                style.display = this.state.hide
                    ? "none"
                    : "inline";
            }

        } else {
            style = {};
            style.display = this.state.hide
                ? "none"
                : "inline";
        }
        var props = {
            className: "wasabi-button " + this.state.theme + " size-" + this.props.size + " " + this.props.className,
            style: style,
            disabled: this.state.disabled == true
                ? "disabled"
                : null,
            title: (this.state.tip
                ? this.state.tip
                : this.state.title)
        }
        return (

            <button {...props}  onClick={this.clickHandler} type="button">{this.state.title}</button>
        )
    }

});
module.exports = Button;