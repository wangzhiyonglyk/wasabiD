//create by wangzy
//date:2016-07-22
//desc:独立的筛选框
let React=require("react");
let DataGrid=require("../Data/DataGrid.jsx");
let unit=require("../../libs/unit.js");
require("../../sass/Base/Form/SearchBox.scss");
let SearchBox=React.createClass({
    propTypes: {
        name:React.PropTypes.string,//表单名称，
        placeHolder:React.PropTypes.func,//输入框提示信息
        valueField:React.PropTypes.string.isRequired,//表单value字段
        textField:React.PropTypes.string.isRequired,//表单text字段
        params:React.PropTypes.object,//其他参数
        width:React.PropTypes.number,//宽度
        onSearch:React.PropTypes.func,//查询事件

    },
    getDefaultProps:function(){
        return{

            valueField:"value",
            textField:"text",
            params:null,
            width:null,
            onSearch:null,


        }
    },
    getInitialState:function() {
        return {
            params:this.props.params,//默认筛选条件
            filterValue:"",//筛选框的值
        }
    },
    onKeyUp:function(event) {//回车查询
        if (event.keyCode == 13) {
            this.beginSearch();
        }
    },
    beginSearch:function() {//开始查询
        if(this.state.filterValue=="")
        {
            return ;
        }
        let params = this.state.params;

        if (params) {
            for(let v in params)
            {
                params[v]=this.state.filterValue;
            }
        }
        else {
            params = {};//初始化
            params[this.props.valueField] = this.state.filterValue;
            params[this.props.textField] = this.state.filterValue;
        }

        this.setState({
            params: params
        });
        if(this.props.onSearch!=null)
        {
            this.props.onSearch(params,this.props.name);
        }

    },
    onChange:function(event) {


        this.setState({
            filterValue:event.target.value.toString().trim()
        })
    },
    render:function() {
        return<div   className="wasabi-searchbox"><input type="text" placeHolder={this.state.placeHolder}  onKeyUp={this.onKeyUp} value={this.state.filterValue} onChange={this.onChange} />
                <div className="icon" onClick={this.beginSearch}></div>
            </div>
    }
});
module .exports=SearchBox;