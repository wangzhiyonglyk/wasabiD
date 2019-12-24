/*
create by wangzhiyong 创建树组件

 */


import React, { Component } from "react";
import PropTypes from "prop-types";

import Message from "../Unit/Message";
import FetchModel from "../Model/FetchModel";
import  TreeNode from "./TreeNode.jsx";
import  unit from "../libs/unit.js";
import showUpdate from "../Mixins/showUpdate.js";
require("../Sass/Data/Tree.css");
 class  Tree extends Component{
constructor(props)
{
    super(props);
    var newData=  this.setValueAndText(this.props.data);//对数据进行处理
    this.state={
        name:this.props.name,
        text: this.props.text,
        value: this.props.value,
        data:newData,
       
    }
}

componentWillReceiveProps(nextProps) {
      
    if (nextProps.url) {

        if (nextProps.url != this.props.url) {
            this.loadData(nextProps.url, nextProps.params);
        }
        else if (this.showUpdate(nextProps.params, this.props.params)) {//如果不相同则更新
            this.loadData(nextProps.url, nextProps.params);
        }

    } else if (nextProps.data && nextProps.data instanceof Array) {//又传了数组
        if (nextProps.data.length != this.props.data.length) {
                this.setState({
                    data:nextProps.data,
                    value:"",
                    text:""
                })
        }else{
            let newData=[];
            for(let i=0;i<nextProps.data.length;i++)
        {
            let obj=nextProps.data[i];
            obj.text=nextProps.data[i][this.props.textField];
            obj.value=nextProps.data[i][this.props.valueField];
          
            newData.push(obj);
        }
        if(newData[0].text!=this.state.data[0].text||newData[newData.length-1].text!=this.state.data[this.state.data.length-1].text)
        {this.setState({
            data:nextProps.data,
            value:"",
            text:""
        })

        }
    }
    }
}
   

    componentDidMount () {
        this.loadData(this.state.url,this.state.params);
    }
    showUpdate(newParam, oldParam) {
        showUpdate.call(this, newParam, oldParam);
    }
    loadData(url,params) {
        if(url!=null&&url!="")
        {
            if(params==null)
            {
                var fetchmodel=new FetchModel(url,this.loadSuccess,null,this.loadError);
                unit.fetch.get(fetchmodel);
            }
            else

            {
                var fetchmodel=new FetchModel(url,this.loadSuccess,params,this.loadError);
                unit.fetch.post(fetchmodel);
            }
            console.log("treepicker",fetchmodel);
        }
    }
    loadSuccess(data) {//数据加载成功
        var realData=data;
        if(this.props.dataSource==null) {
        }
        else {
            realData=unit.getSource(data,this.props.dataSource);
        }

        realData=this.setValueAndText(realData);
        this.setState({
            data:realData,
        })
    }
    setValueAndText (realData) {//遍历设置text，value的值
        if(realData instanceof  Array) {
            for (let i = 0; i < realData.length; i++) {
                realData[i].text = realData[i][this.props.textField];
                realData[i].value = realData[i][this.props.valueField];
                if (realData[i].data) {
                    realData[i].data = this.setValueAndText(realData[i].data);
                }
            }

        }

        return realData;
    }
    loadError(errorCode,message) {//查询失败
        console.log("treepicker-error",errorCode,message);
        Message. error(message);
    }
    onSelect (value,text,row) {
       
    
        if(value==undefined)
        {
            console.error("绑定的valueField没有")
        }
        if(text==undefined)
        {
            console.error("绑定的textField没有");
        }
        this.setState({
            value:value,
            text:text
        })
        this.props.onSelect(this.state.value, this.state.text, this.props.name, row);
    }
    render () {
        var nodeControl=[];
        if(this.state.data instanceof  Array)
        {
            this.state.data.map((item,index)=>{
                let isParent=false;//是否为父节点
                if(item.isParent==true||(item.data instanceof Array && item.data.length > 0)) {//如果明确规定了，或者子节点不为空，则设置为父节点
                    isParent = true;
                }
                else {

                }
                nodeControl.push(<TreeNode key={index} rootValue={this.state.value} rootText={this.state.text} {...item} isParent={isParent}
                     onSelect={this.onSelect} />);
            });
        }
        return <ul className="wasabi-tree">
            {nodeControl}
        </ul>
    }
}
    
Tree. propTypes= {
    name:PropTypes.string,//树名称
     value:PropTypes.oneOfType([PropTypes.number,PropTypes.string]),//值
    text:PropTypes.oneOfType([PropTypes.number,PropTypes.string]),//标题
    valueField: PropTypes.string,//数据字段值名称
    textField:PropTypes.string,//数据字段文本名称
    url:PropTypes.string,//后台查询地址
    params:PropTypes.object,//向后台传输的额外参数
    dataSource:PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
    data:PropTypes.array,//节点数据
    onSelect:PropTypes.func,//选中后的事件

}
Tree.defaultProps= {

    name:null,
    text:null,
    value:null,
    valueField:"value",
    textField:"text",
    url:null,
    params:null,
    dataSource:"data",
    data:[],
    onSelect:null,

}
export default Tree;