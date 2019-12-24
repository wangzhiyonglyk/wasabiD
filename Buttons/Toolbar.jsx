/**
 * Created by wangzhiyong on
 * date:2016-04-05后开始独立改造
 * edit 2019-12-18
 * desc:按钮工具栏
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import  LinkButton  from "./LinkButton.jsx";
import Button from "./Button.jsx";
import ("../Sass/Buttons/Toolbar.css");

class Toolbar  extends Component {
     
    constructor(props){
        super(props);
        this.onClick=this.onClick.bind(this);
        this.state={}
    }
    onClick (name, title, event) {
        this.props.onClick(name, title, event); //执行父组件的事件
    }
    render () {
        let props = {
            className: this.props.className + " wasabi-toolbar",
            style: this.props.style
        };
        var buttonlist = [];
        if (this.props.buttons != null) {
            this.props.buttons.map((child) => {
                    if (this.props.type == "button") {
                        buttonlist.push(
                            <Button key={child.name} {...child} onClick={this.onClick}></Button>
                        );
                    } else {
                        buttonlist.push(
                            <LinkButton key={child.name} {...child} onClick={this.onClick}></LinkButton>
                        );
                    }

                });
        }
        return (
            <div {...props}>
                {buttonlist}
            </div>

        )
    }
}

Toolbar.propTypes= {
    buttons: PropTypes.array.isRequired,
    type: PropTypes
        .oneOf([ //主题
            "button",
            "link"
        ]),
        style:PropTypes.object,
        className:PropTypes.string,
    onClick:PropTypes.func
};
Toolbar.defaultProps= {buttons: [], type: "button",style:{}, className: ""};

export default Toolbar;