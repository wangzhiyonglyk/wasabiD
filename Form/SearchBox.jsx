//create by wangzy
//date:2016-07-22
//desc:独立的筛选框
let React=require("react");
let DataGrid=require("../Data/DataGrid.jsx");
let unit=require("../libs/unit.js");
require("../Sass/Form/SearchBox.scss");
let SearchBox=React.createClass({
    propTypes: {
        name:React.PropTypes.string,//表单名称，
        title:React.PropTypes.string,//提示信息
        placeholder:React.PropTypes.string,//输入框提示信息
        valueField:React.PropTypes.string.isRequired,//表单value字段
        textField:React.PropTypes.string.isRequired,//表单text字段
        width:React.PropTypes.number,//宽度
        onSearch:React.PropTypes.func,//查询事件

    },
    getDefaultProps:function(){
        return{
           title:null,
            valueField:"value",
            textField:"text",
            params:null,
            width:null,
            onSearch:null,


        }
    },
    getInitialState:function() {
        return {

            params:null,
            filterValue:"",//筛选框的值
        }
    },
    onKeyUp:function(event) {//回车查询
        if (event.keyCode == 13) {
            this.beginSearch();
        }
    },
    beginSearch:function() {//开始查询
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

    },
    clearData:function() {
        this.setState({
            filterValue: "",
            params: null,
        })
    },
    onChange:function(event) {


        this.setState({
            filterValue:event.target.value.toString().trim()
        })
    },
    render:function() {
        return<div   className="wasabi-searchbox" style={{width:this.props.width}}><input type="text" title={this.props.title} placeholder={this.props.placeholder}  onKeyUp={this.onKeyUp} value={this.state.filterValue} onChange={this.onChange} />
                <div className="icon" onClick={this.beginSearch}></div>
            </div>
    }
});
module .exports=SearchBox;