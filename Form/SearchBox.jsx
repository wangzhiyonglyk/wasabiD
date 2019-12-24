//create by wangzy
//date:2016-07-22
//desc:独立的筛选框
import React, {Component} from "react";
import PropTypes from "prop-types";

import ("../Sass/Form/SearchBox.css");
class  SearchBox extends Component{
   
   constructor(props)
   {
       super(props);
       this.state={
        params:null,
        filterValue:"",//筛选框的值
       }
       this.onKeyUp=this.onKeyUp.bind(this);
       this.beginSearch=this.beginSearch.bind(this);
       this.clearData=this.clearData.bind(this);
       this.onChange=this.onChange.bind(this);
   }
    onKeyUp(event) {//回车查询
        if (event.keyCode == 13) {
            this.beginSearch();
        }
    }

    beginSearch() {//开始查询
        let params = this.state.params;
        if (params) {


        }
        else {
            params = {};//初始化
        }
        params[this.props.valueField] = this.state.filterValue;
        params[this.props.textField] = this.state.filterValue;
        

        this.setState({
            params: params
        });
        if(this.props.onSearch!=null)
        {
            this.props.onSearch(params,this.props.name);
        }

    }
    clearData() {
        this.setState({
            filterValue: "",
            params: null,
        })
    }
    onChange(event) {


        this.setState({
            filterValue:event.target.value.toString().trim()
        })
    }
    render() {
        return<div   className={"wasabi-searchbox "+this.props.className} style={this.props.style}><input type="text" title={this.props.title} placeholder={this.props.placeholder}  onKeyUp={this.onKeyUp} value={this.state.filterValue} onChange={this.onChange} />
                <div className="icon" onClick={this.beginSearch}></div>
            </div>
    }
};

SearchBox.propTypes= {
    name:PropTypes.string,//表单名称，
    title:PropTypes.string,//提示信息
    placeholder:PropTypes.string,//输入框提示信息
    valueField:PropTypes.string.isRequired,//表单value字段
    textField:PropTypes.string.isRequired,//表单text字段
    style:PropTypes.object,//
    className:PropTypes.string,
    onSearch:PropTypes.func,//查询事件

};
SearchBox.defaultProps={

       title:null,
        valueField:"value",
        textField:"text",
        params:null,
        className:"",
        style:{},
        onSearch:null,


};
export default SearchBox;