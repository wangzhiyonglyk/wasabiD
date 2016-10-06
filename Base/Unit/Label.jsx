/**
 * Created by wangzhiyong on 16/9/28.
 * desc 将表单组件中的label单独出来,
 *
 */

let React=require("react");

let Label=React.createClass({
    propTypes: {

    name:React.PropTypes.string,//名称
    hide:React.PropTypes.bool,//是否隐藏
        required:React.PropTypes.bool,//是否必填项
    },
    getDefaultProps:function() {

        return {
            name: "",
            hide: false,
            required: false
        }

    },
    getInitialState(){
        return {
            name:this.props.name,
            hide: this.props.hide,
            required: this.props.required
        }
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
        <label>{this.state.name}</label>
    </div>
}
})
module .exports=Label;