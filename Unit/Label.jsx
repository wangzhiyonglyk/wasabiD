/**
 * Created by wangzhiyong on 16/9/28.
 * desc 将表单组件中的label单独出来,
 *
 */

let React=require("react");

let Label=React.createClass({
    propTypes: {

        name:React.PropTypes.oneOfType([React.PropTypes.string,React.PropTypes.object,React.PropTypes.element,React.PropTypes.node]),//名称
        hide:React.PropTypes.bool,//是否隐藏
        help:React.PropTypes.string,//帮助文字
        required:React.PropTypes.bool,//是否必填项
    },
    getDefaultProps:function() {
        return {
            name: "",
            hide: false,
            help:null,
            required: false
        }

    },
    getInitialState(){
        return {
            name:this.props.name,
            hide: this.props.hide,
            showHelp:false,
            required: this.props.required
        }
    },
    helpHandler:function () {
        this.setState({
            showHelp:!this.state.showHelp
        })
    },
    hideHelp:function () {//给父组件调用
        this.setState({
            showHelp:false
        })
    },
    componentWillReceiveProps:function(nextProps) {
        this.setState({
            name:nextProps.name,
            hide:nextProps.hide,
            required:nextProps.required
        })
    },
    render(){
        return  <div className={"wasabi-form-group-label "+(this.state.required?"required":"") }
                     style={{display:(this.state.hide?"none":(this.state.name&&this.state.name!="")?"table":"none")}}>
            <label>{this.state.name}<a className="help" onClick={this.helpHandler} style={{display:(this.props.help?"inline-block":"none")}}>?</a><div className="heip-text" style={{display:(this.state.showHelp?"block":"none")}} >{this.props.help}</div></label>
        </div>
    }
})
module .exports=Label;