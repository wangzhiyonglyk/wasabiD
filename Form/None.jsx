//creete by wangzy
//date:2016-11-25
//desc 表单中空的占位组件,方便排版
//属性与状态值保留,可能以后有用
let React=require("react");
let setStyle=require("../Mixins/setStyle.js");
import props from "./config/props.js";
import defaultProps from "./config/defaultProps.js";
var None=React.createClass({
    mixins:[setStyle],
    propTypes:props,
    getDefaultProps:function() {
     return defaultProps;
    },
    getInitialState:function() {
        return{
            hide:this.props.hide,
            min:this.props.min,
            max:this.props.max,
            value:this.props.value,
            text:this.props.text,
            readonly:this.props.readonly,
            //验证
            required:this.props.required,
            validateClass:"",//验证的样式
            helpShow:"none",//提示信息是否显示
            helpTip:"",//提示信息
            invalidTip:"",
        }
    },
    componentWillReceiveProps:function(nextProps) {
        this.setState({
            hide:nextProps.hide,
            min:nextProps.min,
            max:nextProps.max,
            value: nextProps.value,
            text: nextProps.text,
            readonly: nextProps.readonly,
            required: nextProps.required,
            validateClass:"",//重置验证样式
        });

    },


    render:function() {
        var controlStyle=this.props.controlStyle?this.props.controlStyle:{};
        controlStyle.display = this.state.hide == true ? "none" : "block";
        
        var componentClassName=  "wasabi-form-group "+" "+(this.props.className?this.props.className:"");//组件的基本样式
        var style =this.setStyle("input");//设置样式
        return (<div className={componentClassName+this.state.validateClass} style={ controlStyle} >
                <div className={ "wasabi-form-group-body"} style={{width:"100%"}}>
                </div>
            </div>
        )
    }
});
module .exports=None;