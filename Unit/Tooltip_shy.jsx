/**
 * Created by 42591 on 2016/10/17.
 * Tooltip提示框组件
 */
require("../sass/Unit/Tooltip_shy.scss");
let React = require("react");
let ReactDOM = require("react-dom");
var Tooltip = React.createClass({
    propTypes: {
        text: React.PropTypes.string.isRequired,
        tips: React.PropTypes.string.isRequired,
        position: React.PropTypes.oneOf([//提示框的位置，默认在text的下方
            'top',
            'bottom'
        ]),
        theme: React.PropTypes.oneOf([
            'light',
            'dark'
        ])
    },
    getDefaultProps: function(){
        return {
            text: '',
            tips: '',
            position: 'bottom',
            theme: 'dark'
        };
    },
    getInitialState: function(){
        return {};
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            text: nextProps.text,
            tips: nextProps.tips,
            position: nextProps.position,
            theme: nextProps.theme,
        });
    },
    render: function(){
        return (<span className={"shy_tipsWarp "+this.props.position+" "+this.props.theme}>
            <span className="shy_tipsText">{this.props.text}</span>
            <span className="shy_tipsTips">{this.props.tips}</span>
        </span>);
    }
});
module.exports = Tooltip;