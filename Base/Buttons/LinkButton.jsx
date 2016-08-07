/*
create by wangy
date:2016-04-05后开始独立改造
desc:链接按钮
 */
require("../../sass/Base/Buttons/linkbutton.scss");
require("../../sass/Base/Buttons/icon.scss");
let setStyle=require("../../Mixins/setStyle.js");
var React=require("react");
var LinkButton=React.createClass({
    mixins:[setStyle],
    propTypes: {
        name:React.PropTypes.string,//名称
        title:React.PropTypes.string,//标题
        theme: React.PropTypes.oneOf([//主题
            "primary",
            "default",
        ]),//主题
        width:React.PropTypes.number,//宽度
        height:React.PropTypes.number,//高度
        iconCls:React.PropTypes.string,//图片
        iconAlign:React.PropTypes.oneOf([
            "left",
            "right",
            "rightTop"
        ]),//图片位置
        href:React.PropTypes.string,//链接地址
        onClick:React.PropTypes.func,//单击地址
        tip:React.PropTypes.string,//提示信息
        disabled:React.PropTypes.bool,//是否有效
        hide:React.PropTypes.bool,//是否隐藏
        draggable:React.PropTypes.bool,//是否可拖动
        backgroundColor:React.PropTypes.string,//背景颜色
        color:React.PropTypes.string,//字体颜色
    },
    getDefaultProps:function() {
        return{
            name:"",//关联值
            title:"",//标题、
            theme:"default",//主题
            iconAlign:"left",//图标位置
            href:"javascript:void(0)",//连接地址
            iconCls:"",//默认为空
            onClick:null,//单击事件
            draggable:false,//是否允许拖动
            dragStartHandler:null,//拖动事件
            tip:"",
            backgroundColor:null,
            color:null,
            disabled:false,
            hide:false,
        }
    },
    getInitialState: function () {
        return {
            theme:this.props.theme,
            disabled:this.props.disabled,
            title:this.props.title,
            tip:this.props.tip,
            hide:this.props.hide,
        }
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            theme: nextProps.theme,
            disabled: nextProps.disabled,
            title: (nextProps.title)? nextProps.title:this.state.title,
            tip: nextProps.tip,
            hide:nextProps.hide,
        })
    },
    clickHandler:function() {
        if(this.state.disabled==true)
        {
            return ;
        }

        if(this.props.onClick!=null)
        {
            this.props.onClick(this.props.name,this.props.title);
        }
    },
    dragStartHandler:function(event) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setDragImage(event.target, 0, 0);
        var timestamp = Date.parse(new Date());

        var newLinkButton=<LinkButton  key={this.props.name+timestamp} name={this.props.name} title={this.props.title}
                                      iconCls={this.props.iconCls} iconAlign={this.props.iconAlign}  disabled={this.state.disabled}
                                           href={this.props.href} hide={this.state.hide}
                                      onClick={this.clickHandler}
                            ></LinkButton>

        this.props.dragStartHandler(newLinkButton,{name:this.props.name,
                                                        title:this.props.title,
                                                        iconCls: this.props.iconCls,
                                                        iconAlign:this.props.iconAlign,
                                                         disabled:this.state.disabled,
                                                           hide:this.state.hide,
                                                          href:this.props.href,
                                                             onClick:this.clickHandler
                                                            });//传回父组件
        return true;
    },
    render:function() {
        if(this.state.hide==true){
            return null;
        }
        var className = "wasabi-linkbutton "+this.props.theme;//按钮样式
        if(this.props.className)//自定义class
        {
            className+=" "+this.props.className;
        }
        if(this.props.iconCls==null||this.props.iconCls==undefined||this.props.iconCls=="")
        {
            className+=" "+"onlytext";//只有文字
        }
        let style=this.setStyle();//设置样式
        var linkTextStyle=null;//文本样式
        if(this.props.backgroundColor)
        {
            style.backgroundColor=this.props.backgroundColor;
            style.border="1px solid transparent";
            linkTextStyle={};linkTextStyle.color="#ffffff";
        }
        if(this.props.color) {
            linkTextStyle={};  linkTextStyle.color=this.props.color;
        }

        var iconClass = "wasabi-icon";//图标样式
        var title=this.props.tip;
        if(title==""||!title)
        {
            title=this.props.title;
        }
        if (this.props.title =="") {//纯图标
            return (<a draggable={this.props.draggable} onDragStart={this.dragStartHandler} title={title}
                       href={this.props.href} onClick={this.clickHandler}
                       className={className+" onlyicon"} disabled={this.state.disabled} name={this.props.name}>
                <i className={iconClass+" "+this.props.iconCls}></i>
            </a>);
        }
        else {

            if (this.props.iconAlign == "right") {
                return (
                    <a draggable={this.props.draggable} onDragStart={this.dragStartHandler} title={title}
                       href={this.props.href} onClick={this.clickHandler}
                       className={className} disabled={this.state.disabled} name={this.props.name} style={style}>
                        <div className="wasabi-linkbutton-text right" style={linkTextStyle}>{this.props.title}</div>
                        <i className={iconClass+" "+this.props.iconCls}
                           style={{display:this.props.iconCls==""?"none":"inline-block"}}></i>
                    </a>
                )
            }
            else if (this.props.iconAlign == "rightTop") {
                return (
                    <a draggable={this.props.draggable} onDragStart={this.dragStartHandler} title={title}
                       href={this.props.href} onClick={this.clickHandler}
                       className={className} disabled={this.state.disabled} name={this.props.name} style={style} >
                        <div className="wasabi-linkbutton-text " style={linkTextStyle}>{this.props.title}</div>
                        <i className={iconClass+" "+this.props.iconCls+" wasabi-icon-rightTop"}
                           style={{display:this.props.iconCls==""?"none":"inline-block"}}></i>
                    </a>);

            }
            else {
                return (

                    <a draggable={this.props.draggable} onDragStart={this.dragStartHandler} title={title}
                       href={this.props.href} onClick={this.clickHandler} className={className}
                       disabled={this.state.disabled} name={this.props.name} name={this.props.name}  style={style}>
                        <i className={iconClass+" "+this.props.iconCls}
                           style={{display:this.props.iconCls==""?"none":"inline-block"}}></i>
                        <div className="wasabi-linkbutton-text" style={linkTextStyle}>{this.props.title}</div>

                    </a>

                )
            }

        }

    }
});
module .exports=LinkButton;