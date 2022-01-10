import React from 'react';
import PropTypes from "prop-types";
class MenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.activeChange = this.activeChange.bind(this);
        this.state = {
            expand: this.props.expand,
            activeIndex: null,
        }
    }
    static propTypes = {
        iconCls: PropTypes.string,//图标
        title: PropTypes.any.isRequired,//标题是必须，可以是组件
        expand: PropTypes.bool //是否展开
    }

    activeChange(index) {
        this.setState({
            activeIndex: index
        })
    }
    onChange() {

    }

    render() {
        return <li className={(this.props.className||"")+ " " + (this.props.active ? "active" : "")} onClick={this.props.onClick}>
            <a style={{ textAlign: "left", marginLeft: "40px" }} >
                <i className={ this.props.iconCls||"icon-txt"} style={{marginRight:10}}></i>
                <span >
                    {this.props.children}
                </span>
            </a></li>
    }


}

MenuItem.propTypes = {
    className: PropTypes.string,
    iconCls: PropTypes.string,
    active: PropTypes.bool,

};
MenuItem.defaultProps = {
    iconCls: "icon-txt",
    active: false,
};

export default MenuItem;
