/**
 * create by wangzhiyong
 * date:2021-03-30
 * desc 树型表格
 */

/**
 * create by wangzhiyong
 * date:2020-12-21
 * desc 交叉表
 * desc
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import func from "../../libs/func";
import DataGrid from "../DataGrid";
import propsTran from "../../libs/propsTran";
import Tree from "../Tree";
import FetchModel from "../../Model/FetchModel";
import api from "wasabi-api"
import("./index.css")
class TreeGrid extends Component {
    constructor(props) {
        super(props);
        this.grid = React.createRef();
        this.tree = React.createRef();
        this.state = {
            headers: this.props.headers,
            url: this.props.url,
            params: null,
            rawParams:null,
            rawData: [],
            rowsTreeData: [],
            realGridData: [],
            loadData: false,
        }
        this.loadData = this.loadData.bind(this);
        this.loadSuccess = this.loadSuccess.bind(this);
        this.loadError = this.loadError.bind(this);
        this.treeClick=this.treeClick.bind(this);
        this.getChecked=this.getChecked.bind(this);
        this.setChecked=this.setChecked.bind(this);
        this.clearChecked=this.clearChecked.bind(this);
        this.checkedAll=this.checkedAll.bind(this);
        this.reload=this.reload.bind(this);
        this.dataGridClick=this.dataGridClick.bind(this);
        
    }
    static getDerivedStateFromProps(props, state) {
        let newState = {};

        if (props.url && props.params &&
            func.diff(props.params, state.rawParams)) {//如果有url
            newState = {
                reloadData: true,
                url: props.url,
                rawParams:func.clone( props.params),
                params: func.clone( props.params),
            }
        }
        if (props.data && props.data instanceof Array && func.diff(props.data, state.rawData)) {
            //如果传了死数据
            newState.rawData = props.data;
            let result = propsTran.formartData("treegrid", "", props.data, props.idField, props.textField);
            newState.realTreeData =result;
            /**
             *为了保存顺序，要根据树的数据，生成表格的数据 
             */
            let gridpush = (data) => {
                let result = [];
                if (data && data instanceof Array) {
                    for (let i = 0; i < data.length; i++) {
                        result.push(data[i]);
                        if (data[i].children && data[i].children.length > 0) {
                            result = result.concat(gridpush(data[i].children));
                        }
                    }
                }
                return result;
            }
            if (newState.realTreeData) {
                newState.realGridData = gridpush(newState.realTreeData);
            }
        }
        if (func.isEmptyObject(newState)) {
            return null;
        }
        else {
            return newState;
        }

    }
    componentDidUpdate() {
        if (this.state.reloadData) {
            this.setState({
                reloadData: false
            }, () => {
                this.loadData(this.state.url, this.state.params);
            })

        }
    }
    componentDidMount() {
       setTimeout(() => {
           //渲染后拿真正的宽度
          this.grid.current&&this.grid.current.computeHeaderStyleAndColumnWidth()
       }, 100);
    
    }
    loadData(url, params) {
        if (url) {
            let type = this.props.httpType ? this.props.httpType : "POST";
            type = type.toUpperCase();
            let fetchmodel = new FetchModel(url, this.loadSuccess, params, this.loadError);
            fetchmodel.headers = this.props.httpHeaders;
            if (this.props.contentType) {
                //如果传contentType值则采用传入的械
                //否则默认

                fetchmodel.contentType = this.props.contentType;
                fetchmodel.data = fetchmodel.contentType == "application/json" ? fetchmodel.data ? JSON.stringify(fetchmodel.data) : "{}" : fetchmodel.data;
            }
            console.log("treegrid-fetch", fetchmodel);
            let wasabi_api = window.api || api;
            wasabi_api.ajax(fetchmodel);

        }

    }
    loadSuccess(data) {//数据加载成功
        let realData = data;
        let realTreeData = [];
        let realGridData = [];
        if (this.props.dataSource == null) {
        }
        else {
            realData = func.getSource(data, this.props.dataSource);
        }
        //根据value值拿到text
        let result = propsTran.formartData("tree","", realData, this.props.idField, this.props.textField,this.props.simpleData);
        /**
            *为了保存顺序，要根据树的数据，生成表格的数据 
            */
        let gridpush = (data) => {
            let result = [];
            if (data && data instanceof Array) {
                for (let i = 0; i < data.length; i++) {
                    result.push(data[i]);
                    if (data[i].children && data[i].children.length > 0) {
                        result = result.concat(gridpush(data[i].children));
                    }
                }
            }
            return result;
        }
        if (realTreeData) {
            realGridData = gridpush(realTreeData);
        }
        this.setState({
            realTreeData: realTreeData,
            realGridData: realGridData,
            text: result.text,
        })
    }

    loadError(message) {//查询失败
        console.log("treepicker-error", message);
        Msg.error(message);
    }


    /**
     * 表格的单击事件
     * @param {*} rowData 
     * @param {*} rowIndex 
     */
    dataGridClick(rowData, rowIndex) {

        try{
            this.tree.current.input.current.setClickNode(rowData[this.props.idField || "id"]);

        }catch(e){

        }
      
        this.props.onClick && this.props.onClick(rowData);

    }
    /**
     * 树的单击事件
     * @param {*} id 
     * @param {*} text 
     * @param {*} children 
     * @param {*} nodeData 
     */
    treeClick(id, text, row) {
        this.grid.current.setClick(id);
        this.props.onClick && this.props.onClick(id, text, row);
    }
    /**
     * 树的勾选事件
     * @param {*} checked 
     * @param {*} id 
     * @param {*} text 
     * @param {*} row 
     */
    onChecked(checked, id, text, row) {
        this.props.onChecked && this.props.onChecked(checked,id,text, row);
    }


    /**
     * 树展开与折叠事件
     * @param {*} open 是否展开
     * @param {*} id id,
     * @param {*} text 文本
     * @param {*} row 当前行节点
     */
    onExpand( open, id, text, row) {

        let realGridData = propsTran.gridShowOrHideData(this.state.realGridData,open,row);
        this.setState({
            realGridData: realGridData
        })
        this.props.onExpand&&this.props.onExpand(open,id,text,row);
    }

     /**
      * 可调用
      * @returns 
      */

    /**
     * 获取勾选的数据
     * @returns 
     */
    getChecked() {
        try{
            return this.tree.current.input.current.getChecked();
        }
        catch(e){

        }
        return [];
       
    }
    /**
     * 
     * @param {*} value 
     * @returns 
     */
    setChecked(value){
        return this.tree.current.input.current.setChecked(value);
    }
    /**
     * 清除勾选
     */
    clearChecked(){
         this.tree.current.input.current.clearChecked();
    }
    /**
     * 勾选全部
     * @returns 
     */
    checkedAll(){
       return this.tree.current.input.current.clearChecked();
    }
    /**
     * 强制刷新
     */
    reload() {
        this.loadData(this.state.url, this.state.params);
    }
    render() {

        let treeTopHeight = 0;
        if (this.state.headers instanceof Array && this.state.headers.length > 0) {
            if (this.state.headers[0] instanceof Array) {
                treeTopHeight = this.state.headers.length * 42;
            }
            else {
                treeTopHeight = 42;
            }
        }

        return <div className={"wasabi-treegrid "+(this.props.className||"")} style={this.props.style}>
            <div className="wasabi-treegrid-left" style={{width:300}}>
                <div className="wasabi-treegrid-configuration" style={{ height: treeTopHeight ,lineHeight:treeTopHeight+"px"}}>
                    {this.props.treeHeader}
                </div>
                <div className="wasabi-treegrid-rowsData" >
                    <Tree isPivot={true} checkAble={this.props.checkAble} checkStyle={this.props.checkStyle}
                        ref={this.tree} onClick={this.treeClick.bind(this)} data={this.state.realTreeData} simpleData={true}
                        onChecked={this.onChecked.bind(this)} isPivot={true} onExpand={this.onExpand.bind(this)}
                    ></Tree>
                </div>
            </div>
            <div className="wasabi-treegrid-right">
                <DataGrid ref={this.grid} pagination={false} rowNumber={false}
                    headers={this.state.headers} data={this.state.realGridData}
                    isPivot={true}
                    onClick={this.dataGridClick.bind(this)}></DataGrid>
            </div>
        </div>
    }
}

TreeGrid.propTypes = {
    /**
     * 基本属性
     */
    style: PropTypes.object,
    className: PropTypes.string,
    idField: PropTypes.string,//数据字段值名称
    parentField: PropTypes.string,//数据字段父节点名称
    textField: PropTypes.string,//数据字段文本名称
    simpleData: PropTypes.bool,//是否使用简单的数据格式
    checkAble: PropTypes.bool,//是否允许勾选
    checkStyle: PropTypes.oneOf(["checkbox", "radio"]),//单选还是多选
    checkType: PropTypes.object,//勾选对于父子节点的关联关系
    radioType: PropTypes.oneOf(["level", "all"]),//单选时影响的层级
    /**
     * ajax请求参数
     */
    url: PropTypes.string, //ajax地址
    httpType: PropTypes.string,//请求类型
    contentType: PropTypes.string,//请求的参数传递类型
    httpHeaders: PropTypes.object,//请求的头部
    params: PropTypes.object, //查询条件
    /**
 * 数据源
 */
    dataSource: PropTypes.string, //ajax的返回的数据源中哪个属性作为数据源
    footerSource: PropTypes.string, //页脚数据源,
    totalSource: PropTypes.string, //ajax的返回的数据源中哪个属性作为总记录数源

    /**
 * 事件
 */
    onClick: PropTypes.func, //单击事件
    onDoubleClick: PropTypes.func, //双击事件
    onChecked: PropTypes.func, //监听表格中某一行被选中/取消
}
TreeGrid.defaultProps = {
    /**
    * 基本属性
    */
  
    idField: "id",
    parentField: "pId",
    textField: "text",
    simpleData: true,//默认为真
    checkAble: true,
    checkStyle: "checkbox",
    checkType: { "y": "ps", "n": "ps" },//默认勾选/取消勾选都影响父子节点，todo 暂时还没完成
    radioType: "all",//todo 

    /**
   * ajax请求参数
   */
  
    httpType: "POST",
    contentType: "application/x-www-form-urlencoded",
   

    /**
     * 数据源
     */
    dataSource: 'data', //
    footerSource: 'footer', //页脚数据源
    totalSource: 'total', //

}

export default TreeGrid;