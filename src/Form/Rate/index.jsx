/*
 create by wangzhiyong
 date:2020-11-02 评分组件
 desc:评分组件
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import validateHoc from "../validateHoc";
import "./rate.css"
class Rate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hoverValue: 0,//鼠标停留值
            value: this.props.value,
            oldPropsValue: this.props.value,
            validateClass: "",
            inValidateShow: "none",
            inValidateText: ""
        }
        this.onMouseOut = this.onMouseOut.bind(this)
        this.onMouseOver = this.onMouseOver.bind(this)
    }


    static getDerivedStateFromProps(props, state) {
        if (props.value != state.oldPropsValue) {//强行刷新
            return {
                value: props.value,
                oldPropsValue: props.value,
                hoverValue: 0,
            }
        }
        return null;
    }
    onSelect(value) {
        if (this.props.readOnly || this.props.disabled) {
            return;
        }
        this.setState({
            value: value,
            hoverValue: 0,
        })
        this.props.validate && this.props.validate(value);
        this.props.onSelect && this.props.onSelect(value, value, this.props.name);
    }
    getValue() {
        return this.state.value;

    }
    setValue(value) {
        this.setState({
            value: value,
            hoverValue: 0,
        })
    }
    onMouseOver(value) {
        if (this.props.readOnly || this.props.disabled) {
            return;
        }
        this.setState({
            hoverValue: value,

        })
    }
    onMouseOut() {
        if (this.props.readOnly || this.props.disabled) {
            return;
        }
        this.setState({
            hoverValue: 0,
        })
    }
    renderStar() {
        let value = this.state.hoverValue || this.state.value;//先等于鼠标停留的值，没有，才是选中的值；
        let control = [];
        if (this.props.percent <= 0) {
            console.error("每颗星星的分数不为0")
            return null;
        }
        else {
            //只有在只读的情况才有半读的情况
            let percent = this.props.percent;
            let num = this.props.maxValue / percent;//个数，有小数说明有半选的状态
            let index = 1;
            while (index <= num) {
                try {
                    //如果小于值，则全选，如果大于值，但是上一个却小于值，则是半选
                    let iconCls = index * percent <= value ? "icon-star" : (index * percent > value && (index - 1) * percent < value) ? "icon-star-half" : "icon-star-blank";
                    let color = "rgb(247, 186, 42)";//星星颜色值
                    if (this.props.colors instanceof Array) {
                        color = this.props.colors[index - 1];
                    }
                    else {
                        color = this.props.colors;
                    }

                    control.push(<i key={index} style={{ fontSize: this.props.starSize, color: (iconCls == "icon-star-blank" ? null : color) }}
                        className={"wasabi-rate-star " + iconCls} onClick={this.onSelect.bind(this, index * percent)} onMouseOver={this.onMouseOver.bind(this, index * percent)}></i>)
                }
                catch (e) {
                    console.error(e.message);
                }
                index++;
            }

        }
        return control;


    }
    renderText() {
        let value = this.state.hoverValue || this.state.value;//先等于鼠标停留的值，没有，才是选中的值；
        if (this.props.texts && this.props.texts instanceof Array) {
            if (this.props.percent <= 0) {
                console.error("每个星星的分数不能为0")
                return "";
            }
            else {
                //只有在只读的情况才有半读的情况
                let percent = this.props.percent;
                let num = value / percent;//个数，有小数说明有半选的状态
                num = num.toString().indexOf(".") > -1 ? parseInt(num) + 1 : num;//有小数点
                return this.props.texts[num - 1] || "";
            }
        }
        return "";

    }
    render() {
        return <div className={"wasabi-rate " + (this.props.className || "")} style={this.props.style} onMouseOut={this.onMouseOut.bind(this)} >
            {
                this.renderStar()
            }
            <a className="wasabi-rate-text" style={{ color: this.props.textColor }}>{(this.props.readOnly || this.props.disabled || this.props.showValue) ? this.state.value : this.renderText()}</a>
        </div>

    }
}
Rate.propTypes = {
    /**颜色值
     * 可以是一个字符，也可是一个数组,每个值对应一个星星
     * 如果是数组 参考如下
         */
    colors: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),//
    starSize: PropTypes.number,//星星的字体大小
    className: PropTypes.string,//自定义样式
    style: PropTypes.object,//自定义样式
    percent: PropTypes.number,//每个星的值
    maxValue: PropTypes.number,//最大值
    showValue: PropTypes.bool,//是否显示数值，
    disabled: PropTypes.bool,//禁止访问
    readOnly: PropTypes.bool,//只读
    hide: PropTypes.bool,//隐藏
    texts: PropTypes.array,//文本值，每个值对应于一个星星
    textColor: PropTypes.string,//文本的颜色值
    value: PropTypes.number,//值
    name: PropTypes.string.isRequired,//name
}
Rate.defaultProps = {
    colors: "rgb(247, 186, 42)",
    starSize: 18,
    percent: 2,
    maxValue: 10,
    texts: ['极差', '失望', '一般', '满意', '惊喜'],
    textColor: "var(--color)",
    value: 0,
}
export default validateHoc(Rate,"rate")