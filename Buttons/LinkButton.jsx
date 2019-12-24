/*
create by wangy
date:2016-04-05后开始独立改造
 edit 2019-12-18
desc:链接按钮
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import("../Sass/Buttons/linkbutton.css");
import("../Sass/Buttons/icon.css");


class LinkButton extends Component{

   constructor(props)
   {
       super(props);
       this.clickHandler=this.clickHandler.bind(this);
       this.onMouseOver=this.onMouseOver.bind(this);
       this.onMouseOut=this.onMouseOut.bind(this);
       this.dragStartHandler=this.dragStartHandler.bind(this);
       this.state={}

   }
    
    componentWillReceiveProps (nextProps) {
       
    }
    clickHandler(event) {
        if(this.props.disabled==true)
        {
            return ;
        }
       

        if(this.props.onClick!=null) {
            this.props.onClick(this.props.name, this.props.title, event);
        }
    }
    onMouseOver (event) {
      if(  this.props.onMouseOver)
      {
          this.props.onMouseOver(event);
      }
    }
    onMouseOut (event) {
        if(  this.props.onMouseOut)
        {
            this.props.onMouseOut(event);
        }
    }
 
    dragStartHandler(event) {
     
        var newele=this.props;
        window.localStorage.setItem("wasabidrageleProps",JSON.stringify(newele));
    }
    render() {
        
        let className = "wasabi-linkbutton ";//按钮样式
        if(this.props.className) {//自定义class
            className += " " + this.props.className;
        }
        //如果没有图标，只有文字
        if(!this.props.iconCls) {
            className += " " + "onlytext";//只有文字
        }
        let style=this.props.style?this.props.style:{};//设置按钮样式
 
        

        //注意这里只有按钮提示
        let title=(this.props.tip
            ? this.props.tip
            : this.props.title);
        if (!this.props.title ) {//纯图标
            return (<a draggable={this.props.draggable} onDragStart={this.dragStartHandler} title={title}
                       href={this.props.href} onClick={this.clickHandler}
                       className={className+" onlyicon"} disabled={this.props.disabled} name={this.props.name} style={style}>
                <i className={" "+this.props.iconCls} style={{color:this.iconColor, display:this.props.iconCls==""?"none":"inline-block"}}></i>
            </a>);
        }
        else {

            if (this.props.iconAlign == "right") {

                return (
                    <a ref="link" draggable={this.props.draggable} onDragStart={this.dragStartHandler} title={title}
                       href={this.props.href} onClick={this.clickHandler} onMouseOut={this.onMouseOut} onMouseOver={this.onMouseOver}
                       className={className} disabled={this.props.disabled} name={this.props.name} style={style}>
                        <div className="wasabi-linkbutton-text right" style={this.props.linkTextStyle}>{this.props.title}</div>
                        <i className={" "+this.props.iconCls}
                           style={{color:this.props.iconColor,display:this.props.iconCls==""?"none":"inline-block"}}></i>
                    </a>
                )
            }
            else if (this.props.iconAlign == "rightTop") {
                return (
                    <a ref="link"  draggable={this.props.draggable} onDragStart={this.dragStartHandler} title={title}
                       href={this.props.href} onClick={this.clickHandler} onMouseOut={this.onMouseOut} onMouseOver={this.onMouseOver}
                       className={className} disabled={this.props.disabled} name={this.props.name} style={style} >
                        <div className="wasabi-linkbutton-text" style={this.props.linkTextStyle}>{this.props.title}</div>
                        <i className={" "+this.props.iconCls+" icon-rightTop"}
                           style={{color:this.props.iconColor,display:this.props.iconCls==""?"none":"inline-block"}}></i>
                    </a>);

            }
            else if (this.props.iconAlign == "rightBottom"){
                return (
                    <a  ref="link" draggable={this.props.draggable}  onDragStart={this.dragStartHandler} title={title}
                       href={this.props.href} onClick={this.clickHandler} onMouseOut={this.onMouseOut} onMouseOver={this.onMouseOver}
                       className={className} disabled={this.props.disabled} name={this.props.name} style={style} >
                        <div className="wasabi-linkbutton-text" style={this.props.linkTextStyle}>{this.props.title}</div>
                        <i className={" "+this.props.iconCls+" icon-rightBottom"}
                           style={{color:this.props.iconColor,display:this.props.iconCls==""?"none":"inline-block"}}></i>
                    </a>);
            }
            else {
                return (

                    <a  ref="link" draggable={this.props.draggable} onDragStart={this.dragStartHandler} title={title}
                       href={this.props.href} onClick={this.clickHandler} onMouseOut={this.onMouseOut} onMouseOver={this.onMouseOver} className={className}
                       disabled={this.props.disabled}  name={this.props.name}  style={style}>
                        <i className={" "+this.props.iconCls}
                           style={{display:(this.props.iconCls==null||this.props.iconCls=="")?"none":"inline-block"}}></i>
                        <div className="wasabi-linkbutton-text left" style={this.props.linkTextStyle}>{this.props.title}</div>

                    </a>

                )
            }

        }

    }
}

LinkButton. propTypes={
    name:PropTypes.string,//名称
    title:PropTypes.string,//标题
    iconCls:PropTypes.string,//图片
    iconAlign:PropTypes.oneOf([
        "left",
        "right",
        "rightTop",
        "rightBottom"
    ]),//图片位置
    iconColor:PropTypes.string,
    tip:PropTypes.string,//提示信息
    textStyle:PropTypes.object,
    href:PropTypes.string,//链接地址
    onClick:PropTypes.func,//单击地址
    disabled:PropTypes.bool,//是否有效
    draggable:PropTypes.bool,//是否可拖动
   
};
LinkButton.defaultProps={   
        name:"",//关联值
        title:"",//标题
        iconCls:null,//默认为空
        iconAlign:"left",//图标位置
        iconColor:null,
        textStyle:{},
        tip:"",
        href:null,//连接地址
        onClick:null,//单击事件
        draggable:false,//是否允许拖动
        dragStartHandler:null,//拖动事件

};
export default LinkButton;