/*
create by wangzhiyong
 date:2016-07
create by wangzhiyong 创建树组件
 edit 2020-10 参照ztree改造
 2021-06-16 重新优化
 desc:树下拉选择
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Msg from "../../Info/Msg";
import TreeNode from "./TreeNode.jsx";
import func from "../../libs/func.js";
import loadDataHoc from "../../loadDataHoc"
import treeFunc from "./treeFunc";
import propsTran from "../../libs/propsTran";
import api from "wasabi-api"
import("./tree.css")

class Tree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rawData: [],
            data: [],
            filterValue: "",
            filter: [],
            clickId: "",//单击的id
            loadingId: "",//正在异步的节点
        }
        //单击与双击需要改变样式
        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onChecked = this.onChecked.bind(this)
        this.getChecked = this.getChecked.bind(this);
        this.clearChecked = this.clearChecked.bind(this);
        this.setClickNode = this.setClickNode.bind(this);
        this.onExpand = this.onExpand.bind(this)
        this.onRename = this.onRename.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.loadError = this.loadError.bind(this);
        this.loadSuccess = this.loadSuccess.bind(this);
        this.filter = this.filter.bind(this);
        this.append = this.append.bind(this)
    }
    //todo
    static getDerivedStateFromProps(props, state) {
        let newState = {};
        if (props.data && props.data instanceof Array && func.diff(props.data, state.rawData)) {
            /**
             * 因为此组件需要对数据进行增删改
             * 其他组件统一交由loadDataHoc处理了
             */
            newState.rawData = (props.data);
            newState.data = func.clone(props.data);

        }
        return newState;
    }
    /**
     * 单击事件
     * @param {*} id 值
     * @param {*} text 文本
     * @param {*} row 
     */
    onClick(id, text, row) {
        if (this.props.isPivot) {
            setTimeout(() => {
                this.setState({
                    clickId: id,
                })
            }, 20);
        } else {
            this.setState({
                clickId: id,
            })
        }
        this.props.onClick && this.props.onClick(id, text, row);

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
                asyncChildrenData = this.props.onAsync(id, text, row);//得到数据
                if (asyncChildrenData && asyncChildrenData instanceof Array && asyncChildrenData.length > 0) {
                    //格式化数据
                    asyncChildrenData = propsTran.formartData("tree", "", asyncChildrenData, this.props.idField || "id", this.props.textField || "text", this.props.parentField || "pId", true);
                    data = treeFunc.appendChildren(data, row, asyncChildrenData);
                    //同时处理保持一致
                    let filter = treeFunc.filter(data, this.state.filterValue);
                    this.setState({
                        data: data,
                        filter: filter,
                        loadingId: id
                    })
                }
                else {
                    //没有返回值，可能异步处理了
                    this.setState({
                        loadingId: row.id,
                        data: data
                    })
                }

            }
            else if (this.props.url) {
                window.sessionStorage.setItem("async-tree-node", JSON.stringify(row));
                let params = func.clone(this.props.params) || {};
                params[this.props.idField || "id"] = id;
                let fetchmodel = { type: this.props.httpType || "post", url: this.props.url, success: this.loadSuccess, data: this.props.params, error: this.loadError };
                fetchmodel.headers = this.props.httpHeaders;
                if (this.props.contentType) {
                    //如果传contentType值则采用传入的械
                    //否则默认
                    fetchmodel.contentType = this.props.contentType;
                    fetchmodel.data = fetchmodel.contentType == "application/json" ? fetchmodel.data ? JSON.stringify(fetchmodel.data) : "{}" : fetchmodel.data;
                }
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
            let filter = treeFunc.filter(data, this.state.filterValue);
            this.setState({
                data: data,
                filter: filter,

            })
        }

        this.props.onExpand && this.props.onExpand(open, id, text, row);

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
        let asyncChildrenData = propsTran.formartData("tree", "", realData, this.props.idField || "id", this.props.textField || "text", this.props.parentField || "pId", true);
        let data = this.state.data;
        nodes = treeFunc.findLeafNodes(data, row_path);
        if (nodes && nodes.length > 0) {
            let leaf = nodes[nodes.length - 1];
            leaf.children = asyncChildrenData;
            //设置节点路径
            treeFunc.setChildrenPath(leaf.id, leaf._path, leaf.children);
        }
        //同时处理保持一致
        let filter = treeFunc.filter(data, this.state.filterValue);

        this.setState({
            data: data,
            filter: filter,
            loadingId: ""
        })
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
        //同时处理保持一致
        let filter = treeFunc.filter(data, this.state.filterValue);
        this.setState({
            data: data,
            filter: filter
        })
        this.props.onRename && this.props.onRename(id, text, row, newText);
    }
    /**
    * 处理删除与移动时的删除
    * @param {*}
    */
    onRemove(id, text, row) {
        Msg.confirm("您确定删除[" + text + "]吗？", () => {
            let data = treeFunc.removeNode(this.state.data, row);
            //同时处理保持一致
            let filter = treeFunc.filter(data, this.state.filterValue);
            this.setState({
                data: data,
                filter: filter
            })
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
            //同时处理保持一致
            let filter = treeFunc.filter(data, this.state.filterValue);
            this.setState({
                data: data,
                filter: filter
            })
        }

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
        }
        else {
            data = treeFunc.setRadioChecked(this.state.data, row, checked, this.props.radioType);
        }
        //同时处理保持一致
        let filter = treeFunc.filter(data, this.state.filterValue);
        this.setState({
            data: data,
            filter: filter
        }, () => {
            this.props.onChecked && this.props.onChecked(checked, id, text, row);
        })

    }
    /**
    * 返回勾选的数据
    */
    getChecked() {
        return treeFunc.getChecked(this.state.data);
    }
    /**
     * 设置勾选
     */
    setChecked(value) {
        if (value) {
           let data = treeFunc.setSelfChecked(value, this.state.data);
            let filter = treeFunc.filter(data, this.state.filterValue);
            this.setState({
                data: data,
                filter
            })

        }
        else {
            this.clearChecked();
        }

    }
    /**
    * 清除勾选
    */
    clearChecked() {
        let data = treeFunc.clearChecked(this.state.data);
        //同时处理保持一致
        let filter = treeFunc.filter(data, this.state.filterValue);
        this.setState({
            data: data,
            filter: filter,
        })
    }
    /**
     * 全部勾选
     */
    checkedAll() {
        if (this.props.checkStyle === "checkbox") {

            let data = treeFunc.checkedAll(this.state.data);
            //同时处理保持一致
            let filter = treeFunc.filter(data, this.state.filterValue);
            this.setState({
                data: data,
                filter: filter,
            })
            return data;
        }

    }
    /**
    * 为了给交叉表与树表格内部使用的单击事件
    * @param {*} id 
     */
    setClickNode(id) {
        this.setState({
            clickId: id,

        }, () => {

        })


    }
    /**
      * 删除某个节点，给父组件调用
      * @param {*} row 节点
      */
    remove(row) {
        if (row && row._path) {
            let data = treeFunc.removeNode(this.state.data, row);
            //同时处理保持一致
            let filter = treeFunc.filter(data, this.state.filterValue);
            this.setState({
                data: data,
                filter: filter
            })
            this.props.onRemove && this.props.onRemove(row.id, row.text, row);
        }

    }
    /**
     * 筛选节点
     * @param {*} key 
     */
    filter(key) {
        let filter = treeFunc.filter(this.state.data, key);
        this.setState({
            filterValue: key.trim(),
            filter: filter
        })
    }
    /**
     * 添加节点
     * @param {*} children 
     * @param {*}node
     */
    append(children, node = null) {

        if (children && children.length > 0) {
            let data = treeFunc.appendChildren(this.state.data, children, node);
            this.setState({
                data: data,
                loadingId: ""
            }, () => {

            })
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (func.diffOrder(nextProps, this.props)) {
            return true;
        }
        if (func.diff(nextState, this.state)) {
            return true;
        }
        return false;
    }
    render() {
        let nodeControl = [];
        //全局属性
        const { checkAble, checkStyle, renameAble, removeAble, asyncAble } = this.props;
        //得到传下去的属性
        const treeProps = { checkAble, checkStyle, renameAble, removeAble, asyncAble, clickId: this.state.clickId, loadingId: this.state.loadingId };
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
        let data = this.state.filterValue ? this.state.filter : this.state.data;
        if (data instanceof Array && data.length > 0) {
            data.map((item, index) => {
                let isParent = false;//是否为父节点
                if (item.isParent == true || (item.children instanceof Array && item.children.length > 0)) {//如果明确规定了，或者子节点不为空，则设置为父节点
                    isParent = true;
                }

                //通过输入框的值与自身的勾选情况综合判断
                nodeControl.push(<TreeNode
                    key={"treenode-" + item.id + "-" + index}
                    {
                    ...treeProps
                    }
                    {...item}
                    isParent={isParent}
                    {
                    ...treeEvents
                    }


                />);
            });
        }
        return <ul className={"wasabi-tree clearfix " + (this.props.className || "")} style={this.props.style}>
            {nodeControl}
        </ul>


    }
}
Tree.propTypes = {
    name: PropTypes.string,//树名称
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),//选中的id值
    text: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),//选中的标题
    idField: PropTypes.string,//数据字段值名称
    parentField: PropTypes.string,//数据字段父节点名称
    textField: PropTypes.string,//数据字段文本名称
    url: PropTypes.string,//后台查询地址
    params: PropTypes.object,//向后台传输的额外参数
    dataSource: PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
    data: PropTypes.array,//节点数据
    simpleData: PropTypes.bool,//是否使用简单的数据格式
    checkAble: PropTypes.bool,//是否允许勾选
    checkStyle: PropTypes.oneOf(["checkbox", "radio"]),//单选还是多选
    checkType: PropTypes.object,//勾选对于父子节点的关联关系
    radioType: PropTypes.oneOf(["level", "all"]),//单选时影响的层级
    renameAble: PropTypes.bool,//是否允许重命名
    removeAble: PropTypes.bool,//是否允许移除
    asyncAble: PropTypes.bool,//是否可以异步加载数据

    //after事件
    onClick: PropTypes.func,//单击的事件
    onDoubleClick: PropTypes.func,//双击事件
    onCheck: PropTypes.func,//勾选/取消勾选事件
    onCollapse: PropTypes.func,//折叠事件
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
    /**
     * pivot 专门为交叉提供的属性
     */
    isPivot: PropTypes.bool
}
Tree.defaultProps = {
    idField: "id",
    parentField: "pId",
    textField: "text",
    dataSource: "data",
    simpleData: true,//默认为真
    checkAble: true,
    checkStyle: "checkbox",
    checkType: { "y": "ps", "n": "ps" },//默认勾选/取消勾选都影响父子节点，todo 暂时还没完成
    radioType: "all",//todo 



}
export default loadDataHoc(Tree, "tree");