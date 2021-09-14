/*
 create by wangzhiyong
 date:2020-11-29
 desc 进度条组件重新开发
 */
import React from "react";
import PropTypes from "prop-types";

class LineProgress extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            oldPropsValue: this.props.value,
            value: 0,//初始化的0
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.value != state.oldPropsValue) {
            return {
                value: props.value||"",
                oldPropsValue: props.value
            }
        }
        return null;
    }
    componentDidMount() {
        //产生动画
        this.time = setTimeout(() => {
            this.setState({
                value: this.props.value
            })
        }, 300);

    }
    setValue(value) {
        this.setState({
            value: value
        })
    }
    getValue() {
        return this.state.value
    }
    componentWillUnmount() {
        clearTimeout(this.time);
    }
    render() {

        return <div className={"wasabi-progress wasabi-progress-line " + this.props.className} style={this.props.style} >
            <div className="wasabi-progress-bar">
                <div className="wasabi-progress-bar-outer" >
                    <div className={"wasabi-progress-bar-inner " + this.props.theme} style={{ width: this.state.value + "%" }}></div>
                </div>
            </div>
            <div className={"wasabi-progress-text " + this.props.theme} >{this.props.text?this.props.text:this.state.value+"%"}</div></div>
    }
}

LineProgress.propTypes = {
    value: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.string,
    theme: PropTypes.oneOf([
        //主题
        'primary',
        'default',
        'success',
        'info',
        'warning',
        'danger',
        'cancel'
    ]),

};
LineProgress.defaultProps = {
    value: 0,
    theme: "default"
};
export default LineProgress;