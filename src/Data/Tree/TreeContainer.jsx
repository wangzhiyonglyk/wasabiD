/*
create by wangzhiyong 树组件业务容器
 创建 date:2022-01-06 树组件业务容器，用于tree,treegrid,pivot，操作逻辑是一样的
date :2022-01-07 修复tregrid单击联动的bug
todo 后期应该改成 render props的形式 目前不熟悉，暂时不动
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Msg from "../../Info/Msg";
import func from "../../libs/func.js";
import treeFunc from "./treeFunc";
import propsTran from "../../libs/propsTran";
import api from "wasabi-api"
import "./tree.css"
import config from "./config";
import TreeView from "./TreeView";
import TreeGridView from "../TreeGrid/TreeGridView";
import PivotView from "../Pivot/PivotView"
class TreeContainer extends Component {
    constructor(props) {
        super(props);
        this.treegrid = React.createRef();
        this.pivot = React.createRef();
        this.state = {
            treecontainerid: func.uuid(),
            treeid: func.uuid(),
            rawData: [],
            data: [],
            visibleData: [],//可见数据
            filterValue: "",
            filter: [],
            clickId: "",//单击的id
            loadingId: "",//正在异步的节点
            reVirualConfig: false,
        }
        //单击与双击需要改变样式
        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onChecked = this.onChecked.bind(this)
        this.onExpand = this.onExpand.bind(this)
        this.onRename = this.onRename.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onScroll = this.onScroll.bind(this)

        this.getChecked = this.getChecked.bind(this);
        this.setChecked = this.setChecked.bind(this);
        this.clearChecked = this.clearChecked.bind(this);
        this.checkedAll = this.checkedAll.bind(this);
        this.setClick = this.setClick.bind(this);
        this.remove = this.remove.bind(this);
        this.filter = func.throttle(this.filter.bind(this),300).bind(this);
        this.append = this.append.bind(this);
        this.adjust = this.adjust.bind(this);







    }
    //todo
    static getDerivedStateFromProps(props, state) {
        let newState = {};
        if (props.data && props.data instanceof Array && func.diff(props.data, state.rawData)) {
            newState.rawData = (props.data);
            let flatData = func.treeDataToFlatData(props.data)
            newState.data = func.clone(props.data);
            newState.flatData = flatData;//数据扁平化

            newState.reVirualConfig = true;
            return newState;

        }
        return null;

    }
    /**
     * 单击事件
     * @param {*} id 值
     * @param {*} text 文本
     * @param {*} row 
     */
    onClick(id, text, row) {

        try {
            this.setState({
                clickId: id,
            })
            this.treegrid?.current?.grid?.current.setFocus(id);
            this.pivot?.current?.grid?.current.setFocus(id);
            this.props.onClick && this.props.onClick(id, text, row);

        } catch (e) {

        }


    }

    /**
     * 双击事件
     * @param {*} id 
     * @param {*} text 
     * @param {*} children 
     */
    onDoubleClick(id, text, row) {
        this.props.onDoubleClick && this.props.onDoubleClick(id, text, row);
    }
    /**
       * 节点勾选
       * @param {*} id 
       * @param {*} text 
       * @param {*} row 
       * @param {*} checkValue 
       */
    onChecked(id, text, row, checkValue) {
        let checked = (id + "") === (checkValue + "");
        let data = [];
        if (this.props.checkStyle === "checkbox") {
            data = treeFunc.setChecked(this.state.data, row, checked, this.props.checkType);
            this.handlerLoadData(data);
        }
        else if (this.props.checkStyle === "radio") {
            data = treeFunc.setRadioChecked(this.state.data, row, checked, this.props.radioType);
            this.handlerLoadData(data);
        }

        this.props.onChecked && this.props.onChecked(checked, id, text, row);

    }
    /**
     * 树展开与折叠事件
     * @param {*} open 是否展开
     * @param {*} id id,
     * @param {*} text 文本
     * @param {*} children  子节点
     */
    onExpand(open, id, text, row) {
        let data = treeFunc.setOpen(this.state.data, row);//先处理折叠
        if (this.props.asyncAble && (!row.children || row.children.length == 0)) {//没有数据
            let asyncChildrenData = [];
            if (this.props.onAsync && typeof this.props.onAsync === "function") {//自行处理
                this.setState({
                    loadingId: id
                })
                asyncChildrenData = this.props.onAsync(id, text, row);//得到数据
                if (asyncChildrenData && asyncChildrenData instanceof Array && asyncChildrenData.length > 0) {
                    //格式化数据
                    asyncChildrenData = propsTran.formatterData("tree", "", asyncChildrenData, this.props.idField || "id", this.props.textField || "text", this.props.parentField || "pId", true);
                    data = treeFunc.appendChildren(data, row, asyncChildrenData);
                    this.handlerLoadData(data);
                }
            }
            else if (this.props.url) {
                //没有设置异步函数
                window.sessionStorage.setItem("async-tree-node", JSON.stringify(row));
                let params = func.clone(this.props.params) || {};
                params[this.props.idField || "id"] = id;
                let fetchmodel = { type: this.props.httpType || "post", url: this.props.url, success: this.loadSuccess, data: this.props.params, error: this.loadError };
                fetchmodel.headers = this.props.httpHeaders;
                fetchmodel.contentType = this.props.contentType;
                let wasabi_api = window.api || api;
                this.setState({
                    loadingId: id,
                    data: data,
                })
                wasabi_api.ajax(fetchmodel);
                console.log("tree async-fetch", fetchmodel);
            }

        }
        else {
            this.handlerLoadData(data);
        }

        this.props.onExpand && this.props.onExpand(open, id, text, row);

    }

    /**
     * 重命名
     * @param {*} id 
     * @param {*} text 
     * @param {*} row 
     * @param {*} newText 
     */
    onRename(id, text, row, newText) {
        let data = treeFunc.renameNode(this.state.data, row, newText);
        this.handlerLoadData(data);
        this.props.onRename && this.props.onRename(id, text, row, newText);
    }
    /**
    * 处理删除与移动时的删除
    * @param {*}
    */
    onRemove(id, text, row) {
        Msg.confirm("您确定删除[" + text + "]吗？", () => {
            let data = treeFunc.removeNode(this.state.data, row);
            this.handlerLoadData(data);
            this.props.onRemove && this.props.onRemove(id, text, row);
        })

    }

    /**
     * 停靠事件
     * @param {*} dragNode 移动节点
     * @param {*} dropNode 停靠节点
     * @param {*} dragType 停靠方式
     */
    onDrop(dragNode, dropNode, dragType) {
        if (dragNode.id !== dropNode.id) {
            let data = [];
            if (dragType == "in") {
                if (dragNode.pId !== dropNode.id) {
                    data = treeFunc.moveInNode(this.state.data, dragNode, dropNode);

                } else {
                    return;
                }
            }
            else if (dragType == "before") {
                data = treeFunc.moveBeforeNode(this.state.data, dragNode, dropNode);
            }
            else if (dragType == "after") {
                data = treeFunc.moveAterNode(this.state.data, dragNode, dropNode);
            }
            this.props.onDrop && this.props.onDrop(dragNode, dropNode, dragType);
            this.handlerLoadData(data);
        }

    }

    /********  以下方法是给父组件调用的 **************/
    /**
    * 返回勾选的数据
    */
    getChecked() {
        return treeFunc.getChecked(this.state.data);
    }
    /**
     * 设置勾选
     */
    setChecked(id, checked) {
        if (id) {
            //先找到节点
            let node = treeFunc.findNodeById(this.state.data, id);
            if (node)
                node.checked = checked;
            {
                if (this.props.checkStyle === "checkbox") {
                    data = treeFunc.setChecked(this.state.data, node, checked, this.props.checkType);
                }
                else if (this.props.checkStyle === "radio") {
                    data = treeFunc.setRadioChecked(this.state.data, node, checked, this.props.radioType);
                }
                this.handlerLoadData(this.state.data);
                return node;
            }
        }
        return null;


    }
    /**
    * 清除勾选
    */
    clearChecked() {
        let data = treeFunc.clearChecked(this.state.data);
        this.handlerLoadData(data);
        return data;
    }
    /**
     * 全部勾选
     */
    checkedAll() {
        if (this.props.checkStyle === "checkbox") {
            let data = treeFunc.checkedAll(this.state.data);
            this.handlerLoadData(data);
            return data;
        }

    }
    /**
    * 为了给交叉表与树表格内部使用的单击事件
    * @param {*} id 
     */
    setClick(id) {
        let node = treeFunc.findNodeById(this.state.visibleData, id);
        if (!node) {
            //没有找到,节点不可见,滚动到可见
            let index = this.state.flatData.findIndex((item) => {
                return item.id === id;
            })
            this.scrollShowVisibleData(index, index + this.visibleDataCount);
        }
        this.setState({
            clickId: id,

        }, () => {

        })
        //如果是树表格或者交叉表
        this.pivot?.current?.grid?.current.setFocus(id);
        this.treegrid?.current?.grid?.current.setFocus(id);

    }
    /**
      * 删除某个节点，给父组件调用
      * @param {*} row 节点
      */
    remove(row) {
        if (row && row._path) {
            let data = treeFunc.removeNode(this.state.data, row);
            this.handlerLoadData(data);
            this.props.onRemove && this.props.onRemove(row.id, row.text, row);
        }
        else if (row.id) {
            let findNode = treeFunc.findNodeById(this.state.data, row.id);
            let data = treeFunc.removeNode(this.state.data, findNode);
            this.handlerLoadData(data);
            this.props.onRemove && this.props.onRemove(row.id, row.text, row);
        }

    }
    /**
     * 筛选节点
     * @param {*} value 
     */
    filter(value) {
        this.handlerLoadData(this.state.data, value);
    }
    /**
     * 添加节点
     * @param {*} children 
     * @param {*}node
     */
    append(children, node = null) {
        if (children && children.length > 0) {
            let data = treeFunc.appendChildren(this.state.data, children, node);
            this.handlerLoadData(data);
        }
    }

    /**
    * 重新调整
    */
    adjust() {
        try {
            //重新设计高度 
            let height = document.getElementById(this.state.treecontainerid).clientHeight || window.innerHeight;
            this.visibleDataCount = Math.ceil(height / config.rowDefaultHeight);
            this.onScroll();
        }

        catch (e) {
            console.log("ee", e)
        }
    }

    /********  以上方法是给父组件调用的 **************/


    /**
     * 对请求的数据加工
     * @param {*} data 加工的数据
     * @param {*} filterValue 筛选值
     */
    handlerLoadData(data, filterValue) {
        //同时处理筛选数据保持一致 
        let filter = treeFunc.filter(data, filterValue || this.state.filterValue);
        //数据扁平化
        let flatData = func.treeDataToFlatData(this.state.filterValue ? filter : data);
        //切割
        let sliceData = flatData.slice(this.sliceBeginIndex, this.sliceEndIndex);
        //设置可见的数据的操作相关属性，因为对数据的checked,open,都是存在data中
        let visibleData = treeFunc.setVisibleDataProps(sliceData, this.state.data);
        this.setState({
            filter: filter,
            data: data,
            flatData: flatData,
            sliceData: sliceData,
            visibleData: visibleData,
            loadingId: null
        })
    }
    componentDidMount() {
    }
    componentDidUpdate() {
        if (this.state.reVirualConfig) {
            this.visibleDataInit();
        }

    }
    /**
     * 可见数据初始化
     */
    visibleDataInit() {
        let height = document.getElementById(this.state.treecontainerid).clientHeight || window.innerHeight;
        this.visibleDataCount = Math.ceil(height / config.rowDefaultHeight);
        document.getElementById(this.state.treecontainerid).scrollTop = 0;
        document.getElementById(this.state.treeid).style.transform = `translate3d(0,0,0)`;
        this.scrollShowVisibleData(0, this.visibleDataCount);
    }

    /**
     * 滚动事件
     */
    onScroll() {
        let scrollTop = document.getElementById(this.state.treecontainerid).scrollTop
        let startIndex = Math.floor(scrollTop / config.rowDefaultHeight);
        let endIndex = startIndex + config.bufferScale * this.visibleDataCount;
        this.scrollShowVisibleData(startIndex, endIndex)

    }
    /**
   * 渲染当前可见数据
   * @param {*} startIndex 可见区数据的开始下标
   * @param {*} endIndex 可见区数据的结束下标
   */
    scrollShowVisibleData(startIndex, endIndex) {
        let startOffset;
        if (startIndex >= 1) {
            //减去上部预留的高度
            let size = (startIndex + 1) * config.rowDefaultHeight - (startIndex - config.bufferScale * this.visibleDataCount >= 0 ? (startIndex - config.bufferScale * this.visibleDataCount) * config.rowDefaultHeight : 0);
            startOffset = startIndex * config.rowDefaultHeight - size;
        } else {
            startOffset = 0;
        }
        document.getElementById(this.state.treeid).style.transform = `translate3d(0,${startOffset}px,0)`;

        //当前切割的数据开始下标
        this.sliceBeginIndex = startIndex - config.bufferScale * this.visibleDataCount;
        this.sliceBeginIndex = this.sliceBeginIndex < 0 ? 0 : this.sliceBeginIndex;
        // //当前切割的数据结束下标
        this.sliceEndIndex = endIndex + config.bufferScale * this.visibleDataCount;
        let sliceData = this.state.flatData.slice(this.sliceBeginIndex, this.sliceEndIndex);

        //对可见的数据设置属性，因为对数据的操作都在data
        let visibleData = treeFunc.setVisibleDataProps(sliceData, this.state.data);
        this.setState({
            visibleData: visibleData,
            reVirualConfig: false
        })
    }
    /**
   * 
   * @param {*} message 
   */
    loadError(message) {//查询失败
        console.log("combobox-error", message);
        this.setState({
            loadingId: ""
        })
        Msg.error(message);
    }
    /**
     * 数据加载成功
     * @param {*} data 
     */
    loadSuccess(res) {//数据加载成功
        if (typeof this.props.loadSuccess === "function") {
            //正确返回
            let resData = this.props.loadSuccess(res);
            res = resData && resData instanceof Array ? resData : res;
        }
        let realData = func.getSource(res, this.props.dataSource || "data");
        let row = window.sessionStorage.getItem("async-tree-node");
        row = JSON.parse(row);
        let asyncChildrenData = propsTran.formatterData("tree", "", realData, this.props.idField || "id", this.props.textField || "text", this.props.parentField || "pId", true);
        let data = this.state.data;
        nodes = treeFunc.findLinkNodesByPath(data, row._path);
        if (nodes && nodes.length > 0) {
            let leaf = nodes[nodes.length - 1];
            leaf.children = asyncChildrenData;
            //设置节点路径
            treeFunc.setChildrenPath(leaf.id, leaf._path, leaf.children);
        }
        this.handlerLoadData(data);

    }
    shouldComponentUpdate(nextProps, nextState) {
        //全部用浅判断
        if (func.diff(nextProps, this.props, false)) {
            return true;
        }
        if (func.diff(nextState, this.state, false)) {
            return true;
        }
        return false;
    }
    render() {
        //全局事件
        const treeEvents = {
            beforeDrag: this.props.beforeDrag,
            beforeRemove: this.props.beforeRemove,
            beforeDrop: this.props.beforeDrop,
            beforeRename: this.props.beforeRename,
            onClick: this.onClick,
            onDoubleClick: this.onDoubleClick,
            onChecked: this.onChecked,
            onRemove: this.onRemove,
            onExpand: this.onExpand,
            onRename: this.onRename,
            onDrop: this.onDrop,
            onDrag: this.props.onDrag
        }
        let control;
        if (this.props.componentType === "tree") {
            control = <TreeView {...this.props} {...this.state} {...treeEvents} ></TreeView>
        }
        else if (this.props.componentType === "treegrid") {
            control = <TreeGridView ref={this.treegrid} {...this.props} {...this.state} {...treeEvents} ></TreeGridView>
        }
        else {
            control = <PivotView ref={this.pivot} {...this.props} {...this.state} {...treeEvents} ></PivotView>
        }

        return <div id={this.state.treecontainerid} onScroll={this.onScroll}
            className={"wasabi-tree-parent " + (this.props.className || "")}
            style={this.props.style}>
            {control}
            <div style={{ left: 0, top: 0, height: this.state.flatData && this.state.flatData.length * config.rowDefaultHeight, position: "absolute", width: 1 }}></div>
        </div>

    }
}
TreeContainer.propTypes = {
    componentType: PropTypes.oneOf(["tree", "treegrid", "pivot"]),//类型
    name: PropTypes.string,//树名称
    idField: PropTypes.string,//数据字段值名称
    parentField: PropTypes.string,//数据字段父节点名称
    textField: PropTypes.string,//数据字段文本名称
    dotted: PropTypes.bool,//是否有虚线
    url: PropTypes.string,//后台查询地址

    params: PropTypes.object,//向后台传输的额外参数
    dataSource: PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
    headers: PropTypes.array,//表头
    data: PropTypes.array,//节点数据
    simpleData: PropTypes.bool,//是否使用简单的数据格式
    selectAble: PropTypes.bool,//是否允许勾选
    checkStyle: PropTypes.oneOf(["checkbox", "radio", PropTypes.func]),//单选还是多选
    checkType: PropTypes.object,//勾选对于父子节点的关联关系
    radioType: PropTypes.oneOf(["level", "all"]),//单选时影响的层级
    renameAble: PropTypes.bool,//是否允许重命名
    removeAble: PropTypes.bool,//是否允许移除
    asyncAble: PropTypes.bool,//是否可以异步加载数据

    //after事件
    onClick: PropTypes.func,//单击的事件
    onDoubleClick: PropTypes.func,//双击事件
    onCheck: PropTypes.func,//勾选/取消勾选事件
    onExpand: PropTypes.func,//展开事件
    onRename: PropTypes.func,//重命名事件
    onRemove: PropTypes.func,//删除事件
    onRightClick: PropTypes.func,//右键菜单
    onDrag: PropTypes.func,//拖动事件
    onDrop: PropTypes.func,//停靠事件
    onAsync: PropTypes.func,//异步查询

    //before 事件
    beforeDrag: PropTypes.func,//拖动前事件
    beforeDrop: PropTypes.func,//停靠前事件
    beforeRemove: PropTypes.func,//删除前事件
    beforeRename: PropTypes.func,//重命名前事件
    beforeRightClick: PropTypes.func,//鼠标右键前事件

}
TreeContainer.defaultProps = {
    componentType: "tree",
    idField: "id",
    parentField: "pId",
    textField: "text",
    dataSource: "data",
    dotted: true,
    simpleData: true,//默认为真
    selectAble: true,
    checkStyle: "checkbox",
    checkType: { "y": "ps", "n": "ps" },//默认勾选/取消勾选都影响父子节点，todo 暂时还没完成
    radioType: "all",//todo 



}
export default TreeContainer