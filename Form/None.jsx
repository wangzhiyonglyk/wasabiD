//creete by wangzy
//date:2016-11-25
//desc 表单中空的占位组件,方便排版
//属性与状态值保留,可能以后有用
let React=require("react");
import props from "./config/props.js";
import defaultProps from "./config/defaultProps.js";
var None=React.createClass({

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
      
        var componentClassName=  "wasabi-form-group ";//组件的基本样式
        var style =this.props.style?this.props.style:{};//设置样式
         if(!style.width){style.width="100"};
        return (<div className={componentClassName+this.state.validateClass} style={{display:this.state.hide==true?"none":"block"}} >
                <div className={ "wasabi-form-group-body"} style={style} className={this.props.className}>
                </div>
            </div>
        )
    }
});
module .exports=None;