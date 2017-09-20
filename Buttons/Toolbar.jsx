/**
 * Created by wangzhiyong on
 * date:2016-04-05后开始独立改造
 * desc:按钮工具栏
 */
var React = require("react");
require("../Sass/Buttons/Toolbar.scss");
var LinkButton = require("./LinkButton.jsx");
var Button = require("./Button.jsx");
var Toolbar = React.createClass({
    propTypes: {
        buttons: React.PropTypes.array.isRequired,
        type: React
            .PropTypes
            .oneOf([ //主题
                "button",
                "link"
            ]),
            style:React.PropTypes.object,
            className:React.PropTypes.string,
        onClick: React.PropTypes.func
    },
    getDefaultProps: function () {
        return {buttons: [], type: "button",style:{}, className: ""}
    },
    onClick: function (name, title, event) {
        this.props.onClick(name, title, event); //执行父组件的事件
    },
    render: function () {
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
});

module.exports = Toolbar;