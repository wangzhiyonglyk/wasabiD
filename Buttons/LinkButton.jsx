/*
create by wangy
date:2016-04-05后开始独立改造
desc:链接按钮
 */
require("../Sass/Buttons/linkbutton.scss");
require("../Sass/Buttons/icon.scss");
let setStyle=require("../Mixins/setStyle.js");
var React=require("react");
var addRipple=require("../Mixins/addRipple.js");
var LinkButton=React.createClass({
    mixins:[setStyle,addRipple],
    propTypes: {
        name:React.PropTypes.string,//名称
        title:React.PropTypes.string,//标题

        width:React.PropTypes.number,//宽度
        height:React.PropTypes.number,//高度
        iconCls:React.PropTypes.string,//图片
        iconAlign:React.PropTypes.oneOf([
            "left",
            "right",
            "rightTop",
            "rightBottom"
        ]),//图片位置
        href:React.PropTypes.string,//链接地址
        onClick:React.PropTypes.func,//单击地址
        tip:React.PropTypes.string,//提示信息
        disabled:React.PropTypes.bool,//是否有效
        hide:React.PropTypes.bool,//是否隐藏
        draggable:React.PropTypes.bool,//是否可拖动
        backgroundColor:React.PropTypes.string,//背景颜色
        color:React.PropTypes.string,//字体颜色
        ripple:React.PropTypes.bool,//点击时是否显示波纹特效
    },
    getDefaultProps:function() {
        return{
            name:"",//关联值
            title:"",//标题、
            iconAlign:"left",//图标位置
            href:"javascript:void(0)",//连接地址
            iconCls:null,//默认为空
            onClick:null,//单击事件
            draggable:false,//是否允许拖动
            dragStartHandler:null,//拖动事件
            tip:"",
            backgroundColor:null,
            color:null,
            disabled:false,
            hide:false,
            ripple:true,
        }
    },
    getInitialState: function () {
        return {

            disabled:this.props.disabled,
            title:this.props.title,
            tip:this.props.tip,
            hide:this.props.hide,
        }
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({

            disabled: nextProps.disabled,
            title: (nextProps.title)? nextProps.title:this.state.title,
            tip: nextProps.tip,
            hide:nextProps.hide,
        })
    },
    clickHandler:function(event) {
        if(this.state.disabled==true)
        {
            return ;
        }
        //TODO 添加波纹有问题
        // if(this.props.ripple)
        // {//允许特效，并且不是空主题
        //     this.rippleHandler(event);//添加波纹特效
        // }

        if(this.props.onClick!=null) {
            this.props.onClick(this.props.name, this.props.title, event);
        }
    },
    onMouseOver:function (event) {
      if(  this.props.onMouseOver)
      {
          this.props.onMouseOver(event);
      }
    },
    onMouseOut:function (event) {
        if(  this.props.onMouseOut)
        {
            this.props.onMouseOut(event);
        }
    },
    setDisabled:function (disabled) {
        this.setState({
            disabled:disabled
        })
    },
    dragStartHandler:function(event) {
        //event.dataTransfer.effectAllowed = "move";
        //event.dataTransfer.setDragImage(event.target, 0, 0);
        //var timestamp = Date.parse(new Date());
        //
        var newele={name:this.props.name,
            title:this.props.title,
            iconCls: this.props.iconCls,
            iconAlign:this.props.iconAlign,
            disabled:this.state.disabled,
            hide:this.state.hide,
            href:this.props.href,
            onClick:this.clickHandler
        };
        window.localStorage.setItem("wasabidrageleProps",JSON.stringify(newele));
    },
    render:function() {
        if(this.state.hide==true){
            return null;
        }
        var className = "wasabi-linkbutton ";//按钮样式
        if(this.props.className) {//自定义class
            className += " " + this.props.className;
        }
        if(!this.props.iconCls) {
            className += " " + "onlytext";//只有文字
        }
        let style=this.setStyle();//设置按钮样式
        var linkTextStyle={};//文本样式
        var iconColor=null;//图标颜色，因为图标基本使用了字体
        if(this.props.backgroundColor) {
            style.backgroundColor = this.props.backgroundColor;
        }
        if(this.props.color) {//单独设置了颜色
             linkTextStyle.color=this.props.color;
            iconColor=this.props.color;
        }
        else if(style.color) {//如果样式中设置了颜色，则取这个颜色
            linkTextStyle.color = style.color;
            iconColor = style.color;
        }

        var title=this.props.tip;//提示信息
        if(title==""||!title) {//如果没有，则默认为文本
            title = this.props.title;
        }
        if (!this.props.title ) {//纯图标
            return (<a draggable={this.props.draggable} onDragStart={this.dragStartHandler} title={title}
                       href={this.props.href} onClick={this.clickHandler}
                       className={className+" onlyicon"} disabled={this.state.disabled} name={this.props.name} style={style}>
                <i className={" "+this.props.iconCls} style={{color:iconColor, display:this.props.iconCls==""?"none":"inline-block"}}></i>
            </a>);
        }
        else {

            if (this.props.iconAlign == "right") {

                return (
                    <a ref="link" draggable={this.props.draggable} onDragStart={this.dragStartHandler} title={title}
                       href={this.props.href} onClick={this.clickHandler} onMouseOut={this.onMouseOut} onMouseOver={this.onMouseOver}
                       className={className} disabled={this.state.disabled} name={this.props.name} style={style}>
                        <div className="wasabi-linkbutton-text right" style={linkTextStyle}>{this.props.title}</div>
                        <i className={" "+this.props.iconCls}
                           style={{color:iconColor,display:this.props.iconCls==""?"none":"inline-block"}}></i>
                    </a>
                )
            }
            else if (this.props.iconAlign == "rightTop") {
                return (
                    <a ref="link"  draggable={this.props.draggable} onDragStart={this.dragStartHandler} title={title}
                       href={this.props.href} onClick={this.clickHandler} onMouseOut={this.onMouseOut} onMouseOver={this.onMouseOver}
                       className={className} disabled={this.state.disabled} name={this.props.name} style={style} >
                        <div className="wasabi-linkbutton-text" style={linkTextStyle}>{this.props.title}</div>
                        <i className={" "+this.props.iconCls+" icon-rightTop"}
                           style={{color:iconColor,display:this.props.iconCls==""?"none":"inline-block"}}></i>
                    </a>);

            }
            else if (this.props.iconAlign == "rightBottom"){
                return (
                    <a  ref="link" draggable={this.props.draggable}  onDragStart={this.dragStartHandler} title={title}
                       href={this.props.href} onClick={this.clickHandler} onMouseOut={this.onMouseOut} onMouseOver={this.onMouseOver}
                       className={className} disabled={this.state.disabled} name={this.props.name} style={style} >
                        <div className="wasabi-linkbutton-text" style={linkTextStyle}>{this.props.title}</div>
                        <i className={" "+this.props.iconCls+" icon-rightBottom"}
                           style={{color:iconColor,display:this.props.iconCls==""?"none":"inline-block"}}></i>
                    </a>);
            }
            else {
                return (

                    <a  ref="link" draggable={this.props.draggable} onDragStart={this.dragStartHandler} title={title}
                       href={this.props.href} onClick={this.clickHandler} onMouseOut={this.onMouseOut} onMouseOver={this.onMouseOver} className={className}
                       disabled={this.state.disabled}  name={this.props.name}  style={style}>
                        <i className={" "+this.props.iconCls}
                           style={{display:(this.props.iconCls==null||this.props.iconCls=="")?"none":"inline-block"}}></i>
                        <div className="wasabi-linkbutton-text left" style={linkTextStyle}>{this.props.title}</div>

                    </a>

                )
            }

        }

    }
});
module .exports=LinkButton;