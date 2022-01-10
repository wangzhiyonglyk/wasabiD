/**
 * 下拉框的文本框
 *  edit 2021-04-12 完善交互性
 */
import React from "react";
import PropTypes from "prop-types";
import BaseInput from "../BaseInput"
class ArrowInput extends React.PureComponent {
    constructor(props) {
        super(props);
        this.input = React.createRef();
        this.state = {

        }
        this.getIconProps = this.getIconProps.bind(this);
    }
    /**
     * 计算得到图标属性
     * @param {*} type 
     * @returns 
     */
    getIconProps(type) {
        switch (type) {
            case "sort":
                return {
                    title: this.props.sortType == "asc" ? "顺排" : this.props.sortType == "desc" ? "倒排" : "点击排序",
                    style: { position: "absolute", top: 14, right: 10, color: (this.props.sortType ? "var(--icon-hover-color)" : "var(--icon-color)") },
                    className: this.props.sortType == "asc" ? "icon-sort-asc" : this.props.sortType == "desc" ? "icon-sort-desc" : "icon-sort",
                    onClick: this.props.onSort
                };
            case "chose":
                return {
                    className: "comboxbox-icon icon-caret-down " + (this.props.show ? "rotate" : ""),
                    onClick: this.props.onClick
                };
            case "clear":
                return {
                    title: "清除",
                    className: 'combobox-clear icon-clear',
                    onClick: this.props.onClear,
                    style: { display: this.props.readOnly ? 'none' : this.props.value == '' || !this.props.value ? 'none' : 'inline' }
                }
        }

    }
    render() {
        return <div>
            {this.props.attachAble ? <i {...this.getIconProps("sort")} ></i> : <i {...this.getIconProps("chose")}></i>}
            <i {...this.getIconProps("clear")} ></i>
            <BaseInput
                ref={this.input}
                name={this.props.name}
                title={this.props.title}
                placeholder={(this.props.placeholder||"") + (this.props.attachAble ? "回车添加" : "")}
                readOnly={this.props.readOnly}
                value={this.props.value || ""}
                onClick={this.props.onClick}
                onChange={this.props.onChange}
                onKeyUp={this.props.onKeyUp}
            />
        </div>
    }
}

ArrowInput.propsTypes = {
    show: PropTypes.bool,//下拉框的状态
    sortType: PropTypes.oneOf(["", "asc", "desc"]),//排序方式
    name: PropTypes.string,//name
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),//值
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),//提示
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),//
    attachAble: PropTypes.bool,//是否可以添加
    readOnly: PropTypes.bool,//是否只读
    onChange: PropTypes.func,//change事件
    onKeyUp: PropTypes.func,//键盘事件
    onClick: PropTypes.func,//单击事件
    onClear: PropTypes.func,//清除事件
    onSort: PropTypes.func,//排序事件

}
ArrowInput.defaultProps = {
    sortType: "",
    value: ""
}

export default ArrowInput;


