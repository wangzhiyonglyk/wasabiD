/*
create by wangzy
date:2016-15-18
desc:面板组件
 */
var React=require("react");
var LinkButton=require("../Buttons/LinkButton.jsx");
var Toolbars=require("../Buttons/Toolbar.jsx");
require("../../sass/Base/Layout/Panel.scss");
var Panel=React.createClass({
    propTypes: {
        theme: React.PropTypes.oneOf([
            "none",
            "default",
            "primary",
            "success",
            "info",
            "warning",
            "danger",
        ]),//主题
        width:React.PropTypes.number,//宽度
        height:React.PropTypes.number,//高度
        expand:React.PropTypes.bool,//是否展开
        expandAble:React.PropTypes.bool,//是否允许展开
        title:React.PropTypes.string,//标题
        buttons:React.PropTypes.array,//按钮
        buttonClick:React.PropTypes.func,//按钮的单击事件
    },
    getDefaultProps:function() {
        return{
            theme:"none",
            expand:true,
            expandAble:true,
            width:document.body.clientWidth,
            title:"",
            height:400,
            backgroundColor:null,
            buttons:[],
            buttonClick:null,
        }
    },
    getInitialState:function() {
        return {
            expand:this.props.expand,
            expandAble:this.props.expandAble,
            iconTip:(this.props.expand==true)?"折叠":"展开",
            iconCls:(this.props.expand==true)?"icon-fold":"icon-expand",
            height:(this.props.expand==true)?this.props.height:0,
            }
    },
    componentWillReceiveProps:function(nextProps) {
        this.setState({
            expand: nextProps.expand,
            expandAble:nextProps.expandAble,
            height:(nextProps.height!=null&&nextProps.height!=undefined)?nextProps.height:this.state.height,
            width:(nextProps.width!=null&&nextProps.width!=undefined)?nextProps.width:this.state.width,
            }
        );

    },
    expandHandler:function()
    {
        this.setState({
            expand:!this.state.expand,
            iconTip:this.state.expand==true?"折叠":"展开",
            iconCls:this.state.expand==true?"icon-fold":"icon-expand",
            height:this.state.expand==true?this.props.height:0,
        })
    },
    buttonClick:function(name,title) {
          if(this.props.buttonClick!=null)
          {
              this.props.buttonClick(name,title);
          }
    },
    render:function()
    {
        var style=null;
        if(this.props.style)
        {
            style=this.props.style;
            style.width=this.props.width;
        }
        else {
            style={
                width:this.props.width,
            }
        }
        return (
            <div className={"wasabi-panel panel-"+this.props.theme} style={style}  >
                <div className="panel-heading" ><h3 className="panel-title">{this.props.title}</h3>
                    <div className="panel-buttons"><Toolbars buttons={this.props.buttons} buttonClick={this.buttonClick}></Toolbars></div>
                <div className="panel-icon" style={{display:(this.state.expandAble)?"block":"none"}}><LinkButton tip={this.state.iconTip} iconCls={this.state.iconCls} onClick={this.expandHandler}></LinkButton></div>
                </div>
                <div className={"panel-body  "}  style={{height:this.state.height}}>
                    {this.props.children}
                </div>
                </div>

                )
    }
})
module .exports=Panel;