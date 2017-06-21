/**
 * Created by wangzhiyong on 2016/10/30.
 * 创建单表应用组件
 */
let React=require("react");

let SearchBar =require("../Form/SearchBar.jsx");
let Form =require("../Form/Form.jsx");
let Toolbar =require("../Buttons/Toolbar.jsx");
let DataGrid =require("../Data/DataGrid.jsx");
let SlidePanel =require("../Layout/SlidePanel.jsx");
 let SingleHandlerMixins=require("./Mixins/SingleHandlerMixins.jsx");
 let SingleModelMixins=require("./Mixins/SingleModelMixins.jsx");
let Single=React.createClass({
        mixins: [SingleHandlerMixins, SingleModelMixins],
        propTypes: {
            title: React.PropTypes.string.isRequired,//页面的标题
            controller: React.PropTypes.string.isRequired,//控制器名称
            key:React.PropTypes.string,//主键名称
            corsUrl: React.PropTypes.string,//跨域地址
        
            params: React.PropTypes.object,//默认的筛选条件
            modelUrl:React.PropTypes.string,//数据模型地址url
            getUrl:React.PropTypes.string,//实例地址url
            addUrl: React.PropTypes.string,//新增地址url
            deleteUrl: React.PropTypes.string,//修改地址url
            updateUrl: React.PropTypes.string,//更新地址url
            queryUrl: React.PropTypes.string,//不分页查询url
            pageUrl:React.PropTypes.string,//分页查询url
            overrideModel:React.PropTypes.func,//对数据模型再进一步处理,有返回值
            submitTheme:React.PropTypes.string,//提交按钮主题
        },
        getDefaultProps: function () {
            return {
                title: "",
                controller: null,
                key:"id",
                corsUrl: "/",//默认当前域名下
                params:null,//默认条件为空
                modelUrl:null,
                getUrl:null,
                addUrl:null,
                deleteUrl:null,
                updateUrl:null,
                queryUrl:null,
                pageUrl:null,
                overrideModel:null,
                submitTheme:"green",
            }
        },
        getInitialState: function () {
            return {
                panelTitle:"",//面板标题
                opType:"",//当前操作类型
                modelUrl:this.modelUrl(),//生成单表数据模型的url地址,
                getUrl:null,//生成实例url地址
                addUrl: null,//生成新增url地址
                deleteUrl:null,//生成删除url地址
                updateUrl: null,//生成更新url
                queryUrl: null,//生成不分页url
                pageUrl: null,//分页的url
                filterModel: [],//筛选数据模型
                model: [],//表单模型,
                disabled: false,//表单是否只读
                buttons: [],//操作按钮模型
                headers: [],//列表表头
                submitButton:this.submitButton(false),//提交按钮对象
                params: this.props.params,//列表筛选条件

            }
        },
        componentDidMount:function() {
            this.initModel();//初始化数据模型
        },
        render: function () {
          return  <div>
                <div
                    style={{display:(this.state.filterModel==null||(this.state.filterModel instanceof Array&&this.state.filterModel.length==0))?"none":"block"}}>
                    <SearchBar ref="searchbar" model={this.state.filterModel}
                               filterHandler={this.filterHandler}></SearchBar></div>
                <div
                    style={{display:(this.state.buttons==null ||(this.state.buttons instanceof Array&&this.state.buttons.length==0))?"none":"block"}}>
                    <Toolbar ref="toolbar" buttons={this.state.buttons} buttonClick={this.btnHandler}></Toolbar>
                </div>
                <DataGrid ref="datagrid" url={this.state.pageUrl} params={this.state.params}
                          headers={this.state.headers}></DataGrid>
                <SlidePanel ref="slide" title={this.state.panelTitle} buttons={[ this.state.submitButton]} buttonClick={this.submitHandler}>
                    <Form ref="form" model={this.state.model} submitHide={true} closeHide={true}
                          disabled={this.state.disabled}></Form>
                </SlidePanel>
            </div>

        }
    })
module .exports=Single;