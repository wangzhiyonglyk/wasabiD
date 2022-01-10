//create by wangzhiyong
//date:2016-07-22
//desc:独立的筛选框
import React from "react";
import PropTypes from "prop-types";
import BaseInput from "../BaseInput";
import Msg from "../../Info/Msg"
import"./search.css"
class Search extends React.Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
        this.state = {
            value: this.props.value
        }
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }
    onSearch(event) {//开始查询
        this.setState({
            value: event.target.value
        }, () => {
            if (this.props.searchType === "off") {
                if (typeof this.props.onSearch === "function") {
                    this.props.onSearch(event.target.value, this.props.name);
                }
                else {
                    Msg.info("请设置搜索事件")
                }
            }

        })

    }
    onKeyUp(event) {
        if (this.props.searchType === "enter" && event.keyCode === 13) {

            if (typeof this.props.onSearch === "function") {
                this.props.onSearch(event.target.value, this.props.name);
            }
            else {
                Msg.info("请设置搜索事件")
            }

        }
    }
    setValue(value) {
        this.setState({
            value: value
        })
    }
    getValue() {
        return this.state.value
    }
    render() {
        return <div className={"wasabi-searchbox " + (this.props.className || "")} style={this.props.style}>
            <BaseInput
                title={this.props.title}
                name={this.props.name}
                placeholder={this.props.placeholder}
                readOnly={this.props.readOnly}
                ref={this.input}
                value={this.state.value || ""}
                onChange={this.onSearch}
                onKeyUp={this.onKeyUp}></BaseInput>
            <i className=" icon-search" onClick={this.onSearch}></i>
        </div>
    }
};

Search.propTypes = {
    name: PropTypes.string,//表单名称，
    title: PropTypes.string,//提示信息
    placeholder: PropTypes.string,//输入框提示信息
    style: PropTypes.object,//
    className: PropTypes.string,
    onSearch: PropTypes.func,//查询事件
    searchType: PropTypes.oneOf(["enter", "off"]),//enter 回车，off立即

};
Search.defaultProps = {
    searchType: "enter"
}
export default Search;