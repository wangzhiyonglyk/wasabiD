/*
 create by wangzhiyong
 date:2016-12-13
 desc:树节点组件
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
class  TreeNode extends Component{
  
   constructor(props)
   {
       super(props);
       this.state={
        isParent:this.props.isParent,
        value: this.props.value,
        text: this.props.text,
        rootValue:this.props.rootValue,
        rootText:this.props.rootText,
        tip: this.props.tip,
        iconCls: this.props.iconCls,
        iconClose: this.props.iconClose,
        iconOpen: this.props.iconOpen,
        open:this.props.open,
        checked:this.props.checked,
        checkAble:this.props.checkAble,
        checkType:this.props.checkedType,
        href: this.props.href,
        url: this.props.url,
        keyField: this.props.keyField,
        params:this.props.params,
        property:this.props.property,
        data:this.props.data,
        onSelect: this.props.onSelect,
        selected:this.props.rootValue==this.props.value?true:false,

       }
   }
    componentWillReceiveProps(nextProps) {
        this.setState({
            isParent: nextProps.isParent,
            value: nextProps.value,
            text: nextProps.text,
            rootValue: nextProps.rootValue,
            rootText: nextProps.rootText,
            tip: nextProps.tip,
            iconCls: nextProps.iconCls,
            iconClose: nextProps.iconClose,
            iconOpen: nextProps.iconOpen,
            checked: nextProps.checked,
            checkAble: nextProps.checkAble,
            checkType: nextProps.checkedType,
            href: nextProps.href,
            url: nextProps.url,
            keyField: nextProps.keyField,
            params: nextProps.params,
            property: nextProps.property,
            data: nextProps.data,
            onSelect: nextProps.onSelect,
            selected: nextProps.rootValue == nextProps.value ? true : false
        })
    }
    componentDidUpdate(){
    }
    showHandler () {
        this.setState({
            open:!this.state.open
        })
    }
    onSelect (value,text,property) {
        this.setState({
            selected: true,
        })
        if (this.props.onSelect != null) {
            this.props.onSelect(value, text,property)
        }
    }
    render () {
        var nodeControl=[];

        var tip=this.state.tip?this.state.tip:this.state.title;//提示信息
        if( this.state.data instanceof  Array)
        {
            this.state.data.map((item,index)=>{
                let isParent=false;//是否为父节点
                if(item.isParent==true||(item.data instanceof Array && item.data.length > 0)) {//如果明确规定了，或者子节点不为空，则设置为父节点
                    isParent = true;
                }
                else {

                }
                nodeControl.push(<TreeNode    rootValue={this.state.rootValue} rootText={this.state.rootText} {...item} isParent={isParent} onSelect={this.onSelect} key={index} />);
            });
        }
        var iconCls=this.state.iconCls;//默认图标图标
        if(this.state.isParent)
        {//如果是父节点
            if(this.state.open){//打开状态，
                iconCls=this.state.iconOpen?this.state.iconOpen:this.state.iconCls;
            }
            else {//关闭状态
                iconCls = this.state.iconClose?this.state.iconClose :this.state.iconCls;

            }
        }
        else
        {

        }
        return    <li ref="node" >
            <i className={this.state.open?"icon-drop":"icon-zright"} style={{display:this.state.isParent?"inline":"none"}} onClick={this.showHandler}></i>
            <a href={this.state.href} title={tip} onClick={this.onSelect.bind(this,this.state.value,this.state.text,null,this.state.property)} className={this.state.selected?"selected":""}>
                <i className={iconCls}></i> <cite>{this.state.text}</cite></a>
            <ul className={this.state.open?"show":""}>
                {nodeControl}
            </ul>
        </li>
    }
}

TreeNode.propTypes= {
    isParent:PropTypes.bool,//是否是父节点
    value:PropTypes.oneOfType([PropTypes.number,PropTypes.string]).isRequired,//值
    text:PropTypes.oneOfType([PropTypes.number,PropTypes.string]).isRequired,//标题
    rootValue:PropTypes.oneOfType([PropTypes.number,PropTypes.string]),//树的值
    rootText:PropTypes.oneOfType([PropTypes.number,PropTypes.string]),//树的值
    tip:PropTypes.string,//提示信息
    iconCls:PropTypes.string,//默认图标
    iconClose:PropTypes.string,//关闭图标
    iconOpen:PropTypes.string,//打开的图标
    open:PropTypes.bool,//是否处于打开状态
    checked:PropTypes.bool,//是否被勾选
    checkAble:PropTypes.bool,//是否允许勾选
    checkedType:PropTypes.object,//勾选对于父子节点的关联关系
    href:PropTypes.string,//节点的链接
    url:PropTypes.string,//子节点加载的url地址
    keyField:PropTypes.string,//向后台传输的字段名
    params:PropTypes.object,//向后台传输的额外参数
    property:PropTypes.any,//其他数据
    data:PropTypes.array,//子节点数据
    onSelect:PropTypes.func,//选中后的事件
};
TreeNode.defaultProps= {
   
        isParent: false,
        value: null,
        text: null,
        rootValue: null,
        rootText: null,
        tip: null,
        iconCls: "icon-file",//默认图标
        iconClose: "icon-folder",//默认图标
        iconOpen: "icon-open-folder",//默认图标
        open: false,
        checked: false,
        checkAble: false,
        checkType: {"Y": "ps", "N": "ps"},//默认勾选/取消勾选都影响父子节点
        href: "javascript:void(0)",//默认链接地址
        url: null,//TODO 暂时先不处理异步问题
        keyField: "id",
        params: null,
        property: null,
        data: [],
        onSelect: null,
    
};
 export default  TreeNode;