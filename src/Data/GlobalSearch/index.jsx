/**
 * 全局搜索组件
 * create wangzhiyong
 * date:2021-07-28
 */
import React from "react";
import func from "../../libs/func";
import PropTypes from 'prop-types';
import("./search.css")
class GlobalSearch extends React.Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
        this.state = {
            visible: false,
            overid: func.uuid(),
            searchid: func.uuid()
        }
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }
    componentDidMount() {

    }
    open() {
        this.setState({
            visible: true,
        })
        this.input.current.focus();
    }
    close() {
        this.setState({
            visible: false
        })
    }
    onSearch(event){
        if(event.keyCode===13){
            this.props.onSearch&& this.props.onSearch(event.target.value);
        }
    }
    render() {
        return <div className="wasabi-globalsearch" style={{transform:this.state.visible? "scale(1)":"scale(0)"}}>
            <div id={this.state.overid} className="wasabi-globalsearch-overlay" onClick={this.close} ></div>
            <div id={this.state.searchid} className={"wasabi-globalsearch-container"+(this.state.visible?" wasabi-fade-in":" wasabi-fade-out")} >
                <div className="search">
                    <i className="icon-search input-icon" style={{ fontSize: 24 }}></i>
                    <input ref={this.input} className="input" placeholder="搜索" onKeyUp={this.onSearch.bind(this)}></input>
                </div>
                <div className="result">
                    {
                        React.Children.count(this.props.children) > 0 ? this.props.className : <div className="empty">暂无搜索结果</div>
                    }
                </div>

            </div>
        </div>
    }
}
GlobalSearch.propTypes = {
    onSearch: PropTypes.func,//搜索事件
}
export default GlobalSearch