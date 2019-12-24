/*
create by wangzy
date:2016-15-18
desc:面板组件
 */
var React=require("react");
var LinkButton=require("../Buttons/LinkButton.jsx");
var Toolbars=require("../Buttons/Toolbar.jsx");
require("../Sass/Layout/Panel.css");
var Panel=React.createClass({
    propTypes: {
        theme: React.PropTypes.oneOf([
            "default",
            "primary",
            "success",
            "info",
            "warning",
            "danger",
        ]),//主题
      
        expand:React.PropTypes.bool,//是否展开
        expandAble:React.PropTypes.bool,//是否允许展开
        title:React.PropTypes.string,//标题
        buttons:React.PropTypes.array,//按钮
        buttonClick:React.PropTypes.func,//按钮的单击事件
    },
    getDefaultProps:function() {
        return{
            theme:"default",
            expand:true,
            className:"",
            expandAble:true,
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
       let style=this.props.style?this.props.style:{};
        if(!style.width)
            {
                style.width="100%";
            }
        return (
            <div className={"wasabi-panel panel-"+this.props.theme+" "+this.props.className} style={style}  >
                <div className="panel-heading" ><span >{this.props.title}</span>
                    <div className="panel-buttons"><Toolbars buttons={this.props.buttons} onClick={this.buttonClick}></Toolbars></div>
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